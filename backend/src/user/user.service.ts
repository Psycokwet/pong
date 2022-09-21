import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Game } from 'src/game/game.entity';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { Friend } from 'src/friend_list/friend.entity';
import { AddFriendDto } from './add-friend.dto';
import { pongUsernameDto } from './set-pongusername.dto';
import { GetFriendsListDto } from './get-friends-list.dto';
import { JwtService } from '@nestjs/jwt';
import { LocalFilesService } from 'src/localFiles/localFiles.service';

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

  getFrontUsername(user: User) {
    if (!user.pongUsername) return user.login42;
    return user.pongUsername;
  }

  async signup(dto: UserDto) {
    // database operation
    const user = User.create({
      login42: dto.login42,
      email: dto.email,
    });

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

  async getUserRank(dto: Omit<UserDto, 'password'>) {
    const user = await this.findOne(dto.login42);

    if (user) return { rank: user.user_rank };

    // User not found
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'User not found',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async getUserHistory(dto: Omit<UserDto, 'password'>) {
    /*  Get calling user's object */
    const user = await this.usersRepository.findOne({
      where: { login42: dto.login42 },
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

  async getFriendsList(login42: string) {
    /* Same logic as getUserHistory */
    const user = await this.findOne(login42);

    const friendsList = await this.friendRepository.find({
      relations: {
        user: true,
      },
      where: { user_id: user.id },
    });

    return friendsList;
  }

  async getPongUsername(login42: string) {
    const user = await this.findOne(login42);
    return { pongUsername: this.getFrontUsername(user) };
  }

  async setPongUsername(dto: pongUsernameDto, login42: string) {
    const user = await this.findOne(login42);

    /* We use TypeORM's update function to update our entity */
    await this.usersRepository.update(user.id, {
      pongUsername: dto.newPongUsername,
    });
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