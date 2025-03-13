"use client";
import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(3).max(20),
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});
