export { default as ResourcesPage } from "./pages/ResourcesPage.jsx";
export { default as ResourceDetailPage } from "./pages/ResourceDetailPage.jsx";
export { default as ResourceGrid } from "./components/Resources/ResourceGrid.jsx";
export { default as ResourceCard } from "./components/Resources/ResourceCard.jsx";
export { default as ResourceFilters } from "./components/Resources/ResourceFilters.jsx";
export { useResources } from "./hooks/useResources.js";
export { fetchResources, fetchResourceBySlug, FALLBACK_RESOURCES } from "./services/resourceService.js";
