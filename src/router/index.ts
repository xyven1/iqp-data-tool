// Composables
import { mdiClipboard, mdiViewList } from "@mdi/js";
import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import "vue-router";
import { getCurrentUser } from "vuefire";

// To ensure it is treated as a module, add at least one `export` statement
export {};

declare module "vue-router" {
  interface RouteMeta {
    nav: boolean;
    auth: boolean;
    icon: string;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "Take Data",
        meta: {
          nav: true,
          auth: false,
          icon: mdiClipboard,
        },
        component: () => import("@/views/TakeData.vue"),
      },
      {
        path: "view-data",
        name: "View Data",
        meta: {
          nav: true,
          auth: true,
          icon: mdiViewList,
        },
        component: () => import("@/views/ViewData.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach(async (to) => {
  if (to.meta.auth) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return false;
  }
});

export default router;
