import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, QueryFailedError } from "typeorm";
import { Channel } from "./channel.entity"
import { CreateChannelDto } from "./create-channel.dto";

@Injectable()
export class ChannelService{

    private readonly logger = new Logger()

    constructor (
        @InjectRepository(Channel)
        private channelRepository: Repository<Channel>
    ) {}

    // async findOne(channel_name: string): Promise<Channel | undefined> {
    //     return this.channelRepository.findOneBy( {channel_name: channel_name} );
    // }

    async createChannel(channel: CreateChannelDto) {
        const channelEntity = new Channel()

        channelEntity.channel_name = channel.channel_name;
        channelEntity.channel_password = channel.channel_password;
        channelEntity.channel_type = channel.channel_type;
        try {
            await this.channelRepository.save(channelEntity)
        } catch (e: unknown) {
        if (e instanceof QueryFailedError) {
            this.logger.error(JSON.stringify(e));
            throw new HttpException(
              {
                status: HttpStatus.BAD_REQUEST,
                error: 'Channel already exists',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
          throw e;
        }
    }
}