import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 모든 네트워크 인터페이스에서 접속 가능
    port: 4000, // 선호 포트
    strictPort: false, // 포트가 사용 중이면 다른 포트 자동 선택
    allowedHosts: [
      'run.club012.com',
      'localhost',
      '192.168.219.40'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // 프로덕션 빌드 설정
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})