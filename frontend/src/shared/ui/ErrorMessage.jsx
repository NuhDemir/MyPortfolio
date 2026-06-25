import "@shared/design-system/components/ErrorMessage.css";

const DEFAULT_MESSAGE = "Bir hata oluştu.";

const resolveMessage = ({ message, error }) => {
  if (message) return message;
  if (!error) return DEFAULT_MESSAGE;
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  return DEFAULT_MESSAGE;
};

const ErrorMessage = ({ message, error, title }) => {
  const resolvedMessage = resolveMessage({ message, error });
  if (!resolvedMessage) return null;

  return (
    <div className="ds-error" role="alert">
      {title && <strong style={{ display: "block", marginBottom: "4px" }}>{title}</strong>}
      {resolvedMessage}
    </div>
  );
};

export default ErrorMessage;
