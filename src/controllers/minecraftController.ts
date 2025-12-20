import { Request, Response } from 'express';
import { SystemdService } from '../services/systemdService';
import { MinecraftQueryService } from '../services/minecraftQueryService';
import { ShutdownService } from '../services/shutdownService';
import { AutoShutdownService } from '../services/autoShutdownService';
import { MinecraftStatus, ServiceResponse } from '../types/minecraft.types';

export class MinecraftController {
    private systemdService: SystemdService;
    private queryService: MinecraftQueryService;
    private shutdownService: ShutdownService;
    private readonly autoShutdownService: AutoShutdownService | null = null;

    constructor(autoShutdownService?: AutoShutdownService) {
        this.systemdService = new SystemdService();
        this.queryService = new MinecraftQueryService();
        this.shutdownService = new ShutdownService();
        this.autoShutdownService = autoShutdownService || null;
    }

    start = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.systemdService.startService();

            const response: ServiceResponse = {
                success: true,
                message: 'Minecraft server started successfully',
            };

            res.status(200).json(response);
        } catch (error: any) {
            const response: ServiceResponse = {
                success: false,
                message: `Failed to start server: ${error.message}`,
            };

            res.status(500).json(response);
        }
    };

    stop = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.systemdService.stopService();

            const response: ServiceResponse = {
                success: true,
                message: 'Minecraft server stopped. System shutting down...',
            };

            res.status(200).json(response);

            setTimeout(async () => {
                await this.shutdownService.shutdownSystem();
            }, 1000);

        } catch (error: any) {
            const response: ServiceResponse = {
                success: false,
                message: `Failed to stop server: ${error.message}`,
            };

            res.status(500).json(response);
        }
    };

    restart = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.systemdService.restartService();

            const response: ServiceResponse = {
                success: true,
                message: 'Minecraft server restarted successfully',
            };

            res.status(200).json(response);
        } catch (error: any) {
            const response: ServiceResponse = {
                success: false,
                message: `Failed to restart server: ${error.message}`,
            };

            res.status(500).json(response);
        }
    };

    status = async (req: Request, res: Response): Promise<void> => {
        try {
            const isRunning = await this.systemdService.isServiceRunning();

            let statusData: MinecraftStatus = {
                serviceStatus: isRunning ? 'running' : 'stopped',
                playersOnline: 0,
            };

            if (isRunning) {
                try {
                    const serverInfo = await this.queryService.getFullStatus();
                    statusData = {
                        serviceStatus: 'running',
                        playersOnline: serverInfo.players.online,
                        maxPlayers: serverInfo.players.max,
                        version: serverInfo.version,
                        motd: serverInfo.motd,
                    };
                } catch (queryError) {
                    statusData.serviceStatus = 'running';
                    statusData.playersOnline = 0;
                }
            }

            const response: ServiceResponse = {
                success: true,
                message: 'Status retrieved successfully',
                data: statusData,
            };

            res.status(200).json(response);
        } catch (error: any) {
            const response: ServiceResponse = {
                success: false,
                message: `Failed to get status: ${error.message}`,
            };

            res.status(500).json(response);
        }
    };

    autoShutdownStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!this.autoShutdownService) {
                const response: ServiceResponse = {
                    success: false,
                    message: 'Auto-shutdown service not available',
                };
                res.status(503).json(response);
                return;
            }

            const status = this.autoShutdownService.getStatus();
            const idleMinutes = status.idleDuration ? Math.floor(status.idleDuration / 60000) : 0;

            const response: ServiceResponse = {
                success: true,
                message: 'Auto-shutdown status retrieved successfully',
                data: {
                    enabled: status.running,
                    idleMinutes,
                    isIdle: status.idleStartTime !== null,
                },
            };

            res.status(200).json(response);
        } catch (error: any) {
            const response: ServiceResponse = {
                success: false,
                message: `Failed to get auto-shutdown status: ${error.message}`,
            };

            res.status(500).json(response);
        }
    };
}
