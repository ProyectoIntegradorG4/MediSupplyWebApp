/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  esbuild: {
    drop: [], // Don't drop console.log statements
  },
  server: {
    port: 5173,
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/test-utils.tsx',
        'src/main.tsx',
        'src/theme.ts',
        'src/App.tsx',
        'src/components/Layout.tsx',
        'src/components/Navbar.tsx',
        'src/pages/Providers.tsx',
        'src/pages/Sellers.tsx',
        'src/pages/Delivery.tsx',
        'src/pages/People.tsx',
        'src/types/**',
        '**/*.d.ts',
        'dist/',
        'coverage/',
        '**/*.config.ts',
        '**/*.config.js',
      ],
      include: [
        'src/**/*.ts',
        'src/**/*.tsx',
      ],
      all: true,
      thresholds: {
        lines: 90,
        functions: 74,
        branches: 85,
        statements: 90,
      },
    },
  },
})
