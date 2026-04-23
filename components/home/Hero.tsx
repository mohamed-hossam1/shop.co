import Image from "next/image";
import Link from "next/link";
import ROUTES from "@/constants/routes";

export default function Hero() {
  return (
    <section className="bg-hero-background w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center lg:items-end">
          <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:gap-8 py-10 lg:py-24 z-10">
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

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8 mt-4">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-4xl font-bold font-satoshi">
                  200+
                </span>
                <span className="text-black/60 text-xs sm:text-sm font-satoshi whitespace-nowrap">
                  International Brands
                </span>
              </div>
              <div className="w-px h-12 bg-black/10 hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-4xl font-bold font-satoshi">
                  2,000+
                </span>
                <span className="text-black/60 text-xs sm:text-sm font-satoshi whitespace-nowrap">
                  High-Quality Products
                </span>
              </div>
              <div className="w-px h-12 bg-black/10 hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-4xl font-bold font-satoshi">
                  30,000+
                </span>
                <span className="text-black/60 text-xs sm:text-sm font-satoshi whitespace-nowrap">
                  Happy Customers
                </span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end">
            <div className="relative w-11/12 aspect-4/5 lg:aspect-square max-w-[660px]">
              <Image
                src="/hero_image.png"
                alt="Fashionable couple"
                fill
                className="object-contain object-bottom"
                priority
              />
            </div>

            <div className="absolute top-[35%] left-[-50px] sm:left-[100px] w-11 h-11 lg:w-14 lg:h-14 animate-spin-slow">
              <Image
                src="/star2.png"
                alt="Star"
                fill
                className="object-contain"
              />
            </div>
            <div className="absolute top-[10%] right-2 sm:right-6 w-20 h-20 lg:w-24 lg:h-24 animate-spin-slow">
              <Image
                src="/star1.png"
                alt="Star"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
