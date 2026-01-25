import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";

export const ADMIN_NAV_LINKS = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    description: "Anlık görünüm",
    Icon: SpaceDashboardRoundedIcon,
    eyebrow: "Kontrol Merkezi",
  },
  {
    to: "/admin/projects",
    label: "Projeler",
    description: "Portföy içerikleri",
    Icon: WorkspacesRoundedIcon,
    eyebrow: "İçerik Yönetimi",
  },
  {
    to: "/admin/blog",
    label: "Blog",
    description: "Yayın akışı",
    Icon: ArticleRoundedIcon,
    eyebrow: "İçerik Yönetimi",
  },
  {
    to: "/admin/comments",
    label: "Yorumlar",
    description: "Yorum yönetimi",
    Icon: CommentRoundedIcon,
    eyebrow: "Moderasyon",
  },
];

const DEFAULT_META = { eyebrow: "Kontrol Merkezi", title: "Admin" };

export const getAdminPageMeta = (pathname) => {
  const path = String(pathname || "");

  const match = ADMIN_NAV_LINKS.find((item) => item.to === path);
  if (match) {
    return {
      eyebrow: match.eyebrow || DEFAULT_META.eyebrow,
      title: match.label,
    };
  }

  const prefixMatch = ADMIN_NAV_LINKS.find((item) =>
    path.startsWith(`${item.to}/`),
  );

  if (prefixMatch) {
    return {
      eyebrow: prefixMatch.eyebrow || DEFAULT_META.eyebrow,
      title: prefixMatch.label,
    };
  }

  if (path.startsWith("/admin")) {
    return DEFAULT_META;
  }

  return DEFAULT_META;
};
