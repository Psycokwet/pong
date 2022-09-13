import { Body, Controller, Logger, Post } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { CreateChannelDto } from "./create-channel.dto";

@Controller('channels')
export class ChannelController{
    private readonly logger = new Logger(ChannelController.name)

    constructor(private channelService: ChannelService) {}

    @Post('create')
    async createChannel(@Body() channel: CreateChannelDto) {
        this.logger.log("Creating channel");
        await this.channelService.createChannel(channel)
    }
}