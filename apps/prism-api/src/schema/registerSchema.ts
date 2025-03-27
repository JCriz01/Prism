import { date, z } from 'zod';

const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
});

export default registerSchema;
