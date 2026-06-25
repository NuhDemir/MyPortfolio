import { axiosClient } from "@core";

export const getDashboardSnapshot = async () => {
  try {
    const response = await axiosClient.get("/admin/dashboard");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Dashboard verileri alınırken bir hata oluştu."
    );
  }
};

export default getDashboardSnapshot;
