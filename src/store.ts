import axios, { AxiosRequestConfig } from "axios";
import { createStore, Commit } from "vuex";
import { arrToObj, objToArr } from "./hooks/useHelper";
interface ListProps<P> {
  [id: string]: P;
}
export interface ResponseType<P = {}> {
  code: number;
  msg: string;
  data: P;
}
export interface UserProps {
  isLogin?: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
}
export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface PostProps {
  _id?: string;
  title: string;
  content?: string;
  excerpt?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: UserProps;
}
interface GlobalColumnProps {
  data: ListProps<ColumnProps>;
  currentPage: number;
  total: number;
}
interface GolbalPostProps {
  data: ListProps<PostProps>;
  loadedColumns: string[];
  loadedDetails: string[];
}
export interface GlobalErrorProps {
  status: Boolean;
  message?: String;
}
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: String;
  loading: boolean;
  columns: GlobalColumnProps;
  posts: GolbalPostProps;
  user: UserProps;
}

const getAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit
) => {
  const { data } = await axios.get(url);
  commit(mutationName, data);
  return data;
};
const postAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  playload: any
) => {
  const { data } = await axios.post(url, playload);
  commit(mutationName, data);
  return data;
};
const asyncAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  config: AxiosRequestConfig = { method: "get" },
  extraData?: any
) => {
  const { data } = await axios(url, config);
  if (extraData) {
    commit(mutationName, { data, extraData });
  } else {
    commit(mutationName, data);
  }
  return data;
};
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem("token") || "",
    loading: false,
    columns: { data: {}, currentPage: 0, total: 0 },
    posts: { data: {}, loadedColumns: [], loadedDetails: [] },
    user: { isLogin: false },
  },
  mutations: {
    setLoading(state, status) {
      state.loading = status;
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e;
    },
    createPost(state, { newPost }) {
      state.posts.data[newPost._id] = newPost;
    },
    fetchColumns(state, rawdata) {
      const { data } = state.columns;
      const { list, count, currentPage } = rawdata.data;
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1,
      };
    },
    fetchColumn(state, data) {
      state.columns.data[data.data._id] = data.data;
    },
    fetchPosts(state, { data, extraData: columnId }) {
      state.posts.data = { ...state.posts.data, ...arrToObj(data.data.list) };
      state.posts.loadedColumns.push(columnId);
    },
    fetchPost(state, data) {
      state.posts.data[data.data._id] = data.data;
    },
    deletePost(state, { data }) {
      delete state.posts.data[data._id];
    },
    updataPost(state, { data }) {
      state.posts.data[data._id] = data;
    },
    fetchCurrentUser(state, data) {
      state.user = { isLogin: true, ...data.data };
    },
    register(state, data) {
      console.log("state", state);
    },
    logIn(state, data) {
      const { token } = data.data;
      state.token = token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },
    logout(state) {
      state.token = "";
      localStorage.removeItem("token");
      delete axios.defaults.headers.common.Authorization;
    },
  },
  actions: {
    fetchColumns({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params;
      if (state.columns.currentPage < currentPage) {
        return getAndCommit(
          `/columns?currentPage=${currentPage}&pageSize=${pageSize}`,
          "fetchColumns",
          commit
        );
      }
    },
    fetchColumn({ state, commit }, id) {
      if (!state.columns.data[id]) {
        return getAndCommit(`/columns/${id}`, "fetchColumn", commit);
      }
    },
    fetchPosts({ state, commit }, id) {
      if (!state.posts.loadedColumns.includes(id)) {
        return asyncAndCommit(
          `/columns/${id}/posts`,
          "fetchPosts",
          commit,
          {
            method: "get",
          },
          id
        );
      }
    },
    fetchCurrentUser({ commit }) {
      return getAndCommit("/user/current", "fetchCurrentUser", commit);
    },
    createPost({ commit }, playload) {
      return postAndCommit("/posts", "createPost", commit, playload);
    },
    deletePost({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, "deletePost", commit, {
        method: "delete",
      });
    },
    fetchPost({ state, commit }, id) {
      const currentPost = state.posts.data[id];
      if (!currentPost || !currentPost.content) {
        return getAndCommit(`/posts/${id}`, "fetchPost", commit);
      } else {
        return Promise.resolve({ data: currentPost });
      }
    },
    updatePost({ commit }, { id, playload }) {
      return asyncAndCommit(`/posts/${id}`, "updataPost", commit, {
        method: "patch",
        data: playload,
      });
    },
    register({ commit }, playload) {
      return postAndCommit(`users`, "register", commit, playload);
    },
    logIn({ commit }, playload) {
      return postAndCommit(`user/login`, "logIn", commit, playload);
    },
    loginAndFecth({ dispatch }, loginData) {
      return dispatch("logIn", loginData).then(() => {
        return dispatch("fetchCurrentUser");
      });
    },
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data);
    },
    getColumnById: (state) => (id: number) => {
      return state.columns.data[id];
    },
    getPostsById: (state) => (id: number) => {
      const posts = objToArr(state.posts.data).filter((p) => p.column === id);
      return posts;
    },
    getPostById: (state) => (id: number) => {
      const post = state.posts.data[id];
      return post;
    },
  },
});

export default store;
