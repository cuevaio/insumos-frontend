import os from 'os';
import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  const { 
    VITE_GSMS_PATH,
    VITE_API_DOMAIN,
		VITE_EXTERNAL_API_DOMAIN,
  } = loadEnv(mode, process.cwd());

  const isExternalOS = () => {
		return os.platform() === 'darwin';
	}

  const getApiDomain = () => {
		// if (command === 'serve') return '';
		if (isExternalOS()) return VITE_EXTERNAL_API_DOMAIN;
		return VITE_API_DOMAIN;
	}

  const getBasePathname = (command?: 'build' | 'serve') => {
    return command === 'build' ? VITE_GSMS_PATH : '/';
  }

  return {
    plugins: [react()],
    define: {
			__API_DOMAIN__: JSON.stringify(getApiDomain()),
			__BASE__PATHNAME__: JSON.stringify(getBasePathname(command)),
		},
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // port: 3000,
      proxy: {
        '/api': {
          target: getApiDomain(),
					changeOrigin: true,
        }
      }
    },
    base: getBasePathname(command),
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      globals: true,
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
