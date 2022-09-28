import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { Game } from 'src/game/game.entity';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { Friend } from 'src/friend_list/friend.entity';
import { AddFriendDto } from './add-friend.dto';
import { pongUsernameDto } from './set-pongusername.dto';
import { JwtService } from '@nestjs/jwt';
import { LocalFilesService } from 'src/localFiles/localFiles.service';
import { UserInterface } from 'shared/interfaces/User';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream } from 'fs';
import { join } from 'path';
import UserProfile from 'shared/interfaces/UserProfile';

// This should be a real class/interface representing a user entity
export type UserLocal = { userId: number; login42: string; password: string };

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
    private jwtService: JwtService,
    private localFilesService: LocalFilesService,
  ) {}

  async findOne(login42: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      login42: login42,
    });
    if (!user) throw new BadRequestException({ error: 'User not found' });
    return user;
  }

  async findOneByPongUsername(pongUsername: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      pongUsername: pongUsername,
    });

    if (!user) throw new BadRequestException({ error: 'User not found' });

    return user;
  }

  getFrontUsername(user: User) {
    if (!user.pongUsername) return user.login42;
    return user.pongUsername;
  }

  async signup(dto: UserDto) {
    // database operation
    const user = User.create({
      login42: dto.login42,
      pongUsername: uuidv4(),
      email: dto.email,
      xp: 0,
    });

    //user.xp = 0;

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
    return await this.findOne(dto.login42);
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

  async getUserByIdWithMessages(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: {
        messages: true,
      },
    });
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

  async getUserProfile(user: User) {
    let profilePicture: StreamableFile | null = null;
    try {
      const picture_path = await this.getPicture(user);
      const file = createReadStream(join(process.cwd(), `${picture_path}`));
      profilePicture = new StreamableFile(file);
    } catch (error) {}
    const profileElements: UserProfile = {
      pongUsername: user.pongUsername,
      userRank: await await this.getUserRank(user),
      userHistory: await this.getUserHistory(user),
      profilePicture: profilePicture,
    };
    return profileElements;
  }

  async getUserRank(user: User) {
    let level: number;

    if (user.xp !== 0) level = Math.log(user.xp);
    else level = 0;

    /* Keeping the below 2 comments to remind myself of queries */
    // SELECT id, username, RANK() OVER(ORDER BY public.user.xp DESC) Rank FROM "user"  --  subquery
    // SELECT rank FROM (SELECT id, username, RANK() OVER(ORDER BY public.user.xp DESC) rank FROM "user") AS coco WHERE id = 1;  --  query

    const userRank = await this.dataSource
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

    return { level, userRank };
  }

  async getUserHistory(user: User) {
    /*  Get a games object where player 1 and player 2 exist and the calling user
        is either one or the other (where: ...) */
    const games = await this.gameRepository.find({
      relations: {
        player1: true,
        player2: true,
      },
      where: [{ player1_id: user.id }, { player2_id: user.id }],
    });

    if (!games)
      return {
        nbGames: 0,
        nbWins: 0,
        games: [],
      };

    const nbGames = games.length;
    const nbWins = games.filter((game) => {
      return game.winner == user.id;
    }).length;

    return {
      nbGames,
      nbWins,
      games: games
        .map((game) => {
          return {
            time: game.createdAt.toString().slice(4, 24),
            opponent:
              game.player1.id === user.id
                ? this.getFrontUsername(game.player2)
                : this.getFrontUsername(game.player1),
            winner:
              game.winner === game.player1.id
                ? this.getFrontUsername(game.player1)
                : this.getFrontUsername(game.player2),
            id: game.id,
          };
        })
        .sort((a, b) => b.id - a.id),
    };
  }

  async addFriend(dto: AddFriendDto, login42: string) {
    /* First we get the caller (person who is initiating the friend request) 
    and friend in our db */
    const caller = await this.findOne(login42);
    const friend = await this.findOne(dto.friend_to_add);

    /* Checking if the caller is adding himself (I think this should never 
      happen on the front side) */
    if (caller.id === friend.id) {
      throw new BadRequestException({
        error: 'You cannot add yourself',
      });
    }

    /* Then we check if the person the caller wants to add as a friend is already
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

  async getFriendsList(caller: User) {
    /* Same logic as getUserHistory */
    const rawFriendsList = await this.friendRepository.find({
      relations: {
        user: true,
      },
      where: { user_id: caller.id },
    });

    const orderedFriendsList: UserInterface[] = await rawFriendsList.map(
      (friend) => {
        return {
          id: friend.user.id,
          pongUsername: this.getFrontUsername(friend.user),
        };
      },
    );

    return orderedFriendsList;
  }

  async getPongUsername(login42: string) {
    const user = await this.findOne(login42);
    return { pongUsername: this.getFrontUsername(user) };
  }

  async getLogin42(login42: string) {
    const user = await this.findOne(login42);
    return { login42: user.login42 };
  }

  async setPongUsername(dto: pongUsernameDto, login42: string) {
    const user = await this.findOne(login42);

    /* We use TypeORM's update function to update our entity */
    try {
      await this.usersRepository.update(user.id, {
        pongUsername: dto.newPongUsername,
      });
    } catch (e) {
      throw new BadRequestException({ error: 'Nickname already taken' });
    }
  }

  async getPicture(dto: User) {
    const user = await this.usersRepository.findOne({
      where: { login42: dto.login42 },
      relations: { picture: true },
    });

    if (!user.picture) {
      throw new NotFoundException();
      // return null if picture === null
    }

    return user.picture.path;
  }

  async setPicture(user: User, fileData: LocalFileDto) {
    // delete old file
    try {
      const old_file_path = await this.getPicture(user);
      this.localFilesService.delete_file(old_file_path);
    } catch (e) {
      this.logger.error('No existing picture file');
      // delete file if path exists
    }

    // save in db oldfile
    const picture = await this.localFilesService.saveLocalFileData(fileData);
    await this.usersRepository.update(user.id, {
      pictureId: picture.id,
    });
  }
}
