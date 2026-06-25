export const AboutSummary = ({ formData }) => {
  const statCount = formData.stats?.length ?? 0;
  const serviceCount = formData.services?.length ?? 0;

  const items = [
    { label: "Servis Kartı", value: serviceCount },
    { label: "İstatistik Kartı", value: statCount },
    { label: "GitHub Kullanıcı", value: formData.githubUsername || "-" },
    { label: "Durum", value: formData.isActive ? "Aktif" : "Pasif" },
  ];

  return (
    <div className="abt-summary">
      {items.map((item) => (
        <div key={item.label} className="abt-summary__item">
          <strong>{item.label}</strong>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
};
