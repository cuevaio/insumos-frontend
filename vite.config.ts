import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  const { VITE_GSMS_PATH } = loadEnv(mode, process.cwd());

  const getBasePathname = (command?: 'build' | 'serve') => {
    return command === 'build' ? VITE_GSMS_PATH : '/';
  };

  console.log('base: ', getBasePathname(command));

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    base: getBasePathname(command),
  };
});
