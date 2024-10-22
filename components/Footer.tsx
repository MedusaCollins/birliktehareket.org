"use client";

import {
  LinkedInLogoIcon,
  TwitterLogoIcon,
  GitHubLogoIcon,
  InstagramLogoIcon,
  DiscordLogoIcon,
  NotionLogoIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import Logo from "../public/logo.svg";
import Image from "next/image";

export default function Footer(): JSX.Element {
  return (
    <div className="bg-secondary-foreground flex-col p-8 text-gray-400 flex items-center space-y-8 justify-center">
      <div className="flex flex-row items-center justify-center sm:space-x-6 w-full lg:px-12 px-6">
        <div className="hidden sm:block border-t w-full"></div>
        <div className="flex space-x-6">
          <Link href="/" className="hover:scale-110 duration-500 hover:text-accent">
            <InstagramLogoIcon className="w-6 h-6" />
          </Link>
          <Link href="/" className="hover:scale-110 duration-500 hover:text-accent">
            <TwitterLogoIcon className="w-6 h-6" />
          </Link>
          <Link href="/" className="hover:scale-110 duration-500 hover:text-accent">
            <DiscordLogoIcon className="w-6 h-6" />
          </Link>
          <Link href="/" className="hover:scale-110 duration-500 hover:text-accent">
            <NotionLogoIcon className="w-6 h-6" />
          </Link>
          <Link href="/" className="hover:scale-110 duration-500 hover:text-accent">
            <GitHubLogoIcon className="w-6 h-6" />
          </Link>
          <Link href="/" className="hover:scale-110 duration-500 hover:text-accent">
            <LinkedInLogoIcon className="w-6 h-6" />
          </Link>
        </div>
        <div className="hidden sm:block border-t w-full"></div>
      </div>
      <div className="w-full flex flex-col justify-center items-center">
        <Image src={Logo} alt="logo" width={75} height={75} className="invert" />
        <h1>© 2024 Birlikte Hareket. All rights reserved</h1>
      </div>
      <div className="flex w-full justify-center md:space-x-8 space-x-3 font-bold">
        <Link href="/" className="hover:scale-110 duration-500 hover:text-white">
          Terms
        </Link>
        <Link href="/" className="hover:scale-110 duration-500 hover:text-white">
          Privacy
        </Link>
        <Link href="/" className="hover:scale-110 duration-500 hover:text-white">
          Cookies
        </Link>
        <Link href="/" className="hover:scale-110 duration-500 hover:text-white">
          Legal
        </Link>
        <Link href="/" className="hover:scale-110 duration-500 hover:text-white">
          Contact
        </Link>
        <Link href="/" className="hover:scale-110 duration-500 hover:text-white">
          Status
        </Link>
        <Link href="/" className="hover:scale-110 duration-500 hover:text-white">
          Help
        </Link>
      </div>
    </div>
  );
}
