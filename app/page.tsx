"use client";

import Hero from "@/components/sections/landing/hero";
import Overview from "@/components/sections/landing/overview";

export default function Home() {
  return (
    <div className="flex flex-col gap-2 w-full min-h-screen bg-black">
      <Hero />
      <Overview />
    </div>
  );
}
