import { exec } from 'child_process';
import { promisify } from 'util';
import { config } from '../config/environment';
import { SystemdStatus } from '../types/minecraft.types';

const execAsync = promisify(exec);

export class SystemdService {
    private readonly serviceName: string;

    constructor() {
        this.serviceName = config.minecraft.serviceName;
    }

    async startService(): Promise<void> {
        const command = `sudo systemctl start ${this.serviceName}`;
        const { stderr } = await execAsync(command);

        if (stderr && !stderr.includes('Warning')) {
            throw new Error(`Failed to start service: ${stderr}`);
        }
    }

    async stopService(): Promise<void> {
        const command = `sudo systemctl stop ${this.serviceName}`;
        const { stderr } = await execAsync(command);

        if (stderr && !stderr.includes('Warning')) {
            throw new Error(`Failed to stop service: ${stderr}`);
        }
    }

    async restartService(): Promise<void> {
        const command = `sudo systemctl restart ${this.serviceName}`;
        const { stderr } = await execAsync(command);

        if (stderr && !stderr.includes('Warning')) {
            throw new Error(`Failed to restart service: ${stderr}`);
        }
    }

    async getServiceStatus(): Promise<SystemdStatus> {
        try {
            const command = `systemctl is-active ${this.serviceName}`;
            const { stdout } = await execAsync(command);
            const status = stdout.trim();

            switch (status) {
                case 'active':
                    return SystemdStatus.ACTIVE;
                case 'inactive':
                    return SystemdStatus.INACTIVE;
                case 'failed':
                    return SystemdStatus.FAILED;
                default:
                    return SystemdStatus.UNKNOWN;
            }
        } catch (error) {
            return SystemdStatus.INACTIVE;
        }
    }

    async isServiceRunning(): Promise<boolean> {
        const status = await this.getServiceStatus();
        return status === SystemdStatus.ACTIVE;
    }
}
