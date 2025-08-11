import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
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
    
    // Development server configuration
    server: {
      fs: {
        // Allow serving files from parent directories (for submodules)
        allow: ['..', '.'],
      },
    },
    
    // Environment variable configuration
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    
    // Build configuration
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            utils: ['framer-motion'],
          },
        },
      },
    },
  };
});
