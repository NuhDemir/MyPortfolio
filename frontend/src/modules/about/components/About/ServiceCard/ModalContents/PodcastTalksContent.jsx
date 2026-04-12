import React from "react";

const PodcastTalksContent = () => {
  const channels = [
    {
      title: "Yazilim Kiraathanesi Podcast",
      detail:
        "Yazilim trendleri, kariyer yolculugu ve sektorden konuklarla teknik sohbetler.",
      links: [
        {
          label: "Spotify",
          href: "https://open.spotify.com/show/0a8ZmRsXCWKaOFjKIEN38q?si=b08a136895f340a8",
        },
        {
          label: "Youtube",
          href: "https://youtube.com/playlist?list=PLiw0pe3ARm0SX4pQ6nHDqZboa4ymQQuuc&si=9UCKW6cNherIgjTm",
        },
      ],
    },
    {
      title: "Tech Talks & Meetups",
      detail:
        "React performansi, Node.js pratikleri ve modern frontend mimarisi odakli sunumlar.",
      links: [],
    },
    {
      title: "Medium Articles",
      detail: "Uygulamaya donuk teknik yazilar ve adim adim gelistirme rehberleri.",
      links: [{ label: "Medium", href: "https://medium.com/@nuhdemir.dev" }],
    },
  ];

  return (
    <div className="about-modal-content" data-about-modal="podcast">
      <section className="about-modal-content__panel scribble-card-wrap">
        <div
          className="about-modal-content__panel-fill scribble-card-wrap__fill"
          aria-hidden="true"
        />
        <div className="about-modal-content__panel-body naive-shadow--sm">
          <h3 className="about-modal-content__heading">Podcasts & Talks</h3>
          <p className="about-modal-content__lead">
            Bilgiyi paylasmanin yazilim toplulugunu guclendirdigine inaniyorum;
            uretilen her icerik yeni bir gelisim kapisi aciyor.
          </p>
        </div>
      </section>

      <section className="about-modal-content__section">
        <h4 className="about-modal-content__section-title">Knowledge Sharing Channels</h4>
        <ul className="about-modal-content__section-body about-modal-content__list">
          {channels.map((channel) => (
            <li key={channel.title} className="about-modal-content__item">
              <span className="about-modal-content__item-title">{channel.title}</span>
              <span className="about-modal-content__item-body">{channel.detail}</span>
              {channel.links.length > 0 && (
                <span className="about-modal-content__item-body">
                  {channel.links.map((link, index) => (
                    <React.Fragment key={link.label}>
                      {index > 0 && " | "}
                      <a
                        className="about-modal-content__inline-link"
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    </React.Fragment>
                  ))}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <p className="about-modal-content__footnote">
        Topluluktan ogrendigimi tekrar topluluga aktarmayi kariyerimin temel
        bir parcasi olarak goruyorum.
      </p>
    </div>
  );
};

export default PodcastTalksContent;
