export const formatTime = (time: number, max?: number) => {
  const includeHours = (max ?? 0) / 3600 > 1 || (time ?? 0) / 3600 > 1;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor(time / 60) % 60;
  const seconds = Math.floor(time % 60);
  return `${
    includeHours ? `${hours}:${minutes < 10 ? "0" : ""}` : ""
  }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
