import { config } from '../config/environment';
import { MinecraftQueryService } from './minecraftQueryService';
import { SystemdService } from './systemdService';
import { ShutdownService } from './shutdownService';

export class AutoShutdownService {
    private queryService: MinecraftQueryService;
    private systemdService: SystemdService;
    private shutdownService: ShutdownService;
    private checkInterval: NodeJS.Timeout | null = null;
    private idleStartTime: number | null = null;
    private isRunning: boolean = false;

    constructor() {
        this.queryService = new MinecraftQueryService();
        this.systemdService = new SystemdService();
        this.shutdownService = new ShutdownService();
    }

    start(): void {
        if (!config.autoShutdown.enabled) {
            console.log('Auto-shutdown is disabled in configuration');
            return;
        }

        if (this.isRunning) {
            console.log('Auto-shutdown monitoring is already running');
            return;
        }

        this.isRunning = true;
        console.log(`Auto-shutdown monitoring started. Check interval: ${config.autoShutdown.checkInterval}ms, Idle time: ${config.autoShutdown.idleTime}ms`);

        this.checkInterval = setInterval(async () => {
            await this.checkPlayersAndShutdown();
        }, config.autoShutdown.checkInterval);
    }

    stop(): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        this.isRunning = false;
        this.idleStartTime = null;
        console.log('Auto-shutdown monitoring stopped');
    }

    private async checkPlayersAndShutdown(): Promise<void> {
        try {
            const isServiceRunning = await this.systemdService.isServiceRunning();

            if (!isServiceRunning) {
                if (this.idleStartTime !== null) {
                    this.idleStartTime = null;
                    console.log('Server is stopped, resetting idle timer');
                }
                return;
            }

            const playerCount = await this.queryService.getPlayerCount();
            const currentTime = Date.now();

            if (playerCount.online === 0) {
                if (this.idleStartTime === null) {
                    this.idleStartTime = currentTime;
                    console.log('Server is empty, starting idle timer');
                } else {
                    const idleDuration = currentTime - this.idleStartTime;
                    const remainingTime = config.autoShutdown.idleTime - idleDuration;
                    const minutesRemaining = Math.ceil(remainingTime / 60000);

                    console.log(`Server empty for ${Math.floor(idleDuration / 60000)} minutes. Shutdown in ${minutesRemaining} minutes if no one joins.`);

                    if (idleDuration >= config.autoShutdown.idleTime) {
                        console.log('Idle time exceeded, initiating shutdown sequence...');
                        await this.performShutdown();
                    }
                }
            } else {
                if (this.idleStartTime !== null) {
                    console.log(`Players detected (${playerCount.online}/${playerCount.max}), resetting idle timer`);
                    this.idleStartTime = null;
                }
            }
        } catch (error: any) {
            console.error(`Auto-shutdown check failed: ${error.message}`);
        }
    }

    private async performShutdown(): Promise<void> {
        try {
            console.log('Stopping Minecraft server...');
            await this.systemdService.stopService();

            console.log('Waiting 5 seconds before system shutdown...');
            setTimeout(async () => {
                console.log('Shutting down system...');
                await this.shutdownService.shutdownSystem();
            }, 5000);

            this.stop();
        } catch (error: any) {
            console.error(`Failed to perform shutdown: ${error.message}`);
        }
    }

    getStatus(): { running: boolean; idleStartTime: number | null; idleDuration: number | null } {
        const idleDuration = this.idleStartTime ? Date.now() - this.idleStartTime : null;
        return {
            running: this.isRunning,
            idleStartTime: this.idleStartTime,
            idleDuration,
        };
    }
}
