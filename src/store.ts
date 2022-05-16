import axios from "axios";
import { createStore, Commit } from "vuex";
interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId?: number;
}
interface ImageProps {
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
  _id: number;
  title: string;
  content?: string;
  excerpt?: string;
  image?: ImageProps;
  createdAt: string;
  column: string;
}
export interface GlobalDataProps {
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
};
const store = createStore<GlobalDataProps>({
  state: {
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false },
  },
  mutations: {
    setLoading(state, status) {
      state.loading = status;
    },
    login(state) {
      state.user = {
        ...state.user,
        isLogin: true,
        name: "kepengqi",
        columnId: 1,
      };
    },
    creatPost(state, newPost) {
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
      console.log(state.posts);
    },
  },
  actions: {
    fetchColumns({ commit }) {
      getAndCommit("/columns", "fetchColumns", commit);
    },
    fetchColumn({ commit }, id) {
      getAndCommit(`/columns/${id}`, "fetchColumn", commit);
    },
    fetchPosts({ commit }, id) {
      getAndCommit(`/columns/${id}/posts`, "fetchPosts", commit);
    },
  },
  getters: {
    getColumnById: (state) => (id: number) => {
      return state.columns.find((c) => c._id === id);
    },
    getPostById: (state) => (id: number) => {
      const posts = state.posts.filter((p) => p.column === id);
      return posts;
    },
  },
});

export default store;
