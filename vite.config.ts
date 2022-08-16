import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import WindiCSS from 'vite-plugin-windicss'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    Components({
      resolvers: [AntDesignVueResolver(), ElementPlusResolver()],
    }),
    WindiCSS(),
    vue(),
    VitePWA({
      base: '/',
      includeAssets: ['/assets/favicon.ico', '/assets/apple-touch-icon.png'],
      manifest: {
        name: 'TemplateBaseCore5v3',
        short_name: 'TemplateBaseCore5v3',
        description: '通用后台管理系统',
        theme_color: '#515a6e',
        start_url: '/index.html',
        background_color: '#f0f2f5',
        lang: 'zh-cmn-Hans-CN',
        icons: [
          {
            src: '/assets/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
          },
          {
            src: '/assets/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: '/assets/android-chrome-48x48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: '/assets/favicon.png',
            sizes: '70x70',
            type: 'image/png',
          },
          {
            src: '/assets/mstile-150x150.png',
            sizes: '150x150',
            type: 'image/png',
          },
        ],
      },
    }),
    legacy(),
  ],
})
