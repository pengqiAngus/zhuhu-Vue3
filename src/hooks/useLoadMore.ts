import { useStore } from "vuex";
import { ref, computed, ComputedRef } from "vue";

interface LoadParams {
  currentPage: number;
  pageSize: number;
}
const useLoadMore = (
  actionName: string,
  total: ComputedRef<number>,
  params?: LoadParams = { currentPage: 2, pageSize: 6 }
) => {
  const store = useStore();
  const currentPage = ref(params.currentPage);
  const requestParams = computed(() => ({
    currentPage: currentPage.value,
    pageSize: params.pageSize,
  }));
  const loadMorePgae = () => {
    store.dispatch(actionName, requestParams.value).then((res) => {
      currentPage.value++;
    });
    console.log(isLastPage.value);
  };
  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) < currentPage.value;
  });
  return {
    loadMorePgae,
    isLastPage,
    currentPage,
  };
};
export default useLoadMore;
