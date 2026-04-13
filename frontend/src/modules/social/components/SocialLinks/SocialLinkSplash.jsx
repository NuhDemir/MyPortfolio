import React, { useState, useEffect, useRef } from "react";
import useLoadingAnimation from "../../hooks/useLoadingAnimation";
import "./style/SocialLinks.css";

/* ── Floating doodles around the terminal ───────────────────── */
const SplashDoodles = () => (
  <div className="splash-doodles" aria-hidden="true">
    {/* top-left star */}
    <svg className="splash-doodle splash-doodle--star-tl" viewBox="0 0 36 36">
      <path
        d="M18 3 L21 13.5 L32 11 L24.5 19 L29 29 L18 23.5 L7 29 L11.5 19 L4 11 L15 13.5 Z"
        fill="#ffd246" fillOpacity="0.82"
        stroke="#1a1208" strokeWidth="2.2" strokeLinejoin="round"
      />
    </svg>

    {/* top-right squiggle */}
    <svg className="splash-doodle splash-doodle--squig-tr" viewBox="0 0 80 18">
      <path
        d="M2 9 C10 3, 18 15, 26 9 C34 3, 42 15, 50 9 C58 3, 66 15, 78 9"
        fill="none" stroke="#39ff7a" strokeWidth="2.4"
        strokeLinecap="round" strokeOpacity="0.55"
      />
    </svg>

    {/* bottom-right dots */}
    <svg className="splash-doodle splash-doodle--dots-br" viewBox="0 0 56 24">
      <ellipse cx="8"  cy="12" rx="6"   ry="5"   transform="rotate(-8 8 12)"
        fill="#ff6b6b" fillOpacity="0.7" stroke="#1a1208" strokeWidth="1.8"/>
      <ellipse cx="30" cy="8"  rx="4.5" ry="3.8" transform="rotate(6 30 8)"
        fill="#ffd246" fillOpacity="0.75" stroke="#1a1208" strokeWidth="1.6"/>
      <ellipse cx="50" cy="16" rx="5"   ry="4.2" transform="rotate(-5 50 16)"
        fill="#39ff7a" fillOpacity="0.6" stroke="#1a1208" strokeWidth="1.6"/>
    </svg>

    {/* bottom-left star */}
    <svg className="splash-doodle splash-doodle--star-bl" viewBox="0 0 28 28">
      <path
        d="M14 2 L16.5 10.5 L25 8.5 L19 15 L23 23.5 L14 19 L5 23.5 L9 15 L3 8.5 L11.5 10.5 Z"
        fill="#a78bfa" fillOpacity="0.78"
        stroke="#1a1208" strokeWidth="2" strokeLinejoin="round"
      />
    </svg>

    {/* left wobbly circle */}
    <svg className="splash-doodle splash-doodle--circle-l" viewBox="0 0 44 44">
      <ellipse cx="22" cy="22" rx="18" ry="15" transform="rotate(-10 22 22)"
        fill="none" stroke="#39ff7a"
        strokeWidth="2.4" strokeDasharray="5 4" strokeOpacity="0.4"
      />
    </svg>

    {/* right cross-hatch patch */}
    <svg className="splash-doodle splash-doodle--hatch-r" viewBox="0 0 40 40">
      <g stroke="#ffd246" strokeWidth="1.4" strokeOpacity="0.38">
        <line x1="0" y1="10" x2="10" y2="0"/>
        <line x1="0" y1="22" x2="22" y2="0"/>
        <line x1="0" y1="34" x2="34" y2="0"/>
        <line x1="6"  y1="40" x2="40" y2="6"/>
        <line x1="18" y1="40" x2="40" y2="18"/>
        <line x1="30" y1="40" x2="40" y2="30"/>
      </g>
    </svg>
  </div>
);

/* ── Main component ──────────────────────────────────────────── */
const SocialLinkSplash = ({ show, message = "Yükleniyor..." }) => {
  const [shouldRender, setShouldRender] = useState(show);
  const splashRef = useRef(null);
  useLoadingAnimation(splashRef, show);

  const [typedMessage, setTypedMessage] = useState("");

  useEffect(() => {
    let typingInterval;

    if (show) {
      setShouldRender(true);
      setTypedMessage("");
      let i = 0;
      typingInterval = setInterval(() => {
        if (i < message.length) {
          setTypedMessage((prev) => prev + message.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 50);
    } else {
      const unmountTimer = setTimeout(() => setShouldRender(false), 400);
      return () => clearTimeout(unmountTimer);
    }

    return () => clearInterval(typingInterval);
  }, [show, message]);

  if (!shouldRender) return null;

  return (
    <div className="splash-overlay" ref={splashRef}>
      {/* Paper grain overlay */}
      <div className="splash-overlay__grain" aria-hidden="true" />

      {/* Floating sketch doodles */}
      <SplashDoodles />

      {/* Terminal window */}
      <div className="splash-terminal">
        {/* Offset sketch shadow */}
        <div className="splash-terminal__shadow" aria-hidden="true" />

        <div className="splash-terminal__window">
          {/* ── Title bar ── */}
          <div className="splash-terminal__header">
            <div className="splash-terminal__header-btns" aria-hidden="true">
              <span className="splash-terminal__hbtn splash-terminal__hbtn--close">×</span>
              <span className="splash-terminal__hbtn splash-terminal__hbtn--min">−</span>
              <span className="splash-terminal__hbtn splash-terminal__hbtn--max">□</span>
            </div>
            <span className="splash-terminal__title">COMMAND PROMPT</span>
            <span className="splash-terminal__title-spacer" aria-hidden="true" />
          </div>

          {/* ── Screen body ── */}
          <div className="splash-terminal__body">
            {/* CRT scanlines */}
            <div className="splash-terminal__scanlines" aria-hidden="true" />

            {/* Boot line */}
            <p className="splash-terminal__boot-line" aria-hidden="true">
              Microsoft Windows [Version 11.0.80s]
            </p>

            {/* Typed command */}
            <div className="splash-terminal__line">
              <span className="splash-terminal__prompt">C:\&gt;&nbsp;</span>
              <span className="splash-terminal__text">{typedMessage}</span>
              <span className="splash-terminal__cursor" aria-hidden="true">_</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLinkSplash;
