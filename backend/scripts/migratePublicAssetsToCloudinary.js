import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cloudinary from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, "../..");
const backendEnvPath = path.resolve(__dirname, "../.env");
const publicDir = path.join(repoRoot, "frontend", "public");
const frontendSrcDir = path.join(repoRoot, "frontend", "src");
const frontendRootFiles = [path.join(repoRoot, "frontend", "index.html")];
const manifestPath = path.join(
  repoRoot,
  "frontend",
  "src",
  "shared",
  "assets",
  "cloudinaryAssetMap.json"
);

const REPLACEABLE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
  ".scss",
  ".json",
  ".html",
]);

const UPLOADABLE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
  ".avif",
  ".ico",
  ".bmp",
  ".tif",
  ".tiff",
  ".mp4",
  ".webm",
  ".mov",
  ".m4v",
]);

const SKIP_EXISTING_UPLOADS =
  process.env.CLOUDINARY_SKIP_EXISTING !== "false";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeDuplicateCloudinaryUrls(content) {
  return content.replace(
    /(\/portfolio\/public)(https:\/\/res\.cloudinary\.com\/[^"'\s)]+\/portfolio\/public)+/g,
    "$1"
  );
}

function toPosix(inputPath) {
  return inputPath.split(path.sep).join("/");
}

async function walkFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const resolved = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walkFiles(resolved);
      }
      return resolved;
    })
  );

  return files.flat();
}

function configureCloudinary() {
  dotenv.config({ path: backendEnvPath });

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      "Cloudinary env bilgileri eksik. backend/.env içinde CLOUDINARY_* değerlerini kontrol et."
    );
  }

  cloudinary.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

function buildPublicId(relativePath, extension) {
  const withoutExt = relativePath.slice(0, -extension.length);
  return `portfolio/public/${withoutExt}`;
}

async function findExistingResource(publicId) {
  const resourceTypes = ["image", "video", "raw"];

  for (const resourceType of resourceTypes) {
    try {
      const existing = await cloudinary.v2.api.resource(publicId, {
        resource_type: resourceType,
      });

      if (existing?.secure_url) {
        return existing;
      }
    } catch (error) {
      if (error?.http_code !== 404) {
        throw error;
      }
    }
  }

  return null;
}

async function uploadPublicAssets() {
  const allPublicFiles = await walkFiles(publicDir);
  const targetFiles = allPublicFiles.filter((filePath) =>
    UPLOADABLE_EXTENSIONS.has(path.extname(filePath).toLowerCase())
  );

  console.log(`Toplam yüklenecek medya dosyası: ${targetFiles.length}`);

  const mapping = {};

  for (const absoluteFilePath of targetFiles) {
    const ext = path.extname(absoluteFilePath).toLowerCase();
    const relativePath = toPosix(path.relative(publicDir, absoluteFilePath));
    const publicPath = `/${relativePath}`;
    const publicId = buildPublicId(relativePath, ext);

    if (SKIP_EXISTING_UPLOADS) {
      const existing = await findExistingResource(publicId);
      if (existing?.secure_url) {
        mapping[publicPath] = existing.secure_url;
        console.log(`Atlandi (mevcut): ${publicPath}`);
        continue;
      }
    }

    const result = await cloudinary.v2.uploader.upload(absoluteFilePath, {
      resource_type: "auto",
      public_id: publicId,
      overwrite: true,
      invalidate: true,
      unique_filename: false,
      use_filename: false,
    });

    mapping[publicPath] = result.secure_url;
    console.log(`Yuklendi: ${publicPath}`);
  }

  const sortedMapping = Object.fromEntries(
    Object.entries(mapping).sort(([a], [b]) => a.localeCompare(b))
  );

  const manifestPayload = {
    generatedAt: new Date().toISOString(),
    folder: "portfolio/public",
    items: sortedMapping,
  };

  await fs.writeFile(manifestPath, JSON.stringify(manifestPayload, null, 2), "utf8");

  return sortedMapping;
}

async function replaceAssetReferences(assetMap) {
  const candidateFiles = [
    ...(await walkFiles(frontendSrcDir)),
    ...frontendRootFiles,
  ].filter((filePath) =>
    REPLACEABLE_EXTENSIONS.has(path.extname(filePath).toLowerCase())
  ).filter((filePath) => path.resolve(filePath) !== path.resolve(manifestPath));

  let changedFiles = 0;
  let replaceCount = 0;

  for (const filePath of candidateFiles) {
    const originalContent = await fs.readFile(filePath, "utf8");
    let updatedContent = normalizeDuplicateCloudinaryUrls(originalContent);

    for (const [localPath, cloudUrl] of Object.entries(assetMap)) {
      if (updatedContent.includes(localPath)) {
        const escapedLocalPath = escapeRegExp(localPath);
        const replaceRegex = new RegExp(
          `(["'])${escapedLocalPath}(["'])`,
          "g"
        );

        let occurrencesInFile = 0;
        updatedContent = updatedContent.replace(
          replaceRegex,
          (_match, p1, p2) => {
            occurrencesInFile += 1;
            return `${p1}${cloudUrl}${p2}`;
          }
        );
        replaceCount += occurrencesInFile;
      }
    }

    if (updatedContent !== originalContent) {
      await fs.writeFile(filePath, updatedContent, "utf8");
      changedFiles += 1;
    }
  }

  return { changedFiles, replaceCount };
}

async function main() {
  configureCloudinary();
  const assetMap = await uploadPublicAssets();
  const { changedFiles, replaceCount } = await replaceAssetReferences(assetMap);

  console.log("\nIslem tamamlandi.");
  console.log(`Manifest: ${path.relative(repoRoot, manifestPath)}`);
  console.log(`Guncellenen dosya sayisi: ${changedFiles}`);
  console.log(`Degistirilen referans sayisi: ${replaceCount}`);
}

main().catch((error) => {
  console.error("Hata:", error.message);
  process.exitCode = 1;
});

