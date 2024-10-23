"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-[30rem] bg-white gap-8">
      <h1 className="text-5xl font-semibold max-w-[400px] text-center">
        Daha Aydınlık Yarınlar İçin!
      </h1>
      {/* TODO: Add an image to background */}

      <Link href={"/"}>
        {/* TODO: Change link to create walk area. */}
        <Button variant="secondary" size="lg">
          Yürüyüş Düzenle
        </Button>
      </Link>
    </div>
  );
}
