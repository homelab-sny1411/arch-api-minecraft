import { exec } from 'child_process';
import { promisify } from 'util';
import { config } from '../config/environment';

const execAsync = promisify(exec);

export class ShutdownService {
    async shutdownSystem(): Promise<void> {
        const command = `sudo ${config.system.shutdownCommand}`;

        try {
            await execAsync(command);
        } catch (error: any) {
            throw new Error(`Failed to shutdown system: ${error.message}`);
        }
    }
}
