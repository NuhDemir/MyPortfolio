// src/components/About/ServiceCard/ModalContents/PodcastTalksContent.jsx
import React from "react";

// Podcast ve Konuşmalar için modal içeriği
const PodcastTalksContent = () => {
  return (
    <div>
      <h3>Podcasts & Talks</h3>
      <p>
        Sharing knowledge and insights through various platforms is a passion. I
        actively participate in the tech community via:
      </p>
      <ul>
        <li>
          <strong>Yazılım Kıraathanesi Podcast:</strong> Co-hosting a podcast
          discussing software development trends, career advice, and interviews
          with industry professionals. You can listen on{" "}
          <a
            href="https://open.spotify.com/show/0a8ZmRsXCWKaOFjKIEN38q?si=b08a136895f340a8"
            target="_blank"
            rel="noopener noreferrer"
          >
            Spotify
          </a>
          ,{" "}
          <a
            href="https://youtube.com/playlist?list=PLiw0pe3ARm0SX4pQ6nHDqZboa4ymQQuuc&si=9UCKW6cNherIgjTm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Youtube Podcast
          </a>
          , etc. {/* Gerçek linkleri ekleyin */}
        </li>
        <li>
          <strong>Tech Talks & Meetups:</strong> Presenting on topics like React
          performance, Node.js best practices, and modern frontend architectures
          at local and online events.
        </li>
        <li>
          <strong>Medium Articles:</strong> Writing technical articles and
          tutorials on{" "}
          <a
            href="https://medium.com/@nuhdemir.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Medium
          </a>{" "}
          to share practical knowledge.
        </li>
        <li>
          <strong>Community Engagement:</strong> Actively participating in
          online forums and communities to help others and stay updated.
        </li>
      </ul>
      <p>
        Believing in the power of shared knowledge to uplift the entire
        developer community.
      </p>
    </div>
  );
};

export default PodcastTalksContent;
