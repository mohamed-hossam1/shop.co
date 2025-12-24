"use client";

import {
  ChevronLeft,
  ChevronRight,
  Settings,
  ShoppingBag,
  User2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import UserIcon from "./UserIcon";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (!(window.innerWidth <= 768)) setIsExpanded(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { icon: <User2 className="w-6 h-6" />, label: "Profile", id: "profile" },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      label: "Orders",
      id: "profile/orders",
    },
    {
      icon: <Settings className="w-6 h-6" />,
      label: "Settings",
      id: "profile/settings",
    },
  ];

  return (
    <div
      className={`${
        isExpanded ? "w-80" : "w-20"
      } bg-white shadow-lg transition-all duration-300 relative`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-4.5 top-4 bg-white rounded-full p-1 hidden sm:block shadow-md hover:shadow-lg border"
      >
        {isExpanded ? <ChevronLeft /> : <ChevronRight />}
      </button>

      <div className="p-4">
        <div className="flex items-center justify-center mb-8">
          <UserIcon isExpanded={isExpanded} />
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === `/${item.id}`;

            return (
              <Link
                key={item.id}
                href={`/${item.id}`}
                className={`
                  flex items-center space-x-2 p-3 rounded-lg transition-all duration-200 group
                  ${isActive ? " text-white bg-gradient-to-r from-[#1F1F6F] to-[#14274E] hover:from-[#14274E] hover:to-[#394867] " : "hover:bg-primary/5"}
                `}
              >
                <div
                  className={`transition-colors duration-200 
                    ${
                      isActive
                        ? "text-white"
                        : "text-gray-600 group-hover:text-primary"
                    }
                  `}
                >
                  {item.icon}
                </div>

                {isExpanded && (
                  <span
                    className={`transition-colors duration-200
                      ${
                        isActive
                          ? "text-white"
                          : "text-gray-700 group-hover:text-primary"
                      }
                    `}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
