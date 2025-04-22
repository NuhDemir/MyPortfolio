// src/components/ProjectList/ProjectList.jsx
import React, { useState } from "react";
import ProjectCard from "../ProjectCard/ProjectCard";
import "./ProjectList.css";
import MyProjectsSvg from "../../../assets/icons/MyProject.svg"; // SVG dosyasını içe aktar

const ProjectList = () => {
  const [projects] = useState([
    {
      name: "JavaScript Öğreniyorum Iron MAN ile",
      description:
        "Temel ve ileri seviye JavaScript konularını kapsayan eğitim serisi.",
      image: "https://avatars.githubusercontent.com/u/0000000?v=4", // Örnek avatar
      html_url: "https://github.com/NuhDemir/javascript-ogreniyorum",
    },
    {
      name: "Flutter İşaret Dili Çevirici",
      description:
        "İşitme engelliler için sesleri yazıya ve işaret diline çeviren mobil uygulama.",
      image: "https://avatars.githubusercontent.com/u/0000000?v=4",
      html_url: "https://github.com/NuhDemir/flutter-sign-language",
    },
    {
      name: "Flutter İşaret Dili Çevirici",
      description:
        "İşitme engelliler için sesleri yazıya ve işaret diline çeviren mobil uygulama.",
      image: "https://avatars.githubusercontent.com/u/0000000?v=4",
      html_url: "https://github.com/NuhDemir/flutter-sign-language",
    },
  ]);

  return (
    <div className="project-list">
      {/*TODO: My project to img-svg */}
      <img className="project-list-title" src={MyProjectsSvg} My Projects />
      <div className="project-list-container">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.name}
            description={project.description || "No description"}
            image={project.image}
            link={project.html_url}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
