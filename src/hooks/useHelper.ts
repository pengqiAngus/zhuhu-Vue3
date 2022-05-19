import { ColumnProps } from "../store";

export function generaterFitUrl(
  column: ColumnProps,
  width: number,
  height: number
) {
  if (column.avatar) {
    column.avatar.fitUrl =
      column.avatar.url + "?x-oss-process=image/resize,m_pad,h_100,w_100";
  } else {
    column.avatar = {
      fitUrl:
        "https://www.global-esports.news/wp-content/uploads/2020/10/genshin.jpg",
    };
  }
}
interface CheckCondition {
  format?: string[];
  size: number;
}
type ErrorType = "size" | "format" | null;
export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition;
  const isValidFormat = format ? format.includes(file.type) : true;
  const isValidSize = size ? file.size / 1024 / 1024 < size : true;
  let error: ErrorType = null;
  if (!isValidFormat) {
    error = "format";
  }
  if (!isValidSize) {
    error = "size";
  }
  return {
    passed: isValidFormat && isValidSize,
    error: error,
  };
}
