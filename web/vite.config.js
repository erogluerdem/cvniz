import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
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
          'ui-vendor': ['tailwindcss'],
          'utils-vendor': ['axios', 'date-fns', 'lodash'],
          'charts': ['recharts'],
          'animations': ['framer-motion']
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
    // Compression settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      },
      format: {
        comments: false
      }
    },
    // Source map optimization
    sourcemap: process.env.NODE_ENV === 'development',
    // Build optimizations
    cssCodeSplit: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000
  },
  // Performance hints
  ssr: false
})

