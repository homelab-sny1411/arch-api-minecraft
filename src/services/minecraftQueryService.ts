import { status } from 'minecraft-server-util';
import { config } from '../config/environment';

export class MinecraftQueryService {
    private readonly host: string;
    private readonly port: number;

    constructor() {
        this.host = config.minecraft.host;
        this.port = config.minecraft.port;
    }

    async getPlayerCount(): Promise<{ online: number; max: number }> {
        try {
            const response = await status(this.host, this.port, {
                timeout: 5000,
                enableSRV: false,
            });

            return {
                online: response.players.online,
                max: response.players.max,
            };
        } catch (error: any) {
            throw new Error(`Failed to query Minecraft server: ${error.message}`);
        }
    }

    async getFullStatus() {
        try {
            const response = await status(this.host, this.port, {
                timeout: 5000,
                enableSRV: false,
            });

            return {
                players: {
                    online: response.players.online,
                    max: response.players.max,
                },
                version: response.version.name,
                motd: response.motd.clean,
            };
        } catch (error: any) {
            throw new Error(`Failed to query Minecraft server: ${error.message}`);
        }
    }
}
