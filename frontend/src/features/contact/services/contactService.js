const FORMSPREE_ENDPOINT = "https://formspree.io/f/xblojjrn";

export const submitContactForm = async (formData) => {
  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message =
      data.errors?.map((err) => err.message).join(", ") ||
      "Mesaj gönderimi başarısız oldu.";
    throw new Error(message);
  }

  return response;
};
