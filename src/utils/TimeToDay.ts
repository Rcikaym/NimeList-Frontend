import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";

dayjs.extend(relativeTime);
dayjs.locale("id");

const timeToDay = (date: string | Date) => {
  const now = dayjs();
  const targetDate = dayjs(date);

  const diffInDays = now.diff(targetDate, "day");
  const diffInWeeks = now.diff(targetDate, "week");
  const diffInMonths = now.diff(targetDate, "month");
  const diffInYears = now.diff(targetDate, "year");

  if (diffInYears >= 1) {
    return `${diffInYears} tahun yang lalu`;
  } else if (diffInMonths >= 1) {
    return `${diffInMonths} bulan yang lalu`;
  } else if (diffInWeeks >= 1) {
    return `${diffInWeeks} minggu yang lalu`;
  } else if (diffInDays >= 1) {
    return `${diffInDays} hari yang lalu`;
  } else {
    return dayjs(date).fromNow(); // Gunakan bawaan jika di bawah 1 hari
  }
};

export default timeToDay;
