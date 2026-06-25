const sortByOrder = (items = []) =>
  [...items].sort((a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0));

const DEFAULT_ABOUT_CONTENT = {
  header: {
    badge: "About",
    title: "Hakkımda",
    subtitle:
      "Uretim kalitesi, hizli iterasyon ve etkili urun teslimi odağinda calisiyorum.",
  },
  github: {
    username: "NuhDemir",
    profileUrl: "https://github.com/NuhDemir",
  },
  stats: [
    {
      key: "repositories",
      label: "Repositories",
      valueSource: "github",
      githubField: "public_repos",
      cta: {
        label: "Repo'lari Gor",
        url: "https://github.com/NuhDemir?tab=repositories",
      },
      order: 1,
    },
    {
      key: "followers",
      label: "Followers",
      valueSource: "github",
      githubField: "followers",
      cta: {
        label: "Takip Et",
        url: "https://github.com/NuhDemir",
      },
      order: 2,
    },
  ],
  services: [
    {
      id: "programming",
      iconUrl:
        "https://res.cloudinary.com/dahmmlu7u/image/upload/v1775947706/portfolio/public/assets/icons/about/programmingLanguage.svg",
      iconBgColor: "var(--color-accent)",
      title: "Programming Lang",
      description: "Modern dillerle olceklenebilir kod yazma.",
      order: 1,
      modal: {
        heading: "Programming Languages & Approach",
        lead:
          "Urun hedeflerine uygun dil secimi, temiz mimari ve bakimi kolay kod odakli ilerliyorum.",
        sections: [
          {
            title: "Core Language Stack",
            items: [
              {
                title: "JavaScript / TypeScript",
                body: "Frontend ve backend katmanlarini tek bir gelistirme dili etrafinda hizli urunlestiriyorum.",
              },
              {
                title: "Python",
                body: "Otomasyon, veri isleme ve script tabanli operasyonlarda hizli prototip gelistiriyorum.",
              },
            ],
          },
        ],
        footnote:
          "Kod kalitesini standartlastirmak icin test, lint ve code-review adimlarini teslim surecine dahil ediyorum.",
      },
    },
    {
      id: "devtools",
      iconUrl:
        "https://res.cloudinary.com/dahmmlu7u/image/upload/v1775947703/portfolio/public/assets/icons/about/DevToolsTech.svg",
      iconBgColor: "var(--color-primary)",
      title: "Dev Tools & Tech",
      description: "Verimlilik icin en yeni araclari kullanma.",
      order: 2,
      modal: {
        heading: "Development Tools & Technologies",
        lead:
          "CI/CD, otomasyon ve izlenebilirlik odakli bir gelistirme akisi kurarak teslim hizini artiriyorum.",
        sections: [
          {
            title: "Engineering Workflow",
            items: [
              {
                title: "GitHub Actions",
                body: "Build, test ve deploy adimlarini otomatiklestirerek tutarli teslim sureci sagliyorum.",
              },
              {
                title: "Testing & Quality",
                body: "Unit test ve lint kontrollerini kritik degisikliklerde zorunlu kiliyorum.",
              },
            ],
          },
          {
            title: "Platform & Infrastructure",
            items: [
              {
                title: "Render / Netlify",
                body: "Frontend-backend ayri deployment stratejisi ile surekli yayin akisi kuruyorum.",
              },
            ],
          },
        ],
        footnote:
          "Arac seciminde tek kriterim: ekibin teslim hizini ve sistemin guvenilirligini artirmasi.",
      },
    },
    {
      id: "podcast",
      iconUrl:
        "https://res.cloudinary.com/dahmmlu7u/image/upload/v1775947705/portfolio/public/assets/icons/about/PodcastTalks.svg",
      iconBgColor: "var(--color-secondary)",
      title: "Podcast & Talks",
      description: "Bilgi ve teknoloji trendlerini paylasma.",
      order: 3,
      modal: {
        heading: "Podcasts & Talks",
        lead:
          "Teknik konulari sade dille aktarmaya ve topluluk icinde bilgi paylasimini surekli tutmaya odaklaniyorum.",
        sections: [
          {
            title: "Knowledge Sharing Channels",
            items: [
              {
                title: "Teknik Yazilar",
                body: "Gercek proje deneyimlerinden cikan dersleri uygulanabilir formatta paylasiyorum.",
              },
              {
                title: "Topluluk Etkinlikleri",
                body: "Takimlarin urun ve teknoloji kararlarina katkida bulunacak konular uzerine sunumlar yapiyorum.",
              },
            ],
          },
        ],
        footnote:
          "Amacim yalnizca kod yazmak degil, bilgi akisini hizlandiran bir topluluk etkisi olusturmak.",
      },
    },
    {
      id: "projects",
      iconUrl:
        "https://res.cloudinary.com/dahmmlu7u/image/upload/v1775947709/portfolio/public/assets/icons/about/ProjectsWork.svg",
      iconBgColor: "var(--color-accent)",
      title: "Projects & Work",
      description: "Kalite odakli etkili projeler sunma.",
      order: 4,
      modal: {
        heading: "Projects & Work Experience",
        lead:
          "Urettigim projelerde teknik kaliteyi, kullanici deneyimini ve teslim hizini birlikte optimize etmeyi hedefliyorum.",
        sections: [
          {
            title: "Highlighted Repositories",
            items: [
              {
                title: "JavaScript Ogreniyorum",
                body: "Temelden ileri seviyeye JavaScript konularini adim adim anlatan egitim reposu.",
                linkLabel: "GitHub repository",
                linkUrl: "https://github.com/NuhDemir/javascript-ogreniyorum",
              },
              {
                title: "Flutter Sign Language Translator",
                body: "Sesli ifadeleri metin ve isaret dili gostergelerine ceviren erisilebilirlik odakli mobil prototip.",
                linkLabel: "GitHub repository",
                linkUrl: "https://github.com/NuhDemir/flutter-sign-language",
              },
            ],
          },
        ],
        footnote: "Tum acik kaynak calismalarimi GitHub profilimde paylasiyorum.",
        footnoteLinkLabel: "GitHub profilim",
        footnoteLinkUrl: "https://github.com/NuhDemir",
      },
    },
  ],
  seo: {
    title: "Nuh Demir | Hakkımda",
    description:
      "Yazilim gelistirme, urun odakli teslim ve teknik liderlik perspektifimi paylastigim Hakkımda bolumu.",
    keywords: ["nuh demir", "about", "portfolio", "full stack"],
  },
  isActive: true,
  meta: {
    version: 1,
  },
};

export class AboutService {
  constructor({ aboutRepository }) {
    this.aboutRepository = aboutRepository;
  }

  normalizeStats(stats = []) {
    return sortByOrder(stats).map((stat, index) => ({
      ...stat,
      key: stat.key || `stat-${index + 1}`,
      order: Number(stat.order ?? index + 1),
      cta: stat.cta ?? {},
    }));
  }

  normalizeServices(services = []) {
    return sortByOrder(services).map((service, index) => ({
      ...service,
      id: service.id || `service-${index + 1}`,
      order: Number(service.order ?? index + 1),
      modal: service.modal
        ? {
            heading: service.modal.heading || service.title || "Service Details",
            lead: service.modal.lead || "",
            sections: Array.isArray(service.modal.sections)
              ? service.modal.sections
              : [],
            footnote: service.modal.footnote || "",
            footnoteLinkLabel: service.modal.footnoteLinkLabel || "",
            footnoteLinkUrl: service.modal.footnoteLinkUrl || "",
          }
        : undefined,
    }));
  }

  async ensureMainDocument() {
    const existing = await this.aboutRepository.getMain();
    if (existing) {
      return existing;
    }

    return this.aboutRepository.createMain(DEFAULT_ABOUT_CONTENT);
  }

  async getPublicAboutContent() {
    return this.ensureMainDocument();
  }

  async getAdminAboutContent() {
    return this.ensureMainDocument();
  }

  async updateAboutContent(payload, { editorId } = {}) {
    const current = await this.ensureMainDocument();

    const nextHeader = {
      ...(current.header ?? {}),
      ...(payload.header ?? {}),
    };

    const nextGithub = {
      ...(current.github ?? {}),
      ...(payload.github ?? {}),
    };

    const nextSeo = {
      ...(current.seo ?? {}),
      ...(payload.seo ?? {}),
    };

    const nextStats = Array.isArray(payload.stats)
      ? this.normalizeStats(payload.stats)
      : current.stats;

    const nextServices = Array.isArray(payload.services)
      ? this.normalizeServices(payload.services)
      : current.services;

    const nextPayload = {
      header: nextHeader,
      github: {
        ...nextGithub,
        profileUrl:
          nextGithub.profileUrl ||
          `https://github.com/${nextGithub.username ?? "NuhDemir"}`,
      },
      stats: nextStats,
      services: nextServices,
      seo: nextSeo,
      isActive:
        typeof payload.isActive === "boolean"
          ? payload.isActive
          : Boolean(current.isActive),
      meta: {
        ...(current.meta ?? {}),
        lastEditedBy: editorId ?? current.meta?.lastEditedBy,
        lastEditedAt: new Date(),
      },
    };

    return this.aboutRepository.updateMain(nextPayload);
  }
}

export const createAboutService = ({ aboutRepository }) =>
  new AboutService({ aboutRepository });

export default AboutService;
