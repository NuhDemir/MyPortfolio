import axiosClient from "@core/http/axiosClient";

export const fetchProjects = async () => {
  try {
    const response = await axiosClient.get("/projects");
    return Array.isArray(response.data) ? response.data : [];
  } catch {
    // Backend development mode: sessizce fallback sağla (404/404 gibi hatalarda)
    // Böylece frontend'de hata mesajı gözükmez. Geliştirme sırasında backend
    // kapalıysa boş dizi döndürülür ve UI yedek veriyi kullanır.
    return [];
  }
};

export const fetchProjectById = async (id) => {
  try {
    const response = await axiosClient.get(`/projects/${id}`);
    return response.data;
  } catch {
    // Eğer tekil proje alınamazsa null döndür; UI bunu yakalayıp yedek veya
    // uygun mesajı gösterebilir. Hata atmayarak konsolda görünen hataları engelle.
    return null;
  }
};

export default {
  fetchProjects,
  fetchProjectById,
};
