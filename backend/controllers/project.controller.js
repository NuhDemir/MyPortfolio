import asyncHandler from "express-async-handler";
import {
  getAllProjects,
  getProjectById,
  createNewProject,
  updateExistingProject,
  deleteExistingProject,
} from "../services/project.service.js";

const getProjects = asyncHandler(async (req, res) => {
  const projects = await getAllProjects();
  res.json(projects);
});

const getProject = asyncHandler(async (req, res) => {
  const project = await getProjectById(req.params.id);
  res.json(project);
});

const createProject = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Proje görseli zorunludur.");
  }
  const { title, description, githubUrl, liveUrl, tags } = req.body;
  const projectData = {
    title,
    description,
    imageUrl: req.file.path,
    githubUrl,
    liveUrl,
    tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
  };
  const createdProject = await createNewProject(projectData);
  res.status(201).json(createdProject);
});

const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, githubUrl, liveUrl, tags } = req.body;
  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
  if (liveUrl !== undefined) updateData.liveUrl = liveUrl;
  if (tags !== undefined) {
    updateData.tags = tags ? tags.split(",").map((tag) => tag.trim()) : [];
  }
  if (req.file) {
    updateData.imageUrl = req.file.path;
  }
  const updatedProject = await updateExistingProject(id, updateData);
  res.json(updatedProject);
});

const deleteProject = asyncHandler(async (req, res) => {
  await deleteExistingProject(req.params.id);
  res.json({ message: "Proje başarıyla silindi." });
});

export { getProjects, getProject, createProject, updateProject, deleteProject };
