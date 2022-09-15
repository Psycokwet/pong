import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './user.entity';
import { Game } from 'src/game/game.entity';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import * as PasswordValidator from 'password-validator';
import { AddFriendDto } from './add-friend.dto';
import { Friend } from 'src/friend_list/friend_list.entity';
import { GetFriendsListDto } from './get-friends-list.dto';

// const passwordValidator = require('password-validator');
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/jwt.strategy';

// This should be a real class/interface representing a user entity
export type UserLocal = { userId: number; username: string; password: string };

async function crypt(password: string): Promise<string> {
  return bcrypt.genSalt(10).then((s) => bcrypt.hash(password, s));
}

async function passwordCompare(password: string, hash: string): Promise<boolean> {
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

    private jwtService: JwtService
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({
      username: username,
    });
  }


  async signup (dto: UserDto) {
    if (!UserDto.passwordScheme.validate(dto.password)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Password should contains 8 character minimum, it should had uppercase, lowercase and minimum 2 digits to be valid',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hash = await crypt(dto.password);

    // database operation
    const user = User.create({
        username: dto.username,
        password: hash,
        email: dto.email,
    });
    user.user_rank = 1;
    try {
      await user.save();
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Username or Email already used',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return;
  }

  async signin(dto: Omit<UserDto, 'email'>) {
    const user = await this.findOne(dto.username);

    if (await passwordCompare(dto.password, user.password)) {
      const user = await this.findOne(dto.username)
      
      const payload: JwtPayload = { username: user.username, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    // password did not match
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'Username and Password did not match',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async signout() {
    // destroy session
  }

  async get_user_rank(dto: Omit <UserDto, 'password'>) {
    const user = await this.findOne(dto.username);
    
    return user.user_rank;
  }

  async get_user_history(dto: Omit<UserDto, 'password'>) {
    
    /*  Get calling user's object */
    const user = await this.usersRepository.findOne({
      where: { username: dto.username }
    })

    /*  Get a games object where player 1 and player 2 exist and the calling user
        is either one or the other (where: ...) */
    const games = await this.gameRepository.find( {
      relations: {
        player1: true,
        player2: true,
      },
      where: [ 
        {player1_id: user.id},
        {player2_id: user.id},
      ]
    })
    
    return {
      user,
      games,
    };
  }

  async add_friend(dto: AddFriendDto) {
    
    const friendEntity = new Friend();
    const caller = await this.usersRepository.findOne({
      where: {username: dto.username}
    })
    const friend = await this.usersRepository.findOne({
      where: {username: dto.friend_to_add}
    })

    /* Need to ask Clement if refacto is possible for Bad Requests... */

    if (!caller) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!friend) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Did not find person you wanted to add',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    
    const addFriend = Friend.create( {
        friend_id: friend.id,
        user_id: caller.id,
      } )

    try {
      await addFriend.save();
    }
    catch (e) {
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'Friend is already in friends list',
      },
      HttpStatus.BAD_REQUEST,
    );
    }
  }

  // async get_friends_list(dto: GetFriendsListDto) {
  //   const friends = await 
  // }
}
