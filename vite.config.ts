import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@private-content': path.resolve(__dirname, './private-content'),
      '@private-styling': path.resolve(__dirname, './private-styling'),
    },
  },
  optimizeDeps: {
    include: ['@private-content/**/*', '@private-styling/**/*'],
  },
});
