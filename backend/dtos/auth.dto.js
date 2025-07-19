import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalı."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı."),
});
