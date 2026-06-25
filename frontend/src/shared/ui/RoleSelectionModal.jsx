import React from "react";
import { Code, Briefcase } from "lucide-react";
import { useUserRole } from "@core";
import "@shared/design-system/components/RoleSelectionModal.css";

const RoleSelectionModal = ({ isOpen, onClose }) => {
  const { selectRole } = useUserRole();

  if (!isOpen) return null;

  const handleSelection = (role) => {
    selectRole(role);
    onClose();
  };

  return (
    <div className="role-modal-overlay">
      <div className="role-modal-container">
        <h2 className="role-modal-title">Deneyiminizi Kişiselleştirin</h2>
        <p className="role-modal-subtitle">
          Hangi rolde olduğunuzu seçerek size özel bir arayüzle devam edin.
        </p>

        <div className="role-modal-options">
          <button
            className="role-option-btn developer"
            onClick={() => handleSelection("developer")}
          >
            <Code size={48} />
            <h3>Yazılımcıyım</h3>
            <p>Teknik detaylar, kod örnekleri ve daha fazlası.</p>
          </button>

          <button
            className="role-option-btn recruiter"
            onClick={() => handleSelection("recruiter")}
          >
            <Briefcase size={48} />
            <h3>İş Verenim / Diğer</h3>
            <p>Projeler, yetenekler ve hızlı iletişim kanalları.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
