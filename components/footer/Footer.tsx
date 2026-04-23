import Image from "next/image";
import Link from "next/link";
import { Twitter, Facebook, Instagram, Github } from "lucide-react";
import Newsletter from "./Newsletter";

export default function Footer() {
  const footerLinks = [
    {
      title: "COMPANY",
      links: ["About", "Features", "Works", "Career"],
    },
    {
      title: "HELP",
      links: [
        "Customer Support",
        "Delivery Details",
        "Terms & Conditions",
        "Privacy Policy",
      ],
    },
    {
      title: "FAQ",
      links: ["Account", "Manage Deliveries", "Orders", "Payments"],
    },
  ];

  return (
    <footer className="w-full relative bg-[#F0F0F0] pt-3 ">
      <Newsletter />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-8 pb-12 border-b border-black/10">
          <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8">
            <Link
              href="/"
              className="text-3xl sm:text-4xl font-integral font-black tracking-widest"
            >
              ELARIS
            </Link>
            <p className="text-black/60 font-satoshi text-sm sm:text-base leading-relaxed max-w-[250px]">
              Sophistication redefined. Experience a curated collection of premium fashion designed for the modern individual.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
              >
                <Twitter className="w-4 h-4 fill-currentColor" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
              >
                <Facebook className="w-4 h-4 fill-currentColor" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
              >
                <Github className="w-4 h-4 fill-currentColor" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title} className="flex flex-col gap-4 sm:gap-6">
                <h3 className="font-satoshi font-bold text-sm sm:text-base tracking-widest uppercase">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-3 sm:gap-4">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-black/60 font-satoshi text-sm sm:text-base hover:text-black transition-all"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
          <p className="text-black/60 font-satoshi text-sm text-center sm:text-left">
            ELARIS © 2025, All Rights Reserved
          </p>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className=" px-2 py-1  flex items-center justify-center min-w-[50px] sm:min-w-[60px] h-[30px] sm:h-[35px]">
              <Image
                src="/vodafone-cash-logo.webp"
                alt="Vodafone Cash"
                width={40}
                height={25}
                className="object-contain"
              />
            </div>
            <div className=" px-2 py-1  flex items-center justify-center min-w-[50px] sm:min-w-[60px] h-[30px] sm:h-[35px]">
              <Image
                src="/instapay-logo.webp"
                alt="Instapay"
                width={40}
                height={25}
                className="object-contain"
              />
            </div>
            <div className=" px-3 py-1  flex items-center justify-center h-[30px] sm:h-[35px]">
              <span className="font-satoshi font-bold text-[10px] sm:text-[12px] whitespace-nowrap">
                CASH ON DELIVERY
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
