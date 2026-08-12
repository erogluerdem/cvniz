import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    // Output configuration
    outDir: 'dist',
    assetsDir: 'assets',
    // Code splitting configuration
    rollupOptions: {
      output: {
        // Split vendor code
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'lucide-icons': ['lucide-react'],
          'pdf-export': ['jspdf', 'html2canvas'],
          'utils-vendor': ['axios', 'date-fns', 'lodash'],
          'charts': ['recharts'],
          'animations': ['framer-motion', 'canvas-confetti', 'react-confetti'],
          'sentry': ['@sentry/react']
        },
        // Optimize chunk names for caching
        chunkFileNames: 'js/[name].[hash:8].js',
        entryFileNames: 'js/[name].[hash:8].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|gif|svg/.test(ext)) {
            return `images/[name].[hash:8][extname]`
          } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
            return `fonts/[name].[hash:8][extname]`
          } else if (ext === 'css') {
            return `css/[name].[hash:8][extname]`
          }
          return `[name].[hash:8][extname]`
        }
      }
    },
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000
  },
  // Performance hints
  ssr: false
})

