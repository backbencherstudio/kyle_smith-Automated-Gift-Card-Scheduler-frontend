
import Image from "next/image";

export default function CarWashServiceList() {
 const groupedServices = [
        {
          category: "Exterior Wash",
          services: [
            { name: "Sedan", price: "$20" },
            { name: "SUV", price: "$20" },
            { name: "Truck", price: "$20" },
            { name: "Sedan", price: "$20" },
          ],
        },
        {
          category: "Full Interior & Exterior",
          services: [
            { name: "Sedan", price: "$20" },
            { name: "SUV", price: "$20" },
            { name: "Truck", price: "$20" },
            { name: "Sedan", price: "$20" },
          ],
        },
        {
          category: "Engine Wash",
          services: [
            { name: "All Vehicles", price: "$20" },
          ],
        },
      ];
      
  return (
    <div className="border rounded-lg p-5 bg-white space-y-5 text-sm text-[#111]">
      <h3 className="text-primaryColor text-lg lg:text-xl font-semibold">Car Wash Services</h3>

      {groupedServices.map((group, idx) => (
        <div key={idx} className="space-y-2">
          <h4 className="text-lg lg:text-xl font-medium text-headerColor">{group.category}</h4>
          <div className="space-y-3">
            {group.services.map((service, sIdx) => (
              <div key={sIdx} className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-700">
                  <Image src="/icon/car-2.svg" alt="service" width={18} height={18}/>
                  <span className="text-base font-normal ">{service.name}</span>
                </div>
                <span className="text-base font-normal">{service.price}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
