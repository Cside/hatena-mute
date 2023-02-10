import type { ManifestV3Export } from '@crxjs/vite-plugin';
import { crx } from '@crxjs/vite-plugin';
import preact from '@preact/preset-vite';
import postcssNested from 'postcss-nested';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, PluginOption } from 'vite';
import manifest from './manifest.json';
import { version } from './package.json';

const ENABLES_VISUALIZER = getEnv<boolean>('ENABLES_VISUALIZER') ?? false;

manifest.version = version;

export default defineConfig({
  plugins: [
    preact(),
    crx({ manifest: manifest as ManifestV3Export }),
    ...(ENABLES_VISUALIZER ? [visualizer() as PluginOption] : []),
  ],
  css: {
    postcss: {
      plugins: [postcssNested],
    },
  },
});

// utils

function getEnv<T>(name: string): T | undefined {
  const val = process.env[name];
  return val === undefined ? val : JSON.parse(val);
}
