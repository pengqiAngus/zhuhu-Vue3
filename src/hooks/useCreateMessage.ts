import { h, render } from "vue";
import Message from "../components/Message.vue";
export type messageType = "success" | "error" | "default";

const useCreateMessage = (
  message: string,
  type: messageType,
  timeout?: number
) => {
  const messageVnode = h(Message, {
    message,
    type,
  });
  const moundNode = document.createElement("div");
  document.body.appendChild(moundNode);
  render(messageVnode, moundNode);
  const destory = () => {
    render(null, moundNode);
    document.body.removeChild(moundNode);
  };
  if (timeout) {
    setTimeout(() => {
      destory();
    }, timeout);
  }
  return { destory };
};
export default useCreateMessage;
