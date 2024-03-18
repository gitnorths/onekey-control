import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/model-import",
  },
  {
    name: "Model",
    path: "/model",
    component: () => import("@/view/model/index.vue"),
    meta: {
      title: "模型管理",
    },
  },
  // {
  //   name: "ModelImport",
  //   path: "/model-import",
  //   component: () => import("@/view/model/Import.vue"),
  //   meta: {
  //     title: "模型导入",
  //   },
  // },
  // {
  //   name: "ModelConfigure",
  //   path: "/model-configure",
  //   component: () => import("@/view/model/configure.vue"),
  //   meta: {
  //     title: "模型配置",
  //   },
  // },
  {
    name: "DeployImport",
    path: "/deploy-import",
    component: () => import("@/view/deploy/Import.vue"),
    meta: {
      title: "顺控导入",
    },
  },
  {
    name: "DeviceState",
    path: "/device-state",
    component: () => import("@/view/deploy/DeviceState.vue"),
    meta: {
      title: "设备态解析",
    },
  },
  {
    name: "SequentialControlVote",
    path: "/sequential-control-vote",
    component: () => import("@/view/deploy/SequentialControlVote.vue"),
    meta: {
      title: "顺控票解析",
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
