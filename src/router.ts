import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import register from "./views/register.vue";
import ColumnDetail from "./components/ColumnDetail.vue";
import CreatePost from "./views/CreatePost.vue";
import postDetail from "./components/PostDetail.vue";
import store from "./store";
import axios from "axios";
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
      path: "/register",
      name: "register",
      component: register,
      meta: {},
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
    {
      path: "/postDetail/:id",
      name: "postDetail",
      component: postDetail,
      meta: {
        requireLogin: true,
      },
    },
  ],
});
router.beforeEach((to, from, next) => {
  const { user, token } = store.state;
  const { requireLogin, redirectAlreadyLogin } = to.meta;
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      store
        .dispatch("fetchCurrentUser")
        .then(() => {
          if (redirectAlreadyLogin) {
            next("/");
          } else {
            next();
          }
        })
        .catch((e) => {
          localStorage.removeItem("token");
          store.commit("logout");
          next("login");
        });
    } else {
      if (requireLogin) {
        next("login");
      } else {
        next();
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next("/");
    } else {
      next();
    }
  }
});
export default router;
