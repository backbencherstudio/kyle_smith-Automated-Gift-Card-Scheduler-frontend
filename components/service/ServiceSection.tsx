import { serviceList } from "@/demoData/serviceList";
import ServiceCard from "./ServiceCard";
import ServiceHeader from "./ServiceHeader";

function ServiceSection() {
  return (
    <div className="">

   <ServiceHeader/>

    {/* Grid */}
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
      {serviceList.map((service) => (
       <ServiceCard key={service?.id} service={service}/>
      ))}
    </div>
  </div>
  )
}

export default ServiceSection
