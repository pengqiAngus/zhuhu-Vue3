import { ref, Ref, onMounted, onUnmounted } from "vue";

const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  const isClickOutsie = ref(false);
  const handleShow = (e: MouseEvent) => {
    if (elementRef.value) {
      if (!elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutsie.value = true;
      } else {
        isClickOutsie.value = false;
      }
    }
  };
  onMounted(() => {
    document.addEventListener("click", handleShow);
  });
  onUnmounted(() => {
    document.removeEventListener("click", handleShow);
  });
  return isClickOutsie;
};
export default useClickOutside;
