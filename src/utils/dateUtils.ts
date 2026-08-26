export const getDurationDays = (reportedAt: string): number => {
  const reportDate = new Date(reportedAt);
  if (isNaN(reportDate.getTime())) return 0;
  const now = new Date();
  const diffMs = now.getTime() - reportDate.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
};
