import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  LockNotSupportedOnGivenDriverError,
  Repository,
} from 'typeorm';
import { User } from './user.entity';
import { Game } from 'src/game/game.entity';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { Friend } from 'src/friend_list/friend.entity';
import { AddFriendDto } from './add-friend.dto';
import { SetUsernameDto } from './set-username.dto';
import { GetFriendsListDto } from './get-friends-list.dto';
import { PlayGameDto } from './play-game.dto';
import { from } from 'rxjs';

// This should be a real class/interface representing a user entity
export type UserLocal = { userId: number; username: string; password: string };

async function crypt(password: string): Promise<string> {
  return bcrypt.genSalt(10).then((s) => bcrypt.hash(password, s));
}

async function passwordCompare(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Game)
    private gameRepository: Repository<Game>,

    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
  ) {}

  async findOne(username: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      username: username,
    });
    if (!user) throw new BadRequestException({ error: 'User not found' });
    return user;
  }

  async signup(dto: UserDto) {
    // database operation
    const user = User.create({
      username: dto.username,
      email: dto.email,
    });

    user.xp = 0;
    // user.lv = 0;
    try {
      return await user.save();
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Username or Email already used',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async signin(dto: Omit<UserDto, 'email'>) {
    return await this.findOne(dto.username);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await crypt(refreshToken);

    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await passwordCompare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async get_user_rank(dto: Omit<UserDto, 'password'>) {
    const user = await this.findOne(dto.username);

    const level = Math.log(user.xp);

    // SELECT id, username, RANK() OVER(ORDER BY public.user.xp DESC) Rank FROM "user"  --  subquery
    // SELECT rank FROM (SELECT id, username, RANK() OVER(ORDER BY public.user.xp DESC) rank FROM "user") AS coco WHERE id = 1;  --  query
    const userRanked = await this.dataSource
      .createQueryBuilder()
      .select('rank')
      .from(
        (subQuery) =>
          subQuery
            .select('id')
            .from(User, 'user')
            .addSelect('RANK() OVER(ORDER BY xp DESC) as "rank"'),
        'user',
      )
      .where('id = :id', { id: user.id })
      .getRawOne();

    return { level, userRanked };
  }

  async get_user_history(dto: Omit<UserDto, 'password'>) {
    /*  Get calling user's object */
    const user = await this.usersRepository.findOne({
      where: { username: dto.username },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    /*  Get a games object where player 1 and player 2 exist and the calling user
        is either one or the other (where: ...) */
    const games = await this.gameRepository.find({
      relations: {
        player1: true,
        player2: true,
      },
      where: [{ player1_id: user.id }, { player2_id: user.id }],
    });

    return {
      user,
      games,
    };
  }

  async play_game(dto: PlayGameDto) {
    const player1 = await this.findOne(dto.player1);
    const player2 = await this.findOne(dto.player2);
    const winner = await this.findOne(dto.winner);

    const newGame = Game.create({
      player1_id: player1.id,
      player2_id: player2.id,
      winner: winner.id,
      player1: player1,
      player2: player2,
    });

    await newGame.save();

    this.usersRepository
      .createQueryBuilder()
      .update(winner)
      .set({ xp: winner.xp + 2 })
      .where({ id: winner.id })
      .execute();
  }

  async add_friend(dto: AddFriendDto) {
    /* First we get the caller (person who is initiating the friend request) 
    and friend in our db */
    const caller = await this.findOne(dto.username);

    const friend = await this.findOne(dto.friend_to_add);

    /* Checking if the caller is adding himself (I think this should never 
      happen on the front side) */
    if (caller.id === friend.id) {
      throw new BadRequestException({
        error: 'You cannot add yourself',
      });
    }

    /* Then we check if the perso the caller wants to add as a friend is already
    in our friend list and throw a 400 if they are */
    const doubleAddCheck = await this.friendRepository.findOne({
      relations: {
        user: true,
      },
      where: { friend_id: friend.id, user_id: caller.id },
    });

    if (doubleAddCheck) {
      throw new BadRequestException({
        error: 'User is already in friends list',
      });
    }

    /* Finally the profile we want to add as a friend is registered in our db */
    const addFriend = Friend.create({
      friend_id: friend.id,
      user_id: caller.id,
      user: friend,
    });

    await addFriend.save();
  }

  async get_friends_list(dto: GetFriendsListDto) {
    /* Same logic as get_user_history */
    const user = await this.findOne(dto.username);

    const friendsList = await this.friendRepository.find({
      relations: {
        user: true,
      },
      where: { user_id: user.id },
    });

    return friendsList;
  }

  async get_username(dto: UserDto) {
    const user = await this.findOne(dto.username);
    return user.username;
  }

  async set_username(dto: SetUsernameDto) {
    const user = await this.findOne(dto.username);

    /* We use TypeORM's query builder to update our entity */
    this.usersRepository
      .createQueryBuilder()
      .update(user)
      .set({ username: dto.new_username })
      .where({ id: user.id })
      .execute();
  }
}
