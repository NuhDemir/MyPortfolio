import { useState, useCallback } from "react";
import { submitContactForm } from "../services/contactService";

const initialFormData = { name: "", email: "", message: "" };

export const useContactForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState("idle");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setStatus("submitting");

      try {
        await submitContactForm(formData);
        setStatus("success");
        setFormData(initialFormData);
      } catch {
        setStatus("error");
      }
    },
    [formData]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setFormData(initialFormData);
  }, []);

  return { formData, status, handleChange, handleSubmit, reset };
};
