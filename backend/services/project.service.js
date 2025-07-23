import {
  findAllProjects,
  findProjectById,
  saveProject,
  updateProjectById,
  deleteProjectById,
} from "../repositories/project.repository.js";

const getAllProjects = async () => {
  return await findAllProjects();
};
const getProjectById = async (id) => {
  const project = await findProjectById(id);
  if (!project) throw new Error("Proje bulunamadı.");
  return project;
};
const createNewProject = async (projectData) => {
  return await saveProject(projectData);
};
const updateExistingProject = async (id, updateData) => {
  const updatedProject = await updateProjectById(id, updateData);
  if (!updatedProject) throw new Error("Güncellenecek proje bulunamadı.");
  return updatedProject;
};
const deleteExistingProject = async (id) => {
  const result = await deleteProjectById(id);
  if (!result) throw new Error("Silinecek proje bulunamadı.");
  return result;
};
export {
  getAllProjects,
  getProjectById,
  createNewProject,
  updateExistingProject,
  deleteExistingProject,
};
