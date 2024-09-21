import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
// Formkit
import { plugin } from '@formkit/vue'
import defaultConfig from '../formkit.config';

const app = createApp(App)

app.use(plugin, defaultConfig)
app.use(createPinia())

app.mount('#app')
