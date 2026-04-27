import Image from "next/image";
import Link from "next/link";
import ROUTES from "@/constants/routes";

export default function Hero() {
  return (
    <section className="bg-hero-background w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-end">

          <div className="w-full md:w-1/2 flex flex-col gap-6 lg:gap-8 py-12 md:py-20 lg:py-24 z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-integral font-black tracking-[0.04em] leading-tight sm:leading-none">
              FIND CLOTHES <br /> THAT MATCHES <br /> YOUR STYLE
            </h1>
            <p className="text-black/60 font-satoshi text-sm sm:text-base max-w-[545px]">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </p>
            <Link
              href={ROUTES.PRODUCTS}
              className="bg-black text-white px-14 py-4 rounded-full font-satoshi font-medium hover:bg-black/80 transition-all text-center w-full sm:w-fit"
            >
              Shop Now
            </Link>

            <div className="flex items-center justify-center sm:justify-start gap-x-6 sm:gap-x-10 mt-4">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-4xl font-bold font-satoshi">200+</span>
                <span className="text-black/60 text-xs sm:text-sm font-satoshi whitespace-nowrap">
                  International Brands
                </span>
              </div>
              <div className="w-px h-12 bg-black/10" />
              <div className="flex flex-col">
                <span className="text-2xl sm:text-4xl font-bold font-satoshi">2,000+</span>
                <span className="text-black/60 text-xs sm:text-sm font-satoshi whitespace-nowrap">
                  High-Quality Products
                </span>
              </div>
              <div className="w-px h-12 bg-black/10" />
              <div className="flex flex-col">
                <span className="text-2xl sm:text-4xl font-bold font-satoshi">30,000+</span>
                <span className="text-black/60 text-xs sm:text-sm font-satoshi whitespace-nowrap">
                  Happy Customers
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex w-full md:w-1/2 relative justify-center md:justify-end">
            <div className="relative w-full aspect-square max-w-[660px]">
              <Image
                src="/hero_image.png"
                alt="Fashionable couple"
                fill
                className="object-contain object-bottom"
                priority
              />

              <div className="absolute top-[45%] left-[-30px] lg:left-[-40px] w-11 h-11 lg:w-14 lg:h-14 animate-spin-slow z-0">
                <Image src="/star2.png" alt="Star" fill className="object-contain" />
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 animate-spin-slow z-0">
                <Image src="/star1.png" alt="Star" fill className="object-contain" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
