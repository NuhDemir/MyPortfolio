import React from "react";

const DEVICON_CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const ICON_MAP = {
  react:"react/react-original", typescript:"typescript/typescript-original", javascript:"javascript/javascript-original",
  nodejs:"nodejs/nodejs-original", "node.js":"nodejs/nodejs-original", python:"python/python-original",
  nextjs:"nextjs/nextjs-original", "next.js":"nextjs/nextjs-original", tailwind:"tailwindcss/tailwindcss-original",
  tailwindcss:"tailwindcss/tailwindcss-original", postgresql:"postgresql/postgresql-original",
  mongodb:"mongodb/mongodb-original", git:"git/git-original", docker:"docker/docker-original",
  graphql:"graphql/graphql-plain", figma:"figma/figma-original", css3:"css3/css3-original",
  html5:"html5/html5-original", sass:"sass/sass-original", vite:"vitejs/vitejs-original",
  github:"github/github-original", express:"express/express-original", redux:"redux/redux-original",
  firebase:"firebase/firebase-plain", aws:"amazonwebservices/amazonwebservices-plain-wordmark",
  linux:"linux/linux-original", mysql:"mysql/mysql-original", redis:"redis/redis-original",
  flutter:"flutter/flutter-original", dart:"dart/dart-original", kotlin:"kotlin/kotlin-original",
  java:"java/java-original", go:"go/go-original", rust:"rust/rust-original",
  vuejs:"vuejs/vuejs-original", svelte:"svelte/svelte-original", electron:"electron/electron-original",
  prisma:"prisma/prisma-original", kubernetes:"kubernetes/kubernetes-original",
  nginx:"nginx/nginx-original", webpack:"webpack/webpack-original", jest:"jest/jest-plain",
  cypress:"cypress/cypress-original", nestjs:"nestjs/nestjs-original", csharp:"csharp/csharp-original",
  "c#":"csharp/csharp-original", dotnetcore:"dotnetcore/dotnetcore-original",
  "asp.net":"dotnetcore/dotnetcore-original", dotnet:"dotnetcore/dotnetcore-original",
  reactnative:"react/react-original", "react native":"react/react-original",
  framer:"framermotion/framermotion-original", framermotion:"framermotion/framermotion-original",
  "framer motion":"framermotion/framermotion-original",
};

const getIcon = (name) => {
  const path = ICON_MAP[name.toLowerCase().trim()];
  return path ? `${DEVICON_CDN}/${path}.svg` : null;
};

const DEFAULT_SKILLS = [
  "React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js",
  "NestJS", "PostgreSQL", "MongoDB", "Redis", "Python",
  "Docker", "Prisma", "React Native", "Git", "Figma",
];

export const Skills = ({ skills = [] }) => {
  const list = skills.length > 0 ? skills : DEFAULT_SKILLS;

  return (
    <section>
      <h2 className="about3__section-title">Teknolojiler</h2>
      <div className="about3__skills">
        {list.map((s) => {
          const icon = getIcon(s);
          return (
            <span key={s} className="about3__skill">
              {icon && <img src={icon} alt="" className="about3__skill-icon" loading="lazy" />}
              {s}
            </span>
          );
        })}
      </div>
    </section>
  );
};
