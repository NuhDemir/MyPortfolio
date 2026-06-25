import { axiosClient } from "@core";
import {
  clearStoredUser,
  readStoredUser,
  writeStoredUser,
} from "@core/auth/authStorage.js";

export const login = async (identity, password) => {
  try {
    const response = await axiosClient.post("/auth/login", {
      identity,
      password,
    });

    writeStoredUser(response.data);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.";
    throw new Error(message);
  }
};

export const logout = () => {
  clearStoredUser();
  window.location.href = "/admin/login";
};

export const getCurrentUser = () => readStoredUser();
