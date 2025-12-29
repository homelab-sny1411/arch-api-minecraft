import { z } from 'zod';

// Schéma vide pour endpoints sans body
export const emptyBodySchema = z.object({}).strict();

// Schéma pour MinecraftStatus
export const minecraftStatusSchema = z.object({
  serviceStatus: z.enum(['running', 'stopped', 'failed', 'unknown']),
  playersOnline: z.number().int().nonnegative(),
  maxPlayers: z.number().int().positive().optional(),
  version: z.string().optional(),
  motd: z.string().optional()
});

// Schéma pour ServiceResponse générique
export const serviceResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional()
});

// Schéma pour auto-shutdown status data
export const autoShutdownDataSchema = z.object({
  enabled: z.boolean(),
  idleMinutes: z.number().int().nonnegative(),
  isIdle: z.boolean()
});

// Schéma pour health check
export const healthCheckSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string().datetime()
});

// Types TypeScript inférés depuis Zod
export type MinecraftStatusInput = z.infer<typeof minecraftStatusSchema>;
export type ServiceResponseInput = z.infer<typeof serviceResponseSchema>;
export type AutoShutdownDataInput = z.infer<typeof autoShutdownDataSchema>;
export type HealthCheckInput = z.infer<typeof healthCheckSchema>;
