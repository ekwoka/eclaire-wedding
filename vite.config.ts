import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import sharp from 'sharp';

export default defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(), virtualImagesJSON()],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
    test: {
    globals: true,
    includeSource: ['*.{spec,test}.{ts,tsx}'],
    reporters: ['dot'],
    deps: {},
  },
  };
});


/* eslint-disable no-restricted-syntax */
import path from 'path';
import * as vite from 'vite';

import { readFile, readdir } from 'fs/promises';

const virtualImagesJSON = (): vite.Plugin => {
  const virtualModuleId = 'virtual:images';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'all-images', // required, will show up in warnings and errors
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const basePath = path.join(process.cwd(), 'public', 'images')
        const files = await readdir(
          basePath
        );
        const promises = files.map<Promise<string>>(async (file) => {
          const { name, ext,  } = path.parse(file);
          if (!ext) return '';
          const image = await readFile(path.join(basePath, file));
          if (image.byteLength < 500) return '';
          const metadata = await sharp(image).metadata();
          metadata.src = `/images/${name}${ext}`;
          return `${JSON.stringify(metadata)}`;
        }).filter(Boolean);

        return `const images = [${(await Promise.all(shuffleArray(promises))).join(',')}]; export default images`;
      }
    },
  };
};

const shuffleArray = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = (Math.random() * (i + 1))|0;
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

declare module 'sharp' {
  interface Metadata {
    src: string;
  }
}
