import axios from "axios";
import { createStore, Commit } from "vuex";
export interface ResponseType<P = {}> {
  code: number;
  msg: string;
  data: P;
}
export interface UserProps {
  isLogin: boolean;
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
  _id?: number;
  title: string;
  content?: string;
  excerpt?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string;
}
export interface GlobalErrorProps {
  status: Boolean;
  message?: String;
}
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: String;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
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
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem("token") || "",
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false },
  },
  mutations: {
    setLoading(state, status) {
      state.loading = status;
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e;
    },
    createPost(state, newPost) {
      state.posts.push(newPost);
    },
    fetchColumns(state, data) {
      state.columns = data.data.list;
    },
    fetchColumn(state, data) {
      state.columns = [data.data];
    },
    fetchPosts(state, data) {
      state.posts = data.data.list;
    },
    fetchPost(state, data) {},
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
    fetchColumns({ commit }) {
      return getAndCommit("/columns", "fetchColumns", commit);
    },
    fetchColumn({ commit }, id) {
      return getAndCommit(`/columns/${id}`, "fetchColumn", commit);
    },
    fetchPosts({ commit }, id) {
      return getAndCommit(`/columns/${id}/posts`, "fetchPosts", commit);
    },
    fetchCurrentUser({ commit }) {
      return getAndCommit("/user/current", "fetchCurrentUser", commit);
    },
    createPost({ commit }, playload) {
      return postAndCommit("/posts", "createPost", commit, playload);
    },
    fetchPost({ commit }, id) {
      return getAndCommit(`/posts/${id}`, "fetchPost", commit);
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
    getColumnById: (state) => (id: number) => {
      return state.columns.find((c) => c._id === id);
    },
    getPostsById: (state) => (id: number) => {
      const posts = state.posts.filter((p) => p.column === id);
      return posts;
    },
    getPostById: (state) => (id: number) => {
      const post = state.posts.find((p) => (p._id = id));
      return post;
    },
  },
});

export default store;
