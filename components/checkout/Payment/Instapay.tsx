import Image from "next/image";

export default function Instapay() {
  return (
    <div className="flex-1 flex min-w-0">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
        <Image
          src="/instapay-logo.webp"
          width={40}
          height={40}
          alt="instapay logo"
          className="object-contain"
        />
      </div>

      <div>
        <p className="font-medium text-gray-900 text-sm md:text-base">
          Instapay
        </p>

        <p className="text-xs md:text-sm text-gray-600 truncate">
          Pay instantly using Instapay
        </p>
      </div>
    </div>
  );
}
