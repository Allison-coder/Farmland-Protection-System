import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/home.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },

  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      // {
      //   path: "/dashboard",
      //   name: "dashboard",
      //   meta: {
      //     title: "系统首页",
      //     permiss: "1",
      //   },
      //   component: () =>
      //     import(/* webpackChunkName: "dashboard" */ "../views/dashboard.vue"),
      // },
      {
        path: "/people",
        name: "people",
        meta: {
          title: "用户管理",
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/people.vue"),
      },
      {
        path: "/data",
        name: "data",
        meta: {
          title: "数据管理",
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/data.vue"),
      },
      {
        path: "/map",
        name: "map",
        meta: {
          title: "地图可视化",
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/map.vue"),
      },
      //chart
      {
        path: "/chart",
        name: "chart",
        meta: {
          title: "统计分析",
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/chart.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login.vue"),
  },
  {
    path: "/403",
    name: "403",
    meta: {
      title: "没有权限",
    },
    component: () => import(/* webpackChunkName: "403" */ "../views/403.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | vue-manage-system`;
  next();
});

export default router;
