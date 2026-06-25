export const DEFAULT_ABOUT_CONTENT = {
  header: {
    badge: "About",
    title: "Hakkımda",
    subtitle:
      "Uretim kalitesi, hizli iterasyon ve etkili urun teslimi odaginda calisiyorum.",
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
      iconBgColor: "var(--ds-surface)",
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
      iconBgColor: "var(--ds-accent)",
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
        ],
        footnote:
          "Arac seciminde tek kriterim: ekibin teslim hizini ve sistemin guvenilirligini artirmasi.",
      },
    },
    {
      id: "podcast",
      iconUrl:
        "https://res.cloudinary.com/dahmmlu7u/image/upload/v1775947705/portfolio/public/assets/icons/about/PodcastTalks.svg",
      iconBgColor: "var(--ds-border-soft)",
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
      iconBgColor: "var(--ds-surface)",
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
};

export const cloneDefaultAboutContent = () =>
  JSON.parse(JSON.stringify(DEFAULT_ABOUT_CONTENT));

export default DEFAULT_ABOUT_CONTENT;
