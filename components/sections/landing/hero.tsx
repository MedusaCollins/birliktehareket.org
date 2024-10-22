"use client";

import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-[30rem] bg-blue-500 gap-8">
      <h1 className="text-5xl font-medium max-w-[300px] text-center">
        Daha Aydınlık Yarınlar İçin!
      </h1>
      {/* TODO: Add an image to background */}

      <Button variant="secondary" size="lg">
        Yürüyüş Düzenle
      </Button>
    </div>
  );
}
