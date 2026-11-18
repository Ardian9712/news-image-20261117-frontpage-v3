import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BYTE_LIMIT = 1024 * 1024;
const DIMENSION_LIMIT = 1024;

type ImageDimensions = { width: number; height: number };

function readDimensions(bytes: Buffer): ImageDimensions {
  let offset = 2;
  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      throw new Error("Invalid JPEG marker before the image frame.");
    }
    while (bytes[offset] === 0xff) offset += 1;
    if (offset >= bytes.length) break;

    const marker = bytes[offset++];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;

    if (offset + 2 > bytes.length) {
      throw new Error("Truncated JPEG segment length.");
    }
    const segmentLength = bytes.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > bytes.length) {
      throw new Error("Invalid JPEG segment length.");
    }

    // Frame markers carry dimensions; these three markers have other roles.
    const isFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isFrame) {
      if (segmentLength < 8) {
        throw new Error("Truncated JPEG frame header.");
      }
      return {
        width: bytes.readUInt16BE(offset + 5),
        height: bytes.readUInt16BE(offset + 3),
      };
    }
    offset += segmentLength;
  }
  throw new Error("No JPEG frame dimensions were found.");
}

function validateImage(bytes: Buffer): ImageDimensions {
  if (bytes.length === 0 || bytes.length >= BYTE_LIMIT) {
    throw new Error("The image must be nonempty and smaller than 1 MiB.");
  }
  if (
    bytes.length < 4 ||
    bytes.readUInt16BE(0) !== 0xffd8 ||
    bytes.readUInt16BE(bytes.length - 2) !== 0xffd9
  ) {
    throw new Error("The image must have JPEG start and end markers.");
  }

  const dimensions = readDimensions(bytes);
  if (
    dimensions.width < 1 ||
    dimensions.height < 1 ||
    dimensions.width > DIMENSION_LIMIT ||
    dimensions.height > DIMENSION_LIMIT
  ) {
    throw new Error("JPEG dimensions must be between 1x1 and 1024x1024.");
  }
  return dimensions;
}

async function main(): Promise<void> {
  const scriptDirectory = dirname(fileURLToPath(import.meta.url));
  const sourcePath = resolve(scriptDirectory, "entry.png");
  const outputDirectory = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  const outputPath = resolve(outputDirectory, "entry.png");
  const sourceBytes = await readFile(sourcePath);
  validateImage(sourceBytes);

  await mkdir(outputDirectory, { recursive: true });
  await copyFile(sourcePath, outputPath);

  const outputBytes = await readFile(outputPath);
  const dimensions = validateImage(outputBytes);
  if (
    sourceBytes.length !== outputBytes.length ||
    !sourceBytes.equals(outputBytes)
  ) {
    throw new Error("The output differs from the source image.");
  }

  console.log(
    `Wrote ${outputPath}: ${outputBytes.length} bytes, ` +
      `JPEG ${dimensions.width}x${dimensions.height}; byte-identical copy.`,
  );
}

try {
  await main();
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
