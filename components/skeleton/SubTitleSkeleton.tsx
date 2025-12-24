export default function SubTitleSkeleton() {
  return (
    <div className='flex justify-between text-gray-600 relative mb-10'>
      <div>
        <div className='h-9 w-80 bg-gray-300 rounded animate-pulse'></div>
      </div>

      <div className='border-gray-300 w-full absolute bottom-[1px] -z-10'></div>
    </div>
  );
}