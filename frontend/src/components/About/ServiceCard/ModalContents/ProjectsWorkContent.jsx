// src/components/About/ServiceCard/ModalContents/ProjectsWorkContent.jsx
import React from "react";

// Projeler ve İşler için modal içeriği
const ProjectsWorkContent = () => {
  return (
    <div>
      <h3>Projects & Work Experience</h3>
      <p>
        Throughout my career and personal time, I've worked on a diverse range
        of projects, focusing on delivering high-quality, user-centric
        solutions.
      </p>
      <h4>Key Project Highlights:</h4>
      <ul>
        <li>
          <strong>JavaScript Öğreniyorum:</strong> An educational repository
          covering fundamental and advanced JavaScript concepts. Aimed at
          helping beginners and intermediate developers strengthen their skills.
          <a
            href="https://github.com/NuhDemir/javascript-ogreniyorum"
            target="_blank"
            rel="noopener noreferrer"
          >
            [GitHub Link]
          </a>
        </li>
        <li>
          <strong>Flutter Sign Language Translator:</strong> Developed a mobile
          application prototype using Flutter to translate spoken words into
          text and sign language visuals, aiming to improve accessibility for
          the hearing impaired.
          <a
            href="https://github.com/NuhDemir/flutter-sign-language"
            target="_blank"
            rel="noopener noreferrer"
          >
            [GitHub Link]
          </a>
        </li>
        <li>
          <strong>Diabetes Analysis Panel (This Project!):</strong> Created an
          interactive dashboard using React and Node.js for visualizing and
          analyzing diabetes risk factors from patient data, incorporating data
          fetching, state management, and dynamic charting.
        </li>
        {/* Buraya diğer önemli projelerinizi veya iş deneyimlerinizi ekleyebilirsiniz */}
        <li>
          <strong>E-commerce Platform Backend:</strong> Designed and implemented
          RESTful APIs using Node.js (Express) and MongoDB for a scalable
          e-commerce application, handling products, orders, and user
          authentication.
        </li>
      </ul>
      <p>
        You can explore more of my public projects on my{" "}
        <a
          href="https://github.com/NuhDemir"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub profile
        </a>
        . I am always looking for challenging opportunities to build innovative
        software.
      </p>
    </div>
  );
};

export default ProjectsWorkContent;
