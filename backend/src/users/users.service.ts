import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
<<<<<<< HEAD
import { AuthUserIdDto } from 'src/auth/auth-user.dto';
import { LocalFilesService } from 'src/localFiles/localFiles.service';
=======
>>>>>>> main

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
<<<<<<< HEAD
    private localFilesService: LocalFilesService
=======
>>>>>>> main
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

  async get_picture(dto: User ) {
    const user = await this.usersRepository.findOne({
      where: { username: dto.username },
      relations: { picture: true }
    })

    if (!user.picture) {
      throw new NotFoundException;
      // return null if picture === null
    }

    return user.picture.path;
  }
  
  async set_picture( user: User, fileData: LocalFileDto) {
    // delete old file
    const old_file_path = await this.get_picture(user);
    if (old_file_path) { // delete file if path exists
      this.localFilesService.delete_file(old_file_path);
    }

    // save in db oldfile
    const picture = await this.localFilesService.saveLocalFileData(fileData);
    await this.usersRepository.update(user.id, {
      pictureId: picture.id
    })
  }
}
