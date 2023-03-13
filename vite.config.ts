import type { ManifestV3Export } from '@crxjs/vite-plugin';
import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, PluginOption } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import manifest from './manifest.json';
import { version } from './package.json';

const ENABLES_VISUALIZER = getEnv<boolean>('ENABLES_VISUALIZER') ?? false;
const ENABLES_SENTRY = getEnv<boolean>('ENABLES_SENTRY') ?? true;
const IS_FIREFOX = getEnv<boolean>('IS_FIREFOX') ?? true;

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
    topLevelAwait(),
  ],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  build: {
    rollupOptions: {
      input: {
        debug: 'debug.html',
      },
    },
  },
});

// utils

function getEnv<T>(name: string): T | undefined {
  const val = process.env[name];
  return val === undefined ? val : JSON.parse(val);
}
