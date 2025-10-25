import React, { useRef, useImperativeHandle, forwardRef } from "react";
import ConsoleEmulator from "react-console-emulator";
import { useUserRole } from "@core/context/UserRoleContext.jsx";
import { useTheme } from "@core/context/ThemeContext.jsx";
import "./style/Terminal.css";

// Bileşeni, bir üst bileşenin bu bileşenin içindeki fonksiyonlara erişebilmesi için
// `forwardRef` ile sarmalıyoruz.
const Terminal = forwardRef(({ onCommand }, ref) => {
  const { resetRole } = useUserRole();
  const { toggleTheme, theme } = useTheme();

  // ConsoleEmulator bileşeninin kendisine erişmek için bir ref oluşturuyoruz.
  const consoleRef = useRef(null);

  // `useImperativeHandle` hook'u, bu bileşenin ref'ine dışarıdan hangi
  // fonksiyonların ekleneceğini belirler.
  // Bu sayede DeveloperExperience.jsx'ten terminale komut gönderebiliriz.
  useImperativeHandle(ref, () => ({
    pushCommand(command) {
      if (consoleRef.current) {
        consoleRef.current.pushCommand(command);
      }
    },
  }));

  const commands = {
    help: {
      description: "Kullanılabilir komutları listeler.",
      fn: () => `
Kullanılabilir Komutlar:
  help                - Bu yardım menüsünü gösterir.
  whoami              - Benim hakkımda kısa bilgi.
  projects            - Tüm projeleri listeler ve gösterir.
  projects [id]       - Belirtilen ID'ye sahip projeyi seçer. (Örn: projects proj-01)
  contact             - İletişim bilgilerimi gösterir.
  social              - Sosyal medya profillerimi listeler.
  theme [light|dark]  - Arayüz temasını değiştirir.
  neofetch            - Sistem bilgilerimi gösterir.
  clear               - Terminali temizler.
  exit                - Developer modundan çıkar.
      `,
    },
    whoami: {
      description: "Benim hakkımda kısa bilgi.",
      fn: () => `
Nuh Demir
Full Stack Developer

Modern web ve mobil teknolojileri kullanarak kullanıcı dostu, performanslı 
ve estetik açıdan zengin uygulamalar geliştirmeye odaklanmış, tutkulu bir
problem çözücü ve hayat boyu öğrenen bir yazılım geliştirici.
      `,
    },
    projects: {
      description: "Projelerimi listeler veya belirtilen projeyi seçer.",
      fn: (...args) => {
        const projectId = args.join(" ");
        if (projectId) {
          onCommand("selectProject", projectId);
          return `'${projectId}' ID'li proje seçiliyor...`;
        } else {
          onCommand("showProjects");
          return "Tüm projeler yükleniyor...";
        }
      },
    },
    contact: {
      description: "İletişim bilgilerimi gösterir.",
      fn: () => {
        onCommand("showContact");
        return "İletişim bilgileri getiriliyor...";
      },
    },
    social: {
      description: "Sosyal medya profillerimi listeler.",
      fn: () => `
[ Sosyal Medya Profilleri ]
---------------------------
> GitHub:   https://github.com/NuhDemir
> LinkedIn: https://linkedin.com/in/nuh-demir-69b737261/
> YouTube:  https://youtube.com/@Yaz%C4%B1l%C4%B1mK%C4%B1raathanesi
        `,
    },
    theme: {
      description: "Arayüz temasını değiştirir. Kullanım: theme [light|dark]",
      fn: (newTheme) => {
        if (newTheme === "light" || newTheme === "dark") {
          if (newTheme !== theme) {
            toggleTheme();
          }
          return `Tema '${newTheme}' olarak ayarlandı.`;
        }
        return `Hatalı kullanım. Mevcut temalar: 'light', 'dark'`;
      },
    },
    neofetch: {
      description: "Sistem bilgilerimi gösterir.",
      fn: () => `
        ███╗   ██╗██╗  ██╗██╗  ██╗    ██████╗ ███████╗███╗   ███╗██╗██████╗ 
        ████╗  ██║██║  ██║██║  ██║    ██╔══██╗██╔════╝████╗ ████║██║██╔══██╗
        ██╔██╗ ██║███████║███████║    ██║  ██║█████╗  ██╔████╔██║██║██║  ██║
        ██║╚██╗██║██╔══██║██╔══██║    ██║  ██║██╔══╝  ██║╚██╔╝██║██║██║  ██║
        ██║ ╚████║██║  ██║██║  ██║    ██████╔╝███████╗██║ ╚═╝ ██║██║██████╔╝
        ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝    ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝╚═════╝ 
        -------------------------------------------------------------
        OS:       NuhDemir Portfolio v2.0
        Host:     Web Browser
        Shell:    ndsh (Nuh Demir Shell)
        Uptime:   ${Math.floor(performance.now() / 1000)}s
        
        Skills:   React, Node.js, Flutter, JavaScript, TypeScript,
                  Python, Dart, MongoDB, SQL, Express, GSAP
        `,
    },
    exit: {
      description: "Developer modundan çıkar.",
      fn: () => {
        setTimeout(() => resetRole(), 500);
        return "Developer modundan çıkılıyor...";
      },
    },
    clear: {
      description: "Terminali temizler.",
      fn: () => {
        if (consoleRef.current) consoleRef.current.clear();
      },
    },
  };

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="term-btn close"></span>
          <span className="term-btn min"></span>
          <span className="term-btn max"></span>
        </div>
        <div className="terminal-title">ndsh - Nuh Demir Shell</div>
      </div>
      <div className="terminal-body">
        <ConsoleEmulator
          ref={consoleRef}
          commands={commands}
          noDefaults
          promptLabel={"nuhdemir@portfolio:~$"}
          welcomeMessage={
            "Developer Moduna Hoş Geldin! Başlamak için 'help' yaz."
          }
          autoFocus
          dangerMode
          className="react-console-emulator"
          style={{ minHeight: "100%", width: "100%" }}
          promptLabelStyle={{ color: "var(--color-accent)" }}
          inputStyle={{ color: "var(--color-text-primary)" }}
          messageStyle={{ color: "var(--color-text-primary)" }}
          errorText={(command) => `ndsh: komut bulunamadı: ${command}`}
          ignoreCase
        />
      </div>
    </div>
  );
});

export default Terminal;
