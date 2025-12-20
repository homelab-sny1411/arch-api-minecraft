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
        rconPort: number;
        rconPassword: string;
        serverPath: string;
        host: string;
    };
    system: {
        shutdownCommand: string;
    };
    autoShutdown: {
        enabled: boolean;
        checkInterval: number;
        idleTime: number;
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
        rconPort: parseInt(process.env.MINECRAFT_RCON_PORT || '25575', 10),
        rconPassword: process.env.MINECRAFT_RCON_PASSWORD || '',
        serverPath: process.env.MINECRAFT_SERVER_PATH || '/opt/minecraft',
        host: process.env.MINECRAFT_HOST || 'localhost',
    },
    system: {
        shutdownCommand: process.env.SHUTDOWN_COMMAND || 'systemctl poweroff',
    },
    autoShutdown: {
        enabled: process.env.AUTO_SHUTDOWN_ENABLED === 'true',
        checkInterval: parseInt(process.env.AUTO_SHUTDOWN_CHECK_INTERVAL || '60000', 10),
        idleTime: parseInt(process.env.AUTO_SHUTDOWN_IDLE_TIME || '1800000', 10),
    },
};
