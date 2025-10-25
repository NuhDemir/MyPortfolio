// src/components/About/ServiceCard/ModalContents/ProgrammingLangContent.jsx
import React from "react";

// Programlama dilleri için modal içeriği
const ProgrammingLangContent = () => {
  return (
    <div>
      {/* İçerik başlığı */}
      <h3>Programming Languages & Approach</h3>
      <p>
        Focused on writing scalable, maintainable, and performant code using
        modern programming languages and adhering to clean code principles.
      </p>
      {/* Kullanılan diller listesi */}
      <ul>
        <li>
          <strong>JavaScript (ES6+):</strong> Expertise in both frontend (React)
          and backend (Node.js).
        </li>
        <li>
          <strong>TypeScript:</strong> Preferred for type safety and improved
          developer experience in larger projects.
        </li>
        <li>
          <strong>Python:</strong> Used for data analysis, automation, and
          backend tasks.
        </li>
        <li>
          <strong>Dart:</strong> Primary language for mobile development with
          Flutter.
        </li>
        {/* Add other relevant languages */}
      </ul>
      <p>
        Selecting the most suitable language and technology stack for each
        project to deliver efficient solutions.
      </p>
    </div>
  );
};

export default ProgrammingLangContent;
