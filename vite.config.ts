import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  // API base URL. Empty by default => the frontend calls the API on the SAME
  // origin (relative /tiles and /api/* paths). This is the correct setup for
  // Vercel, where the Express backend runs as a serverless function of the
  // same deployment. Only set VITE_API_URL (or the legacy NEXT_PUBLIC_API_URL)
  // if the backend is deployed to a separate domain.
  let rawApiUrl = env.VITE_API_URL || env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || '';
  if (rawApiUrl.startsWith('VITE_API_URL=') || rawApiUrl.startsWith('NEXT_PUBLIC_API_URL=')) {
    rawApiUrl = rawApiUrl.replace(/^(VITE_API_URL|NEXT_PUBLIC_API_URL)=/, '');
  }
  const apiUrl = rawApiUrl.trim().replace(/\/+$/, '');
  // Never bake localhost URLs into production client bundles
  const clientApiUrl = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1') ? '' : apiUrl;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    define: {
      'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(clientApiUrl),
      'process.env.VITE_API_URL': JSON.stringify(clientApiUrl),
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
