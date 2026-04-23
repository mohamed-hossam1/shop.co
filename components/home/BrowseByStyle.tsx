import Image from "next/image";
import Link from "next/link";

interface Category {
  id: number;
  title: string;
  image: string;
  slug: string;
}

export default function BrowseByStyle({ categories }: { categories: Category[] }) {
  if (!categories || categories.length === 0) return null;

  const featuredCategories = categories.slice(0, 4);
  
  const styles = [
    "col-span-12 md:col-span-4",
    "col-span-12 md:col-span-8",
    "col-span-12 md:col-span-8",
    "col-span-12 md:col-span-4",
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 mb-16">
      <div className="max-w-[1400px] mx-auto bg-[#F0F0F0] rounded-[20px] sm:rounded-[40px] p-6 sm:p-14 lg:p-16">
        <h2 className="text-3xl sm:text-5xl font-integral font-black text-center mb-8 sm:mb-14 tracking-[0.04em] uppercase">
          BROWSE BY DRESS STYLE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          {featuredCategories.map((category, index) => (
            <div
              key={category.id}
              className={`${styles[index]} relative bg-white rounded-[20px] overflow-hidden group h-[190px] sm:h-[289px]`}
            >
              <Link href={`/products?category=${category.slug}`} className="block w-full h-full p-6 sm:p-8">
                <span className="text-2xl sm:text-4xl font-bold font-satoshi relative z-10">
                  {category.title}
                </span>
                
                {category.image && (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover object-right sm:object-center transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
