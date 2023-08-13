import type { ManifestV3Export } from '@crxjs/vite-plugin';

import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import postcssNested from 'postcss-nested';
import { visualizer } from 'rollup-plugin-visualizer';
import { PluginOption } from 'vite';
import { defineConfig } from 'vitest/config';
import manifest from './manifest.json';
import { version } from './package.json';

const ENABLES_VISUALIZER = getEnv<boolean>('ENABLES_VISUALIZER') ?? false;
const ENABLES_SENTRY = getEnv<boolean>('ENABLES_SENTRY') ?? true;
const IS_FIREFOX = getEnv<boolean>('IS_FIREFOX') ?? false;

manifest.version = version;

export default defineConfig({
  define: {
    ENABLES_SENTRY,
    IS_FIREFOX,
  },
  plugins: [
    react(),
    crx({ manifest: manifest as ManifestV3Export }),
    ...(ENABLES_VISUALIZER ? [visualizer() as PluginOption] : []),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer, postcssNested],
    },
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  build: {
    minify: false,
    rollupOptions: {
      input: {
        'muted-entries.html': 'muted-entries.html',
      },
    },
    target: browserslistToEsbuild(),
  },
  test: {
    globals: true,
    setupFiles: ['./test/setup.ts'],
  },
});

// utils

function getEnv<T>(name: string): T | undefined {
  const val = process.env[name];
  return val === undefined ? val : JSON.parse(val);
}
