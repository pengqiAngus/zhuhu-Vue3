import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import ColumnDetail from "./components/ColumnDetail.vue";
import CreatePost from "./views/CreatePost.vue";
import store from "./store";

const routerHistory = createWebHistory();
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        redirectAlreadyLogin: true,
      },
    },
    {
      path: "/columnDetail/:id",
      name: "columnDetail",
      component: ColumnDetail,
    },
    {
      path: "/createPost",
      name: "CreatePost",
      component: CreatePost,
      meta: {
        requireLogin: true,
      },
    },
  ],
});
router.beforeEach((to, from, next) => {
  if (to.meta.requireLogin && !store.state.user.isLogin) {
    next({ name: "login" });
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    next({ name: "home" });
  } else {
    next();
  }
});
export default router;
