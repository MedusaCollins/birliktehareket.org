export default function formatPeople(peopleNumber: number) {
  return peopleNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
