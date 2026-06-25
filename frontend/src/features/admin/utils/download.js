const parseContentDispositionFilename = (contentDisposition) => {
  if (!contentDisposition || typeof contentDisposition !== "string") {
    return null;
  }

  // Examples:
  // attachment; filename="projects-export-2026-01-25T12-00-00-000Z.json"
  // attachment; filename*=UTF-8''projects-export.json
  const filenameStarMatch = contentDisposition.match(
    /filename\*=(?:UTF-8'')?([^;]+)/i,
  );
  if (filenameStarMatch?.[1]) {
    return decodeURIComponent(
      filenameStarMatch[1].trim().replace(/^"|"$/g, ""),
    );
  }

  const filenameMatch = contentDisposition.match(/filename=([^;]+)/i);
  if (filenameMatch?.[1]) {
    return filenameMatch[1].trim().replace(/^"|"$/g, "");
  }

  return null;
};

export const downloadFromAxiosBlobResponse = (response, fallbackFilename) => {
  const blobData = response?.data;
  const contentType = response?.headers?.["content-type"];

  const blob =
    blobData instanceof Blob
      ? blobData
      : new Blob([blobData], {
          type: contentType || "application/octet-stream",
        });

  const filename =
    parseContentDispositionFilename(
      response?.headers?.["content-disposition"],
    ) ||
    fallbackFilename ||
    "export.json";

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
