import axiosClient from "@core/http/axiosClient";

const resolveErrorMessage = (error, fallback) =>
  error?.response?.data?.message ?? error?.message ?? fallback;

export const getAboutContent = async () => {
  try {
    const response = await axiosClient.get("/about");
    return response.data;
  } catch (error) {
    throw new Error(
      resolveErrorMessage(error, "About icerigi getirilirken hata olustu."),
    );
  }
};

export default {
  getAboutContent,
};
