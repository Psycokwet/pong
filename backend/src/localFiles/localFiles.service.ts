import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import LocalFile from './localFile.entity';
 
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
}