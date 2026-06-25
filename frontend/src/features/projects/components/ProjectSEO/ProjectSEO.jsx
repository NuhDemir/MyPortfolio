import { Helmet } from "react-helmet-async";
import { getProjectTitle, getProjectTagline } from "../../utils/projectFormatters.js";

const ProjectSEO = ({ project }) => {
  if (!project) return null;

  const title = `${getProjectTitle(project)} | Nuh Demir - Projeler`;
  const description = getProjectTagline(project) || "Proje detay sayfasi";
  const image = project?.thumbnailUrl || project?.imageUrl || "";
  const url = `https://www.nuhdemir.netlify.app/projects/${project.slug || project.id}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: getProjectTitle(project),
    description,
    url,
    ...(image && { image }),
    applicationCategory: "DeveloperApplication",
    operatingSystem: project?.context?.platform || "Web",
    author: {
      "@type": "Person",
      name: "Nuh Demir",
      url: "https://www.nuhdemir.netlify.app",
    },
    ...(project?.links?.github && { codeRepository: project.links.github }),
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default ProjectSEO;
