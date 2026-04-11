import { PatternBackground } from "@shared/ui/patterns";

/**
 * NavbarPattern
 *
 * Navbar arka planına eklenen desen katmanı.
 * PatternBackground'u doğrudan Navbar'a bağlamak yerine bu bileşen
 * aracılığıyla kullanmak SRP ve OCP'ye uyum sağlar:
 *   - Variant / opacity değişikliği yalnızca burada yapılır.
 *   - Navbar.jsx bu detayı bilmek zorunda kalmaz.
 */
export const NavbarPattern = () => (
  <PatternBackground variant="grid" opacity={0.11} />
);
