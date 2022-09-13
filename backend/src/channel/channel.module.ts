import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from "./channel.entity";
import { ChannelController } from './channel.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Channel])], 
    providers: [ChannelService],
    controllers: [ChannelController],
    exports: [ChannelService]
})
export class ChannelModule {}