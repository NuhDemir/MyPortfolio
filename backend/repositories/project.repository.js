import Project from "../models/Project.js";

const findAllProjects = async () => {
  return await Project.find({}).sort({ createdAt: -1 });
};
const findProjectById = async (id) => {
  return await Project.findById(id);
};
const saveProject = async (projectData) => {
  const newProject = new Project(projectData);
  return await newProject.save();
};
const updateProjectById = async (id, updateData) => {
  return await Project.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};
const deleteProjectById = async (id) => {
  return await Project.findByIdAndDelete(id);
};
export {
  findAllProjects,
  findProjectById,
  saveProject,
  updateProjectById,
  deleteProjectById,
};
