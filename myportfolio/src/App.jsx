import React, { useState } from "react";
import { Navbar } from "./components/Navbar/Navbar.jsx";
import Main from "./components/Main/Main.jsx";
import "./style/global.css";
import SocialLinks from "./components/SocialLinks/SocialLinks.jsx";
import Splash from "./components/Splash/Splash.jsx";
import About from "./components/About/About.jsx";
import ProjectList from "./components/Projects/ProjectList/ProjectList.jsx";
import Comments from "./components/Comments/Comments.jsx";
import MessageForm from "./components/Message/MessageForm.jsx";

function App() {
  const [splashComplete, setSplashComplete] = useState(false);

  const handleSplashComplete = () => {
    setSplashComplete(true);
  };

  return (
    <>
      {!splashComplete && <Splash onComplete={handleSplashComplete} />}

      <div className={`app-container ${splashComplete ? "show" : "hide"}`}>
        <Navbar />
        <div className="content-container">
          <Main />
        </div>
        <SocialLinks />
      </div>

      {/*About Header */}
      <About />
      {/* Projects */}
      <ProjectList />
      {/*Comments */}
      <Comments />
      {/*Message */}
      <MessageForm />
      {/* Footer */}
    </>
  );
}

export default App;
