"use client";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Logo from "../public/logo.svg";
import Image from "next/image";
import { useState } from "react";

export default function Footer(): JSX.Element {
  const [logos] = useState([
    {
      link: "https://github.com/medusacollins/birliktehareket.org",
      logo: <GitHubLogoIcon className="w-6 h-6" />,
    },
  ]);

  const [links] = useState<{ link: string; text: string }[]>([
    //{ link: "/", text: "Terms" },
    //{ link: "/", text: "Privacy" },
    //{ link: "/", text: "Cookies" },
    //{ link: "/", text: "Legal" },
    //{ link: "/", text: "Contact" },
    //{ link: "/", text: "Status" },
    //{ link: "/", text: "Help" },
  ]);

  return (
    <div className="bg-secondary-foreground flex-col p-8 text-gray-400 flex items-center space-y-8 justify-center bottom-0 w-full">
      <div className="flex flex-row items-center justify-center sm:space-x-6 w-full lg:px-12 px-6">
        <div className="hidden sm:block border-t w-full" />
        <div className="flex space-x-6">
          {logos.map((logo, index) => (
            <Link
              key={index}
              href={logo.link}
              target="_blank"
              className="hover:scale-110 duration-500 hover:text-white"
            >
              {logo.logo}
            </Link>
          ))}
        </div>
        <div className="hidden sm:block border-t w-full" />
      </div>

      <div className="w-full flex flex-col justify-center items-center">
        <Image
          src={Logo}
          alt="logo"
          width={75}
          height={75}
          className="invert"
        />
        <h1>© 2024 Birlikte Hareket. All rights reserved</h1>
      </div>

      <div className="flex w-full justify-center md:space-x-8 space-x-3 font-bold">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.link}
            className="hover:scale-110 duration-500 hover:text-white"
          >
            {link.text}
          </Link>
        ))}
      </div>
    </div>
  );
}
