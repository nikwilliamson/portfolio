import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueGtag from "vue-gtag";

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(VueGtag, {
  config: { id: "GA_MEASUREMENT_ID" }
}).mount("#app");