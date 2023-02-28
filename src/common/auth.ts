import * as z from 'zod';

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  profileName: z.string(),
  token: z.string(),
});

export const loginSchema = z.object({
  username: z.string().min(1, { message: 'This field is required' }),
  password: z.string(),
});

export const registerSchema = loginSchema
  .extend({
    profileName: z.string().min(1, { message: 'This field is required' }),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((val, ctx) => {
    if (val.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Must be at least 6 characters',
        path: ['password'],
      });
    }
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

export type IUser = z.infer<typeof userSchema>;
export type ILogin = z.infer<typeof loginSchema>;
export type IRegister = z.infer<typeof registerSchema>;
