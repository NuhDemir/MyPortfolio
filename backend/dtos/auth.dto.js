import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
});

export { loginSchema };
