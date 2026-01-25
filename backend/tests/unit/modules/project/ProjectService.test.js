import { jest } from "@jest/globals";
import { ProjectService } from "../../../../src/modules/project/application/services/ProjectService.js";

const createDependencies = () => {
  const projectRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findBySlug: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
    incrementViews: jest.fn(),
  };

  return {
    projectRepository,
    projectService: new ProjectService({ projectRepository }),
  };
};

describe("ProjectService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listProjects", () => {
    it("should forward filters to repository", async () => {
      const { projectService, projectRepository } = createDependencies();
      projectRepository.findAll.mockResolvedValue([
        { id: "1", title: "Test", tags: "react, node" },
      ]);

      const projects = await projectService.listProjects({ status: "active" });

      expect(projectRepository.findAll).toHaveBeenCalledWith(
        { status: "active" },
        { lean: false },
      );
      expect(projects).toHaveLength(1);
      expect(projects[0].tags).toEqual(["react", "node"]);
    });
  });

  describe("getProjectById", () => {
    it("should return project when found", async () => {
      const { projectService, projectRepository } = createDependencies();
      projectRepository.findById.mockResolvedValue({ id: "1", title: "Test" });

      const project = await projectService.getProjectById("1");

      expect(projectRepository.findById).toHaveBeenCalledWith("1", {});
      expect(project.id).toBe("1");
    });

    it("should throw when project missing", async () => {
      const { projectService, projectRepository } = createDependencies();
      projectRepository.findById.mockResolvedValue(null);

      await expect(projectService.getProjectById("1")).rejects.toThrow(
        "Proje bulunamadı.",
      );
    });
  });

  describe("createProject", () => {
    it("should generate slug and normalize payload", async () => {
      const { projectService, projectRepository } = createDependencies();
      projectRepository.create.mockResolvedValue({
        id: "1",
        title: "Test Proje",
        slug: "test-proje",
        tags: ["react"],
      });

      await projectService.createProject({
        title: "Test Proje",
        description: "Açıklama",
        tags: "react",
      });

      expect(projectRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Proje",
          slug: "test-proje",
          tags: ["react"],
        }),
      );
    });

    it("should accept V2 payload and map to legacy fields", async () => {
      const { projectService, projectRepository } = createDependencies();
      projectRepository.create.mockResolvedValue({
        id: "mongo-id",
        externalId: "project-001",
        title: "Mülakat Asistanı",
        slug: "mulakat-asistani",
        imageUrl: "/assets/projects/interview-app/thumb.webp",
        isFeatured: true,
        featured: true,
        metadata: {
          title: "Mülakat Asistanı",
          tagline: "Yazılım Adayları İçin AI Destekli Mülakat Simülasyonu",
        },
        visuals: {
          thumbnailUrl: "/assets/projects/interview-app/thumb.webp",
        },
      });

      await projectService.createProject({
        id: "project-001",
        isFeatured: true,
        metadata: {
          title: "Mülakat Asistanı",
          tagline: "Yazılım Adayları İçin AI Destekli Mülakat Simülasyonu",
          createdAt: new Date("2026-01-20"),
        },
        visuals: {
          thumbnailUrl: "/assets/projects/interview-app/thumb.webp",
          heroVideoUrl: "/assets/projects/interview-app/demo-reel.mp4",
          primaryColor: "#2A2A2A",
        },
      });

      expect(projectRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          externalId: "project-001",
          title: "Mülakat Asistanı",
          slug: "mulakat-asistani",
          imageUrl: "/assets/projects/interview-app/thumb.webp",
          featured: true,
          isFeatured: true,
          metadata: expect.objectContaining({
            title: "Mülakat Asistanı",
            tagline: "Yazılım Adayları İçin AI Destekli Mülakat Simülasyonu",
          }),
          visuals: expect.objectContaining({
            thumbnailUrl: "/assets/projects/interview-app/thumb.webp",
          }),
        }),
      );
    });

    it("should throw when title missing", async () => {
      const { projectService } = createDependencies();

      await expect(projectService.createProject({})).rejects.toThrow(
        "Proje başlığı zorunludur.",
      );
    });
  });

  describe("updateProject", () => {
    it("should merge updates and generate slug when title changes", async () => {
      const { projectService, projectRepository } = createDependencies();
      projectRepository.updateById.mockResolvedValue({
        id: "1",
        title: "Yeni Başlık",
        slug: "yeni-baslik",
        tags: ["react"],
      });

      const project = await projectService.updateProject("1", {
        title: "Yeni Başlık",
        tags: "react",
      });

      expect(projectRepository.updateById).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({
          title: "Yeni Başlık",
          slug: "yeni-baslik",
          tags: ["react"],
        }),
      );
      expect(project.slug).toBe("yeni-baslik");
    });

    it("should throw when project not found", async () => {
      const { projectService, projectRepository } = createDependencies();
      projectRepository.updateById.mockResolvedValue(null);

      await expect(projectService.updateProject("1", {})).rejects.toThrow(
        "Güncellenecek proje bulunamadı.",
      );
    });
  });

  describe("deleteProject", () => {
    it("should delete project", async () => {
      const { projectService, projectRepository } = createDependencies();
      projectRepository.deleteById.mockResolvedValue({
        message: "Proje başarıyla silindi.",
      });

      const result = await projectService.deleteProject("1");

      expect(projectRepository.deleteById).toHaveBeenCalledWith("1");
      expect(result).toEqual({ message: "Proje başarıyla silindi." });
    });

    it("should throw when project not found", async () => {
      const { projectService, projectRepository } = createDependencies();
      projectRepository.deleteById.mockResolvedValue(null);

      await expect(projectService.deleteProject("1")).rejects.toThrow(
        "Silinecek proje bulunamadı.",
      );
    });
  });
});
