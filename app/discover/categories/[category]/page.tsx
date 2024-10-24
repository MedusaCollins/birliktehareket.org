{
  /* TODO: make a design for category page. */
}
export default function Page({ params }: { params: { category: string } }) {
  return <div>{params.category}</div>;
}
