<template>
  <div class="oc-aside">
    <dv-border-box13 :color="['#155093', '#235fa7']">
      <div class="oc-aside__box">
        <el-menu
          router
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
        >
          <el-sub-menu :index="item.key" v-for="(item, i) in menuData" :key="i">
            <template #title>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item-group v-if="item?.children?.length">
              <el-menu-item
                v-for="(itemChildren, k) in item?.children"
                :key="k"
                :index="itemChildren.path"
              >
                {{ itemChildren.name }}
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </div>
    </dv-border-box13>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";

const { path, fullPath } = useRoute();
console.log("useRoute", path, fullPath);
let paths = "";

if (fullPath === "/") {
  paths = "/model-import";
} else {
  paths = fullPath;
}
console.log("paths", fullPath, paths);

let defaultActive = ref(paths);
const menuData = reactive([
  {
    key: "1",
    name: "一次模型",
    children: [
      {
        name: "模型导入",
        path: "/model-import",
      },
      {
        name: "模型配置",
        path: "/model-configure",
      },
    ],
  },
  {
    key: "2",
    name: "顺控配置",
    children: [
      {
        name: "顺控导入",
        path: "/deploy-import",
      },
      {
        name: "设备态解析",
        path: "/device-state",
      },
      {
        name: "顺控票解析",
        path: "/sequential-control-vote",
      },
    ],
  },
]);
</script>