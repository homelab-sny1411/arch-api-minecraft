import dotenv from 'dotenv';

dotenv.config();

interface Config {
    api: {
        port: number;
        nodeEnv: string;
    };
    minecraft: {
        serviceName: string;
        port: number;
        serverPath: string;
        host: string;
    };
    system: {
        shutdownCommand: string;
    };
}

export const config: Config = {
    api: {
        port: parseInt(process.env.API_PORT || '3000', 10),
        nodeEnv: process.env.NODE_ENV || 'development',
    },
    minecraft: {
        serviceName: process.env.MINECRAFT_SERVICE_NAME || 'minecraft-server',
        port: parseInt(process.env.MINECRAFT_PORT || '25565', 10),
        serverPath: process.env.MINECRAFT_SERVER_PATH || '/opt/minecraft',
        host: process.env.MINECRAFT_HOST || 'localhost',
    },
    system: {
        shutdownCommand: process.env.SHUTDOWN_COMMAND || 'systemctl poweroff',
    },
};
