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

  const localImages: Record<string, string> = {
    'jacket': '/images/categories/jacket.png',
    'shirt': '/images/categories/shirt.png',
    'sweatshirt': '/images/categories/sweatshirt.png',
    't-shirt': '/images/categories/tshirt.png',
  };
  
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
          {featuredCategories.map((category, index) => {
            const displayImage = localImages[category.slug.toLowerCase()] || category.image;
            
            return (
              <div
                key={category.id}
                className={`${styles[index]} relative bg-white rounded-[20px] overflow-hidden group h-[200px] sm:h-[289px] transition-all hover:shadow-xl`}
              >
                <Link href={`/products?category=${category.slug}`} className="block w-full h-full p-6 sm:p-8">
                  <span className="text-2xl sm:text-4xl font-bold font-satoshi relative z-10 block transition-transform group-hover:translate-x-2">
                    {category.title}
                  </span>
                  
                  {displayImage && (
                    <div className="absolute inset-0 z-0 pointer-events-none">
                      <div className="relative w-full h-full">
                        <Image
                          src={displayImage}
                          alt={category.title}
                          fill
                          className="object-cover object-center transition-all duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={index < 2}
                        />
                      </div>
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
