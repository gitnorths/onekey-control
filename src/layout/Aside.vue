<template>
  <div class="oc-aside">
    <dv-border-box13 :color="['#155093', '#235fa7']">
      <div class="oc-aside__box">
        <el-menu
          router
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
        >
          <template v-for="(item, i) in menuData" :key="i">
            <el-sub-menu :index="item.key" v-if="item?.children?.length">
              <template #title>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="(itemChildren, k) in item?.children"
                  :key="k"
                  :index="itemChildren.path"
                >
                  {{ itemChildren.name }}
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-menu-item v-else :index="item.path">
              <span>{{ item.name }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </dv-border-box13>
  </div>
</template>
<script setup>
import { ref, watch, reactive } from "vue";
import { useRoute } from "vue-router";

const defaultActive = ref("");
const route = useRoute();

watch(
  () => route.path,
  () => {
    if (route.path == "/") {
      defaultActive.value = "/model";
    } else {
      defaultActive.value = route.path;
    }
  },
  { immediate: true }
);

const menuData = reactive([
  {
    key: "1",
    name: "模型管理",
    path: "/model",
  },
  {
    key: "2",
    name: "顺控配置",
    children: [
      // {
      //   name: "顺控导入",
      //   path: "/deploy-import",
      // },
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
  {
    key: "3",
    name: "配置管理",
    path: "/setting",
  },
]);
</script>
