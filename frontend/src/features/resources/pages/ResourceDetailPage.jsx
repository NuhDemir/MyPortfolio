import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useScrollReveal, LoadingSpinner } from "@shared";
import { ArrowLeft, ExternalLink, Star, BookOpen, Play, FileText, GraduationCap, Wrench, Ellipsis } from "lucide-react";
import { fetchResourceBySlug } from "../services/resourceService.js";
import "./styles/ResourceDetailPage.css";

const TYPE_ICONS = {
  kitap: BookOpen, video: Play, makale: FileText,
  kurs: GraduationCap, arac: Wrench, diger: Ellipsis,
};

const TYPE_LABELS = {
  kitap: "Kitap", video: "Video", makale: "Makale",
  kurs: "Kurs", arac: "Arac", diger: "Diger",
};

const DIFFICULTY_LABELS = {
  baslangic: "Baslangic", orta: "Orta",
  ileri: "Ileri", uzman: "Uzman",
};

const ResourceDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      const data = await fetchResourceBySlug(slug, { signal: controller.signal });
      if (data) {
        setResource(data);
        document.title = `${data.title} | Nuh Demir`;
      }
      setLoading(false);
    };

    load();
    return () => controller.abort();
  }, [slug]);

  const rev0 = useScrollReveal({ variant: "fadeUp", threshold: 0.08 });
  const rev1 = useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.1 });
  const rev2 = useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.2 });

  if (loading) {
    return (
      <div className="rdp">
        <LoadingSpinner />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="rdp">
        <div className="rdp__container">
          <button className="rdp__back" onClick={() => navigate("/kaynaklar")}>
            <ArrowLeft size={18} /> Kaynaklara Don
          </button>
          <p className="rdp__not-found">Kaynak bulunamadi.</p>
        </div>
      </div>
    );
  }

  const TypeIcon = TYPE_ICONS[resource.type] || Ellipsis;
  const fitMode = resource.coverImageFit || "cover";

  return (
    <div className="rdp">
      <div className="rdp__container">
        <motion.div {...rev0}>
          <button className="rdp__back" onClick={() => navigate("/kaynaklar")}>
            <ArrowLeft size={18} /> Kaynaklara Don
          </button>
        </motion.div>

        <motion.div {...rev1}>
          <div className={`rdp__hero rdp__hero--${fitMode}`}>
            {resource.coverImage ? (
              <div className={`rdp__cover rdp__cover--${fitMode}`}>
                <img
                  src={resource.coverImage}
                  alt={resource.title}
                  className={`rdp__cover-img rdp__cover-img--${fitMode}`}
                />
              </div>
            ) : (
              <div className="rdp__cover rdp__cover--empty">
                <TypeIcon size={48} />
              </div>
            )}

            <div className="rdp__hero-body">
              <div className="rdp__badges">
                <span className="rdp__badge rdp__badge--type">
                  <TypeIcon size={14} />
                  {TYPE_LABELS[resource.type] || "Diger"}
                </span>
                {resource.difficulty && (
                  <span className="rdp__badge rdp__badge--difficulty">
                    {DIFFICULTY_LABELS[resource.difficulty] || resource.difficulty}
                  </span>
                )}
                {resource.language && (
                  <span className="rdp__badge rdp__badge--lang">
                    {resource.language.toUpperCase()}
                  </span>
                )}
              </div>

              <h1 className="rdp__title">{resource.title}</h1>

              {resource.author && (
                <p className="rdp__author">{resource.author}</p>
              )}

              <div className="rdp__rating">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={16} className={i < (resource.rating || 0) ? "filled" : ""} />
                ))}
              </div>

              {resource.url && (
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="rdp__cta">
                  <ExternalLink size={16} /> Kaynaga Git
                </a>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div {...rev2}>
          <div className="rdp__body">
            {resource.description && (
              <div className="rdp__section">
                <h2 className="rdp__section-title">Aciklama</h2>
                <p className="rdp__text">{resource.description}</p>
              </div>
            )}

            {resource.notes && (
              <div className="rdp__section">
                <h2 className="rdp__section-title">Notlar</h2>
                <p className="rdp__text">{resource.notes}</p>
              </div>
            )}

            {resource.tags?.length > 0 && (
              <div className="rdp__section">
                <h2 className="rdp__section-title">Etiketler</h2>
                <div className="rdp__tags">
                  {resource.tags.map((tag) => (
                    <span key={tag} className="rdp__tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
