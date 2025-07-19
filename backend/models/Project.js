import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, // Resmin Cloudinary URL'si burada saklanacak
    required: true,
  },
  githubUrl: {
    type: String, // GitHub reposunun linki
    required: false, // Olmasa da olur
  },
  liveUrl: {
    type: String, // Canlı demo linki
    required: false,
  },
  tags: [
    {
      type: String, // Projenin etiketleri (örneğin: React, Node.js, MongoDB)
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

projectSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
