"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/logo.svg";
import { Button, buttonVariants } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { Input } from "./ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export default function Navbar(): JSX.Element {
  const [scrollY, setScrollY] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrollY(true);
      } else {
        setScrollY(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.key === "Enter") {
      // Router Push Here
    }
  };

  // TODO: When it come backs to main page searchTerm should be empty
  // TODO: With Searchbar user should be able to go to pages like about and contact

  return (
    <header
      className={`w-full flex fixed px-6 items-center justify-center transition-all z-50
      ${scrollY ? "shadow-md backdrop-blur-sm bg-white" : "bg-gray-100"}`}
    >
      <nav className="mx-auto max-w-7xl w-full items-center justify-between flex">
        <div className="w-1/6">
          <div className="w-fit">
            <Link href={"/"}>
              <Image
                src={Logo}
                alt="logo"
                className="hover:scale-110 duration-500 dark:invert"
                height={66}
                width={66}
              />
            </Link>
          </div>
        </div>
        <div className="md:flex w-1/3 items-center hidden">
          <Input
            className="w-full"
            placeholder="Search..."
            onChange={handleSearch}
            onKeyDown={handleSearch}
          />
          <Link href={`/discover/search/${searchTerm}`}>
            <Button variant="ghost" className="hover:bg-transparent px-2">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        <div className="space-x-6 hidden md:block">
          <Link href={"/auth/login"}>Yürüyüş Düzenle</Link>
          <Link href={"/auth/signup"}>
            <Button variant="default">Sign in</Button>
          </Link>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"ghost"} className="md:hidden flex">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col" side={"right"}>
            <SheetHeader>
              <Image src={Logo} alt="logo" height={60} width={60} />
            </SheetHeader>
            <SheetHeader>
              <div className="flex items-center">
                {/* <Image src={Logo} alt="logo" height={50} width={50} /> Maybe */}
                <Input className="w-full" placeholder="Search..." onChange={handleSearch} />
                <SheetClose asChild>
                  <Link href={`/discover/search/${searchTerm}`} className="absolute right-6">
                    {/* might need some adjustment */}
                    <Button variant="ghost" className="hover:bg-transparent px-2">
                      <MagnifyingGlassIcon className="w-5 h-5" />
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            </SheetHeader>
            <SheetClose asChild>
              <Link href="/" className={buttonVariants({ variant: "ghost" })}>
                Home
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/about" className={buttonVariants({ variant: "ghost" })}>
                About
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/contact" className={buttonVariants({ variant: "ghost" })}>
                Contact
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <SheetHeader>
                <Link href="/auth/signup" className={buttonVariants({ variant: "secondary" })}>
                  <span className="font-semibold">Yürüyüş Düzenle</span>
                </Link>
              </SheetHeader>
            </SheetClose>{" "}
            <SheetClose asChild>
              <SheetHeader>
                <Link href="/auth/login" className={buttonVariants({ variant: "default" })}>
                  <span className="font-semibold">Sign in</span>
                </Link>
              </SheetHeader>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
