import Categories from "./Categories";

export default function Footer() {
  return (
    <footer className="bg-primary-hover text-white py-16">
      <div className="max-w-[1600px] px-5 m-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-6 lg:gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">CURA</h4>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Categories</h5>
            <Categories />
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>© 2025 CURA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}