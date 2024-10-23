"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/logo.svg";
import { Button, buttonVariants } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar(): JSX.Element {
  const [scrollY, setScrollY] = useState(false);

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

  return (
    <header
      className={`w-full flex fixed px-6 items-center justify-center transition-all ${
        scrollY ? "shadow-md backdrop-blur-sm bg-transparent bg-opacity-20" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl w-full items-center justify-between flex">
        <div>
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
        <div className="lg:space-x-8 space-x-6 hidden md:block">
          <Link href={"/about"}>About</Link>
          <Link href={"/about"}>About</Link>
          <Link href={"/about"}>About</Link>
          <Link href={"/home"}>Home</Link>
          <Link href={"/contact"}>Contact</Link>
        </div>
        <div className="space-x-6 hidden md:block">
          <Link href={"/auth/login"}>Log in</Link>
          <Link href={"/auth/signup"}>
            <Button variant="default">Sign up</Button>
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
                  <span className="font-semibold">Sign up</span>
                </Link>
              </SheetHeader>
            </SheetClose>{" "}
            <SheetClose asChild>
              <SheetHeader>
                <Link href="/auth/login" className={buttonVariants({ variant: "default" })}>
                  <span className="font-semibold">Log in</span>
                </Link>
              </SheetHeader>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
