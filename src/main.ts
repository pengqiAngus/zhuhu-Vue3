import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import axios from "axios";
axios.defaults.baseURL = "http://apis.imooc.com/api";
axios.interceptors.request.use((config) => {
  store.commit("setError", { status: false, message: "" });
  store.commit("setLoading", true);
  config.params = { ...config.params, icode: "02834F26878654E8" };
  //如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append("icode", "02834F26878654E8");
  } else {
    // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: "02834F26878654E8" };
  }
  return config;
});
axios.interceptors.response.use(
  (config) => {
    store.commit("setLoading", false);
    return config;
  },
  (e) => {
    const { error } = e.response.data;
    store.commit("setError", { status: true, message: error });
    store.commit("setLoading", false);
    return Promise.reject(error);
  }
);
const app = createApp(App);
app.use(router);
app.use(store);
app.mount("#app");
