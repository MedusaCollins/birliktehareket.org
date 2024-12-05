"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.includes("search")) {
      setSearchTerm("");
    }
  }, [pathname]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      router.push(`/discover/search/${searchTerm}`);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col justify-center items-center w-full h-[30rem] bg-teal-600 gap-8">
        <h1 className="text-4xl font-semibold max-w-[700px] text-center text-white leading-normal">
          Önemsediğin konular hakkında yapılan yürüyüşleri keşfet
        </h1>
        {/* TODO: Add an image to background */}
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center sm:w-[30rem] w-[80%]">
        <Input
          className="w-full p-8 bg-white"
          placeholder="Search..."
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={searchTerm}
        />
        <Link
          href={`/discover/search/${searchTerm}`}
          className={`${searchTerm ? "text-black" : "text-gray-400 pointer-events-none"
            } absolute right-0 m-8 duration-500`}
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
