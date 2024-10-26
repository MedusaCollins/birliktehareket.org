"use client";

import DynamicPage from "@/app/discover/[...params]/page"; // Ortak dinamik sayfa

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  return <DynamicPage params={{ category: params.category }} />;
}
