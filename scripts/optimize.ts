import { Buffer } from 'node:buffer';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import sharp from 'sharp';

const root = join(cwd(), 'public', 'images');
let totalSavings = 0;

const convertImage = async (filename: string) => {
  const originalPath = join(root, 'original', filename);
  const imageFile = await readFile(originalPath);
  const origSize = Buffer.byteLength(imageFile);
  const image = await sharp(imageFile)
    .rotate()
    .resize({ height: 600 })
    .jpeg({ mozjpeg: true })
    .toBuffer();
  const newSize = Buffer.byteLength(image);
  const transformedPath = join(
    root,
    newSize < origSize
      ? filename.replace(/\.[a-z]{3,4}$/, `_600h.jpg`)
      : filename,
  );
  totalSavings += Math.max(0, origSize - newSize);
  await writeFile(transformedPath, newSize < origSize ? image : imageFile);
};

const getImages = async () => {
  console.time('🎨 Image Transformations');
  const images = (await readdir(join(root, 'original'))).filter((filename) =>
    filename.includes('.'),
  );
  console.log(`📷 ${images.length} images found`);
  await Promise.all(images.map(convertImage));
  console.log('Total Savings:', (totalSavings / 1024).toFixed(0), 'KB');
  console.timeEnd('🎨 Image Transformations');
};

getImages();
