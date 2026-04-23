import Products from "@/components/home/Products";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="mt-4 mb-12">
        <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-10 px-4 md:px-0 max-w-[1400px] mx-auto">
          <div className="block md:hidden w-full">
            <Image
              src="/image1.webp"
              alt="Revitalizing Growth Shampoo"
              width={500}
              height={700}
              loading="eager"
              className="rounded-2xl w-full h-auto"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>

          <div className="hidden md:block">
            <Image
              src="/image1.webp"
              alt="Revitalizing Growth Shampoo"
              width={1050}
              height={700}
              loading="eager"
              className="rounded-2xl"
            />
          </div>

          <div className="hidden md:flex flex-col gap-3">
            <Link href={"/products/108"}>
              <Image
                src="/image2.webp"
                alt="Root Fortifying Conditioner"
                width={340}
                height={350}
                loading="eager"
                className="rounded-2xl"
              />
            </Link>
            <Link href={"/products/107"}>
              <Image
                src="/image3.webp"
                alt="Charcoal solid cleanser"
                width={340}
                height={350}
                loading="eager"
                className="rounded-2xl"
              />
            </Link>
          </div>
        </div>
      </div>

      <Products />
    </div>
  );
}
