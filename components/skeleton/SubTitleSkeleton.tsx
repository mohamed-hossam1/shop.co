export default function SubTitleSkeleton() {
  return (
    <div className='flex justify-between items-center relative mb-10 animate-pulse'>
      <div className='h-10 w-80 bg-gray-200 border-b-2 border-black/10'></div>
      <div className='h-px w-full absolute bottom-0 bg-black/5 -z-10'></div>
    </div>
  );
}