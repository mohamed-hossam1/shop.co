import Image from "next/image";
import ContactUs from "./ContactUs";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white py-12">
      <div className="max-w-[1600px] px-5 m-auto">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-6">
            <ContactUs></ContactUs>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>© 2025 CURA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
