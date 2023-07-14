import { z } from "zod";

export const userSchema = z.object({
  _id: z.string(),
  firstname: z.string(),
  lastname: z.string().optional(),
  email: z.string(),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
});

export const registerSchema = z.object({
  firstname: z.string(),
  password: z.string(),
  email: z.string().email(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
