import { createApp } from "vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// import 'element-plus/theme-chalk/dark/css-vars.css'
import "./assets/styles/index.scss";
import DataVVue3 from "@kjgl77/datav-vue3";
import App from "./App.vue";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(DataVVue3);
app.use(router);
app.use(ElementPlus);
app.mount("#app");
