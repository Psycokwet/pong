import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { Game } from 'src/game/game.entity';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { Friend } from 'src/friend_list/friend.entity';
import { pongUsernameDto } from './set-pongusername.dto';
import { LocalFilesService } from 'src/localFiles/localFiles.service';
import { Socket } from 'socket.io';
import { AuthService, TokenPayload } from 'src/auth/auth.service';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { UsersWebsockets } from 'shared/interfaces/UserWebsockets';
import { UserInterface } from 'shared/interfaces/UserInterface';
import { v4 as uuidv4 } from 'uuid';
import UserProfile from 'shared/interfaces/UserProfile';
import { Blocked } from 'src/blocked/blocked.entity';
import { ConnectionStatus } from 'shared/enumerations/ConnectionStatus';
import { GameColors } from 'shared/types/GameColors';
import { Status } from 'shared/interfaces/UserStatus';
import { validate } from 'class-validator';

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
    @InjectRepository(Blocked)
    private blockedRepository: Repository<Blocked>,

    private localFilesService: LocalFilesService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public static userWebsockets: UsersWebsockets[] = [];

  getStatusFromUser(user: User, payload: TokenPayload): ConnectionStatus {
    let result: ConnectionStatus = ConnectionStatus.Unknown;
    if (user.isUserFullySignedUp === false)
      return ConnectionStatus.SignupRequested;
    if (user.isTwoFactorAuthenticationActivated === false)
      return ConnectionStatus.Connected;
    if (user.isTwoFactorAuthenticationActivated === true)
      if (payload.isTwoFactorAuthenticated) return ConnectionStatus.Connected;
      else return ConnectionStatus.TwoFactorAuthenticationRequested;

    return result;
  }

  async findOne(login42: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      login42: login42,
    });
    if (!user) throw new BadRequestException({ error: 'User not found' });
    return user;
  }

  async findOneByPongUsername(pongUsername: string): Promise<User> {
    return await this.usersRepository.findOneBy({
      pongUsername: pongUsername,
    });
  }

  async signup(dto: UserDto): Promise<User> {
    // database operation, ugly but it follows TypeORM tutorial
    // https://orkhan.gitbook.io/typeorm/docs/validation

    let userValidation = new User();
    userValidation.login42 = dto.login42;
    userValidation.pongUsername = uuidv4();
    userValidation.email = dto.email;
    userValidation.isTwoFactorAuthenticationActivated = false;
    userValidation.isUserFullySignedUp = false;

    const errors = await validate(userValidation);
    if (errors.length > 0) {
      throw new BadRequestException({
        message: errors.map((error) => error.constraints),
      });
    } else return await this.dataSource.manager.save(userValidation);
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
    const profileElements: UserProfile = {
      pongUsername: user.pongUsername,
      userRank: await await this.getUserRank(user),
      userHistory: await this.getUserHistory(user),
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
            time: game.createdAt.toLocaleString('fr-FR', {
              timeZone: 'Europe/Paris',
            }),
            opponent:
              game.player1.id === user.id
                ? game.player2.pongUsername
                : game.player1.pongUsername,
            winner:
              game.winner === game.player1.id
                ? game.player1.pongUsername
                : game.player2.pongUsername,
            id: game.id,
          };
        })
        .sort((a, b) => b.id - a.id),
    };
  }

  async addFriend(friend: User, caller: User) {
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
          pongUsername: friend.user.pongUsername,
          status: this.getStatus(friend.user),
          image_url: 'TMP_FIX', //To replace later of course...
        };
      },
    );

    return orderedFriendsList;
  }

  async setTwoFactorAuthenticationSecret(secret: string, login42: string) {
    const user = await this.findOne(login42);

    /* We use TypeORM's update function to update our entity */
    await this.usersRepository.update(user.id, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  async getTwoFactorAuthentication(login42: string) {
    const user = await this.findOne(login42);

    return user.isTwoFactorAuthenticationActivated;
  }

  async setTwoFactorAuthentication(user: User, value: boolean) {
    await this.usersRepository.update(user.id, {
      isTwoFactorAuthenticationActivated: value,
      isUserFullySignedUp: true,
    });
  }

  async getPongUsername(user: User) {
    return { pongUsername: user.pongUsername };
  }

  async getLogin42(user: User) {
    return { login42: user.login42 };
  }

  async setPongUsername(dto: pongUsernameDto, user: User) {
    /* We use TypeORM's update function to update our entity */
    try {
      await this.usersRepository.update(user.id, {
        pongUsername: dto.newPongUsername,
        isUserFullySignedUp: true,
      });
    } catch (e) {
      throw new BadRequestException({ error: 'Nickname already taken' });
    }
  }
  async setGameColors(colors: GameColors, user: User) {
    /* We use TypeORM's update function to update our entity */
    try {
      await this.usersRepository.update(user.id, {
        gameColors: JSON.stringify(colors),
      });
    } catch (e) {
      throw new BadRequestException({ error: 'Nickname already taken' });
    }
  }

  async getPicture(login42: string) {
    const user = await this.usersRepository.findOne({
      where: { login42: login42 },
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
      const old_file_path = await this.getPicture(user.login42);
      this.localFilesService.delete_file(old_file_path);
    } catch (e) {
      this.logger.error('No existing picture file');
      // delete file if path exists
    }

    // save in db oldfile
    const picture = await this.localFilesService.saveLocalFileData(fileData);
    await this.usersRepository.update(user.id, {
      pictureId: picture.id,
      isUserFullySignedUp: true,
    });
  }

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    if (cookie) {
      const { Authentication: authenticationToken } = parse(cookie);
      try {
        const user = await this.authService.getUserFromAuthenticationToken(
          authenticationToken,
        );
        if (!user) {
          throw new WsException('Invalid credentials.');
        }
        return user;
      } catch (e) {
        console.error(e.message);
        throw new WsException('Invalid credentials.');
      }
    }
  }

  getUserIdWebsocket(receiverId: number): UsersWebsockets | undefined {
    return UsersService.userWebsockets.find(
      (receiver) => receiver.userId === receiverId,
    );
  }

  getStatus(user: User) {
    const isConnected = this.getUserIdWebsocket(user.id);

    if (isConnected) return Status.ONLINE;
    else return Status.OFFLINE;
  }

  async addBlockedUser(userToBlock: User, caller: User) {
    /* Checking if the caller is blocking himself (I think this should never 
      happen on the front side) */
    if (caller.id === userToBlock.id) {
      throw new BadRequestException({
        error: 'You cannot block yourself',
      });
    }

    /* Then we check if the person the caller wants to block is already
      in our blocked list and throw a 400 if they are */
    const doubleBlockCheck = await this.blockedRepository.findOne({
      relations: {
        blockedUser: true,
      },
      where: { blockedId: userToBlock.id, userId: caller.id },
    });

    if (doubleBlockCheck) {
      throw new BadRequestException({
        error: 'User is already blocked',
      });
    }

    /* Finally the profile we want to block is registered in our Blocked db */
    const addBlockedUser = Blocked.create({
      blockedId: userToBlock.id,
      userId: caller.id,
      blockedUser: userToBlock,
    });

    await addBlockedUser.save();
  }

  async getBlockedUsersList(caller: User): Promise<
    | {
        id: number;
        pongUsername: string;
      }[]
    | undefined
  > {
    const rawBlockedList: Blocked[] = await this.blockedRepository.find({
      relations: {
        blockedUser: true,
      },
      where: { userId: caller.id },
    });

    const orderedBlockedList: { id: number; pongUsername: string }[] =
      rawBlockedList.map((blocked: Blocked) => {
        return {
          id: blocked.blockedUser.id,
          pongUsername: blocked.blockedUser.pongUsername,
        };
      });

    return orderedBlockedList;
  }
}
