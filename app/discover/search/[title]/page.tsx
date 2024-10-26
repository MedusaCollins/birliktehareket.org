"use client";

import DynamicPage from "@/app/discover/[...params]/page"; // Ortak dinamik sayfa

export default function TitlePage({ params }: { params: { title: string } }) {
  return <DynamicPage params={{ title: params.title }} />;
}
