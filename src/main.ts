import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueGtag from "vue-gtag";

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(VueGtag, {
  config: { id: "G-JV19FZ8F7V" }
}).mount("#app");