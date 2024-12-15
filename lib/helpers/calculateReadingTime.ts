export default function calculateReadingTime(text: string): number {
  return Math.ceil(text.length / 200);
}
