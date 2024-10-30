export default function calculateDaysLeft(targetDate: Date): number {
  const today = new Date();
  const target = new Date(targetDate);

  const differenceInMs = target.getTime() - today.getTime();

  const daysLeft = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

  return daysLeft > 0 ? daysLeft : 0;
}
