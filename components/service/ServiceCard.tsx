import Image from 'next/image';
import Link from 'next/link';

function ServiceCard({service}) {
    
    
  return (
    <Link 
    href={`/dashboard/services/${service?.slug}`}
    
    className="rounded-lg border border-gray-200 bg-white p-3 overflow-hidden hover:shadow-[3px_3px_10px_3px_rgba(0,_0,_0,_0.08)] transition-all"
  >
    {/* Image */}
    <div className="w-full h-[146px] rounded-md overflow-hidden relative">
      <Image
        src={service.image}
        alt={service.title}
       width={400}
       height={146}
        className=' hover:scale-110 transition-all duration-300 w-full h-full  object-cover'
      />
    </div>

    {/* Content */}
    <div className="pt-2 space-y-2">
      <h3 className="text-base lg:text-lg font-semibold text-primaryColor">
        {service.title}
      </h3>
      <p className="text-sm text-pragaraphColor leading-snug">
        {service.description}
      </p>

      {/* Info Row */}
      <div className=" text-sm text-gray-500 gap-4 space-y-2">
        <div className="flex items-center gap-1">
        <Image src="/icon/location.svg" alt='location' width={17} height={17}/>
          {service.city}
        </div>
        <div className="flex items-center gap-1">
        <Image src="/icon/time.svg" alt='location' width={17} height={17}/>
          {service.duration}
        </div>
       
      </div>
    </div>
  </Link>
  )
}

export default ServiceCard
