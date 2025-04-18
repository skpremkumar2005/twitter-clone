import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
    
  ],
  server: {
    host: true, // Important: allows access from external devices
    allowedHosts: ['.ngrok-free.app'], // Wildcard to allow all ngrok URLs
  },
})
