export const getCurrentISOWeek = (): string => {
  const now = new Date();
  const day = now.getDay() || 7;
  const thursday = new Date(now);
  thursday.setDate(now.getDate() + 4 - day);
  const year = thursday.getFullYear();
  const jan1 = new Date(year, 0, 1);
  const week = Math.ceil(
    ((thursday.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7,
  );
  return `${year}-W${String(week).padStart(2, '0')}`;
};
