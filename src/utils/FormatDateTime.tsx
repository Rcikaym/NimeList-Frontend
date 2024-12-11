import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

export default function renderDateTime(isoDate: string): string {
  const date = dayjs(isoDate);
  return date.format("YYYY-MM-DD HH:mm:ss");
}
