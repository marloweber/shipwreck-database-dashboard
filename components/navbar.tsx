"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
    type LinkData = {
        title: string;
        path: string;
    };

    const links: LinkData[] = [
      {
            title: "Home",
            path: "/",
        },
        {
            title: "Dashboard",
            path: "/dashboard",
        },
    ];

    let path = usePathname();

    return (

      <div className="bg-white">
        <div className="flex items-center justify-start gap-2 max-w-screen-2xl w-full mx-auto px-6 py-4">

          {links.map((link) => (
            <Link
              key={link.title}
              href={link.path}
              className={cn(
                "font-medium hover:underline transition duration-100 ease-in px-4 py-2 rounded-md",
                link.path === path
                  ? "text-blue-500 underline"
                  : "text-[#253f4b]"
              )}
            >
              {link.title}
            </Link>
          ))}
          </div>
          </div>
    )
}