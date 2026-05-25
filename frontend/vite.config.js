import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'src/about/index.html'),
        contact: resolve(__dirname, 'src/contact/index.html'),
        buy: resolve(__dirname, 'src/buy/index.html'),
        register: resolve(__dirname, 'src/register/index.html'),
        reservation: resolve(__dirname, 'src/reservation/index.html'),
      },
    },
  },
})
