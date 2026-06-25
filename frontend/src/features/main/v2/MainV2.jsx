import { useCallback, useState } from "react";
import { ArrowRight } from "lucide-react";
import { RoleSelectionModal } from "@shared";
import Title from "../components/Main/Title.jsx";
import Subtitle from "../components/Main/Subtitle.jsx";
import AudioControls from "../components/Main/AudioControls.jsx";
import MainImage from "../components/Main/MainImage.jsx";
import MusicSketchRain from "../components/Main/MusicSketchRain.jsx";
import "./MainV2.css";

const MainV2 = ({ onIsPlayingChange }) => {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAudioPlayingLocal, setIsAudioPlayingLocal] = useState(false);

  const handleIsPlayingChange = useCallback(
    (value) => {
      setIsAudioPlayingLocal(value);
      onIsPlayingChange?.(value);
    },
    [onIsPlayingChange]
  );

  return (
    <>
      <section className="mn2">
        <MusicSketchRain isActive={isAudioPlayingLocal} />

        <div className="mn2__content">
          <Title />
          <Subtitle />
          <AudioControls
            onIsPlayingChange={handleIsPlayingChange}
          />
          <div className="mn2__cta">
            <button
              type="button"
              className="ds-btn ds-btn--primary ds-btn--lg"
              onClick={() => setIsRoleModalOpen(true)}
            >
              Portfolyoyu Keşfet
              <ArrowRight size={20} className="ds-btn__icon ds-btn__icon--end" />
            </button>
          </div>
        </div>

        <MainImage />
      </section>

      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </>
  );
};

export default MainV2;
