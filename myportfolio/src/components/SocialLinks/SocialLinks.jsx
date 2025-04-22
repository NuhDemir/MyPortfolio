import React, { useState } from "react";
import "./style/SocialLinks.css";
import SocialLinkSplash from "./SocialLinkSplash";

const SocialLinks = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = (e, href) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      window.location.href = href;
    }, 1000); // 1 saniyelik yükleme efekti
  };

  return (
    <>
      <div className="social-links">
        <a
          href="https://github.com/NuhDemir"
          className="social-link"
          onClick={(e) => handleClick(e, "https://github.com/NuhDemir")}
        >
          Github
        </a>
        <a
          href="https://www.youtube.com/@Yaz%C4%B1l%C4%B1mK%C4%B1raathanesi"
          className="social-link"
          onClick={(e) =>
            handleClick(
              e,
              "https://www.youtube.com/@Yaz%C4%B1l%C4%B1mK%C4%B1raathanesi"
            )
          }
        >
          Youtube
        </a>
        <a
          href="/cv"
          className="social-link"
          onClick={(e) => handleClick(e, "/cv")}
        >
          CV
        </a>
        <a
          href="https://www.linkedin.com/in/nuh-demir-69b737261/"
          className="social-link"
          onClick={(e) =>
            handleClick(e, "https://www.linkedin.com/in/nuh-demir-69b737261/")
          }
        >
          LinkedIn
        </a>
        <a
          href="https://www.instagram.com/yazilimkiraathanesi/"
          className="social-link"
          onClick={(e) =>
            handleClick(e, "https://www.instagram.com/yazilimkiraathanesi/")
          }
        >
          Instagram
        </a>
      </div>
      <SocialLinkSplash show={loading} />
    </>
  );
};

export default SocialLinks;
