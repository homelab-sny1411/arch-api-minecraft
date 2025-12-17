export interface MinecraftStatus {
    serviceStatus: 'running' | 'stopped' | 'failed' | 'unknown';
    playersOnline: number;
    maxPlayers?: number;
    version?: string;
    motd?: string;
}

export interface ServiceResponse {
    success: boolean;
    message: string;
    data?: any;
}

export enum SystemdStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    FAILED = 'failed',
    UNKNOWN = 'unknown',
}
