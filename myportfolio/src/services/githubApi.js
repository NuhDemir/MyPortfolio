// src/services/githubApi.js
import axios from "axios";

const GITHUB_USERNAME = "NuhDemir"; // Kendi GitHub kullanıcı adını yaz
const GITHUB_API_BASE_URL = "https://api.github.com";

// GitHub API için Axios instance (Rate limit için gerekirse header eklenebilir)
const githubApiClient = axios.create({
  baseURL: GITHUB_API_BASE_URL,
  headers: {
    Accept: "application/vnd.github.v3+json",
    // Gerekirse buraya GitHub PAT eklenebilir (Frontend için önerilmez!)
    // 'Authorization': `token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN`
  },
});

/**
 * Belirtilen kullanıcının herkese açık repolarını getirir.
 */
export const fetchUserRepos = async () => {
  try {
    console.log(`Fetching repos for user: ${GITHUB_USERNAME}`);
    // Repoları son güncellenme tarihine göre sıralı isteyelim (daha aktif olanlar üste gelsin)
    const response = await githubApiClient.get(
      `/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc`
    );
    console.log("Fetched Repos:", response.data);
    return response.data; // Repo listesini döndür
  } catch (error) {
    console.error(
      "GitHub repo fetch error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("GitHub projeleri alınırken bir hata oluştu.");
  }
};

/**
 * Bir reponun README dosyasının içeriğini base64 formatında getirir.
 */
export const fetchReadmeContent = async (repoFullName) => {
  try {
    // console.log(`Fetching README for: ${repoFullName}`);
    // Önce README dosyasının bilgisini al (API farklı endpointler deneyebilir: README.md, README, vs.)
    const response = await githubApiClient.get(`/repos/${repoFullName}/readme`);
    // console.log(`README info for ${repoFullName}:`, response.data);
    // İçeriği base64 olarak alalım
    return response.data.content;
  } catch (error) {
    // README yoksa 404 hatası normaldir, bunu handle edebiliriz.
    if (error.response && error.response.status === 404) {
      console.warn(`README not found for repo: ${repoFullName}`);
      return null; // README yoksa null döndür
    }
    console.error(
      `GitHub README fetch error for ${repoFullName}:`,
      error.response ? error.response.data : error.message
    );
    // Diğer hataları fırlatabiliriz veya null döndürebiliriz
    return null;
    // throw new Error(`README içeriği alınamadı: ${repoFullName}`);
  }
};

/**
 * Base64 formatındaki README içeriğinden ilk Markdown görselini çıkarır.
 * @param {string} base64Content - Base64 kodlanmış README içeriği.
 * @returns {string | null} - Görsel URL'si veya bulunamazsa null.
 */
export const extractFirstImageUrlFromReadme = (base64Content) => {
  if (!base64Content) return null;

  try {
    // Base64'ü çöz
    const decodedContent = atob(base64Content);

    // İlk Markdown formatındaki görseli bulmak için Regex
    // ![alt text](url) veya <img src="url" ...> formatlarını arar
    const markdownImageRegex = /!\[.*?\]\((.*?)\)|<img.*?src=["'](.*?)["']/i;
    const match = decodedContent.match(markdownImageRegex);

    if (match) {
      // Eşleşen grup 1 (markdown link) veya grup 2 (img src) URL'yi içerir
      const imageUrl = match[1] || match[2];
      console.log("Found image URL:", imageUrl);
      // URL'nin göreceli olup olmadığını kontrol et (gerekirse tam URL'ye çevir)
      // Bu kısım daha karmaşık olabilir, şimdilik doğrudan URL'yi döndürelim
      return imageUrl;
    }

    console.log("No image found in README content.");
    return null; // Görsel bulunamadı
  } catch (error) {
    console.error("Error decoding or parsing README content:", error);
    return null;
  }
};
