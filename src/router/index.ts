// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "Take Data",
        meta: {
          bottomNav: true,
        },
        component: () => import("@/views/TakeData.vue"),
      },
      {
        path: "view-data",
        name: "View Data",
        meta: {
          bottomNav: true,
        },
        component: () => import("@/views/ViewData.vue"),
      },
    ],
  },
  // {
  //   path: "/login",
  //   name: "Login",
  //   component: () => import("@/views/Login.vue"),
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// router.beforeEach((to) => {
//   if (to.name !== "Login" && !localStorage.getItem("user")) {
//     return { name: "Login" };
//   }
// });

export default router;
