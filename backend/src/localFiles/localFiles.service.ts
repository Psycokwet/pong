import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import LocalFile from './localFile.entity';
import * as fs from 'fs';
 
@Injectable()
export class LocalFilesService {
  constructor(
    @InjectRepository(LocalFile)
    private localFilesRepository: Repository<LocalFile>,
  ) {}
 
  async saveLocalFileData(fileData: LocalFileDto) {
    const newFile = await this.localFilesRepository.create(fileData)
    await this.localFilesRepository.save(newFile);
    return newFile;
  }

  async delete_file(old_file_path: string) {
    if (fs.existsSync(old_file_path)) {
      //file exists
      fs.unlinkSync(old_file_path);
    }
    // else file does not exists
  }
}