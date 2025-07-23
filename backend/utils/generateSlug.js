const generateSlug = (title) => {
  if (!title) {
    return ""; // Başlık yoksa boş slug döndür
  }

  return title
    .toString() // Stringe çevir
    .normalize("NFD") // Diyakritik işaretleri (aksanlı harfleri) ayır (çevir: ş, ç, ğ, ü, ö, ı -> s, c, g, u, o, i)
    .replace(/[\u0300-\u036f]/g, "") // Ayrılmış diyakritik işaretleri kaldır
    .toLowerCase() // Küçük harflere çevir
    .trim() // Başındaki ve sonundaki boşlukları kaldır
    .replace(/\s+/g, "-") // Boşlukları tire (-) ile değiştir
    .replace(/[^\w-]+/g, "") // Harf, rakam ve tire dışındaki tüm karakterleri kaldır
    .replace(/--+/g, "-"); // Birden fazla tireyi tek tire ile değiştir
};

export default generateSlug;
