import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@private-content': path.resolve(__dirname, 'private-content'),
      '@private-styling': path.resolve(__dirname, 'private-styling'),
    },
  },
  optimizeDeps: {
    include: ['private-content/projects/**/*.json'],
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
});
