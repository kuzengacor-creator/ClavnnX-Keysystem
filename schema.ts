import { z } from "zod";

export const keySchema = z.object({
  key: z.string().length(16),
  expired: z.number(), // UNIX timestamp
});

export const verifyKeySchema = z.object({
  key: z.string().min(1),
});

export type Key = z.infer<typeof keySchema>;
export type VerifyKey = z.infer<typeof verifyKeySchema>;

export const verificationResponseSchema = z.union([
  z.object({
    status: z.literal("valid"),
    message: z.literal("Key valid"),
  }),
  z.object({
    status: z.literal("invalid"),
    message: z.literal("Invalid key"),
  }),
  z.object({
    status: z.literal("expired"),
    message: z.literal("Key expired"),
    redirect: z.string(),
  }),
]);

export type VerificationResponse = z.infer<typeof verificationResponseSchema>;

export const getKeyResponseSchema = z.object({
  key: z.string(),
  expire_time: z.number(), // UNIX timestamp
  status: z.enum(["valid", "expired"]),
});

export type GetKeyResponse = z.infer<typeof getKeyResponseSchema>;
