import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@shared': '/src/shared',
      '@leads': '/src/features/leads',
      '@opportunities': '/src/features/opportunities',
      '@components': '/src/shared/components',
      '@hooks': '/src/shared/hooks',
      '@utils': '/src/shared/utils',
      '@types': '/src/shared/types',
      '@data': '/src/shared/data',
      '@constants': '/src/shared/constants',
    },
  },
});
