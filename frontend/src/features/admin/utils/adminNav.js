import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import ContactPageRoundedIcon from "@mui/icons-material/ContactPageRounded";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

export const ADMIN_NAV_LINKS = [
  {
    to: "/dmr217cms/dashboard",
    label: "Dashboard",
    description: "Anlık gorunum",
    Icon: SpaceDashboardRoundedIcon,
    eyebrow: "Kontrol Merkezi",
  },
  {
    to: "/dmr217cms/projects",
    label: "Projeler",
    description: "Portfoy icerikleri",
    Icon: WorkspacesRoundedIcon,
    eyebrow: "Icerik Yonetimi",
  },
  {
    to: "/dmr217cms/blog",
    label: "Blog",
    description: "Yayin akisi",
    Icon: ArticleRoundedIcon,
    eyebrow: "Icerik Yonetimi",
  },
  {
    to: "/dmr217cms/resources",
    label: "Kaynaklar",
    description: "Onrrilen icerikler",
    Icon: LibraryBooksIcon,
    eyebrow: "Icerik Yonetimi",
  },
  {
    to: "/dmr217cms/comments",
    label: "Yorumlar",
    description: "Yorum yonetimi",
    Icon: CommentRoundedIcon,
    eyebrow: "Moderasyon",
  },
  {
    to: "/dmr217cms/about",
    label: "About",
    description: "Hakkimda icerigi",
    Icon: ContactPageRoundedIcon,
    eyebrow: "Icerik Yonetimi",
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

  if (path.startsWith("/dmr217cms")) {
    return DEFAULT_META;
  }

  return DEFAULT_META;
};
