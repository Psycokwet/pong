import { Module } from '@nestjs/common';
import { LocalFilesService } from './localFiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import LocalFile from './localFile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocalFile])],
  providers: [LocalFilesService],
  exports: [LocalFilesService],
})
export class LocalFilesModule {}
