export const generateSlug = (value) => {
  if (!value) {
    return "";
  }

  const turkishMap = {
    ı: "i",
    İ: "i",
    ş: "s",
    Ş: "s",
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ö: "o",
    Ö: "o",
    ü: "u",
    Ü: "u",
  };

  const transliterated = value
    .toString()
    .replace(/[ışçğöüİŞÇĞÖÜ]/g, (char) => turkishMap[char] ?? char);

  return transliterated
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

export default generateSlug;
