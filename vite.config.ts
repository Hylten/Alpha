import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ändrat från /Martech/ till /Alpha/ enligt önskemål. 
  // Kom ihåg att döpa om repot på GitHub till "Alpha"!
  base: '/Alpha/',
})
