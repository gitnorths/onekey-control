import { createApp } from "vue";
import router from "./router";
import ElementPlus from "element-plus";
import 'element-plus/theme-chalk/dark/css-vars.css'
import DataVVue3 from "@kjgl77/datav-vue3";
import App from "./App.vue";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
import "element-plus/dist/index.css";
import "./assets/styles/index.scss";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(DataVVue3);
app.use(router);
app.use(ElementPlus);
app.use(VXETable);
app.mount("#app");
