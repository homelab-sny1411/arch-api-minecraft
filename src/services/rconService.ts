import { RCON } from 'minecraft-server-util';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

/**
 * Service pour gérer les commandes RCON sur le serveur Minecraft
 * Permet d'envoyer des commandes à distance au serveur via le protocole RCON
 */
export class RconService {
    private readonly host: string;
    private readonly port: number;
    private readonly password: string;

    constructor() {
        this.host = config.minecraft.host;
        this.port = config.minecraft.rconPort;
        this.password = config.minecraft.rconPassword;
    }

    /**
     * Envoie une commande RCON au serveur Minecraft
     * @param command - La commande à exécuter (sans le préfixe '/')
     * @returns La réponse du serveur
     * @throws Error si la connexion RCON échoue ou si la commande échoue
     */
    async sendCommand(command: string): Promise<string> {
        // Validation du mot de passe RCON
        if (!this.password) {
            throw new Error('RCON password not configured');
        }

        let client: RCON | null = null;

        try {
            logger.info(`Connecting to RCON on ${this.host}:${this.port}`);

            // Connexion au serveur RCON
            client = new RCON();
            await client.connect(this.host, this.port, {
                timeout: 5000,
            });

            logger.info('RCON connection established, authenticating...');

            // Authentification
            await client.login(this.password);

            logger.info(`Executing RCON command: ${command}`);

            // Exécution de la commande
            const response = await client.execute(command);

            logger.info(`RCON command executed successfully`);

            return response;
        } catch (error: any) {
            logger.error(`RCON command failed: ${error.message}`);
            throw new Error(`Failed to execute RCON command: ${error.message}`);
        } finally {
            // Toujours fermer la connexion RCON
            if (client) {
                try {
                    await client.close();
                    logger.info('RCON connection closed');
                } catch (closeError: any) {
                    logger.error(`Failed to close RCON connection: ${closeError.message}`);
                }
            }
        }
    }
}
