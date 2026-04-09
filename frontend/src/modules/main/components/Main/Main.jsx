import React, { useCallback, useRef, useState } from "react";
import { useGsapAnimation } from "../../hooks/useGsapAnimation.js";
import Title from "./Title.jsx";
import Subtitle from "./Subtitle.jsx";
import AudioControls from "./AudioControls.jsx";
import PortfolioButton from "./PortfolioButton.jsx";
import MainImage from "./MainImage.jsx";
import MusicSketchRain from "./MusicSketchRain.jsx";
import RoleSelectionModal from "@shared/ui/RoleSelectionModal.jsx"; // Modal'ı import ediyoruz

import "./style/Main.css";

const Main = ({ onIsPlayingChange, onAudioDataChange }) => {
  // Modal'ın açık/kapalı durumunu yönetmek için state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAudioPlayingLocal, setIsAudioPlayingLocal] = useState(false);

  const mainRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const audioControlRef = useRef(null);
  const imageRef = useRef(null);

  useGsapAnimation(
    mainRef,
    titleRef,
    subtitleRef,
    buttonRef,
    audioControlRef,
    imageRef,
  );

  // Butona tıklandığında modalı açacak fonksiyon
  const handleOpenRoleModal = () => {
    setIsRoleModalOpen(true);
  };

  // Modal kapandığında state'i güncelleyecek fonksiyon
  const handleCloseRoleModal = () => {
    setIsRoleModalOpen(false);
  };

  const handleIsPlayingChange = useCallback(
    (value) => {
      setIsAudioPlayingLocal(value);
      onIsPlayingChange?.(value);
    },
    [onIsPlayingChange],
  );

  return (
    <>
      <section ref={mainRef} className="main-container">
        <MusicSketchRain
          isActive={isAudioPlayingLocal}
          containerRef={mainRef}
        />
        <div className="main-content">
          <Title ref={titleRef} />
          <Subtitle ref={subtitleRef} />
          <AudioControls
            ref={audioControlRef}
            onIsPlayingChange={handleIsPlayingChange}
            onAudioDataChange={onAudioDataChange}
          />
          {/* PortfolioButton'a onClick olayını iletiyoruz */}
          <PortfolioButton ref={buttonRef} onClick={handleOpenRoleModal} />
        </div>
        <MainImage ref={imageRef} />
      </section>

      {/* Modal'ı render ediyoruz ve durumunu state'e bağlıyoruz */}
      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={handleCloseRoleModal}
      />
    </>
  );
};

export default Main;
