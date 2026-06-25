import { useEffect, useState } from "react";
import { useTheme } from "@core";
import MainV2 from "@features/main/v2/MainV2.jsx";
import "./HomePage.css";

const HomePage = () => {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    document.title = "Nuh Demir | Portfolio";
  }, []);

  return (
    <div className={`home theme-${theme}`}>
      <MainV2 onIsPlayingChange={setIsPlaying} />
    </div>
  );
};

export default HomePage;
