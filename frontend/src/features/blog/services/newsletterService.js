import { axiosClient } from "@core";

export const subscribeToNewsletter = async (email) => {
  try {
    const response = await axiosClient.post("/newsletter/subscribe", { email });
    return { success: true, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
    };
  }
};
