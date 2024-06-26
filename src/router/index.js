import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/model/index",
  },
  {
    name: "Model",
    path: "/model",
    component: () => import("@/view/model/index.vue"),
    meta: {
      title: "模型管理",
    },
  },
  {
    name: "ModelIndex",
    path: "/model/index",
    component: () => import("@/view/model/index.vue"),
    meta: {
      title: "模型导入",
    },
  },
  {
    name: "ModelList",
    path: "/model/list",
    component: () => import("@/view/model/list.vue"),
    meta: {
      title: "模型列表",
    },
  },
  {
    name: "DeviceIndex",
    path: "/device/index",
    component: () => import("@/view/device/index.vue"),
    meta: {
      title: "设备态导入",
    },
  },
  {
    name: "DeviceList",
    path: "/device/list",
    component: () => import("@/view/device/list.vue"),
    meta: {
      title: "设备态列表",
    },
  },
  {
    name: "ControlIndex",
    path: "/control/index",
    component: () => import("@/view/control/index.vue"),
    meta: {
      title: "顺控票导入",
    },
  },
  {
    name: "ControlList",
    path: "/control/list",
    component: () => import("@/view/control/list.vue"),
    meta: {
      title: "顺控票列表",
    },
  },
  {
    name: "Setting",
    path: "/setting",
    component: () => import("@/view/setting/index.vue"),
    meta: {
      title: "配置管理",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

//路由跳转前做判断
// router.beforeEach((to, from, next) => {
//   console.log(to.path, from, next);
//   let hasLogin = true; //从cookies中获取是否已登陆过的信息
//   if (hasLogin) {
//     next();
//   } else {
//     if (to.path == "/login") {
//       next();
//     } else {
//       next({
//         replace: true,
//         name: "login",
//       });
//     }
//   }
// });

export default router;
