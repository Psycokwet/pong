import {
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
import { JwtService } from '@nestjs/jwt';
import { LocalFilesService } from 'src/localFiles/localFiles.service';

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
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    private jwtService: JwtService,
    private localFilesService: LocalFilesService,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({
      username: username,
    });
  }

  async signup(dto: UserDto) {
    // database operation
    const user = User.create({
      username: dto.username,
      email: dto.email,
    });
    user.user_rank = 1; //a remplacer
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

    if (user) return user.user_rank;

    // User not found
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'User not found',
      },
      HttpStatus.BAD_REQUEST,
    );
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

  async get_picture(dto: User) {
    const user = await this.usersRepository.findOne({
      where: { username: dto.username },
      relations: { picture: true },
    });

    if (!user.picture) {
      throw new NotFoundException();
      // return null if picture === null
    }

    return user.picture.path;
  }

  async set_picture(user: User, fileData: LocalFileDto) {
    // delete old file
    try {
      const old_file_path = await this.get_picture(user);
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
