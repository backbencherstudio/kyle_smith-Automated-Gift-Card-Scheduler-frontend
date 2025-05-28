import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoCallOutline, IoMailOutline } from "react-icons/io5";

export default function ContactInfoSection() {
  return (
    <div className="space-y-6 text-sm text-gray-700">
      {/* Contact Details */}
      <div>
        <h3 className="text-headerColor text-lg font-semibold  mb-2">Contact Details</h3>
        <div className="space-y-4">
         
          <div className="flex gap-2 items-start">
            <IoMailOutline
            className="text-primaryColor text-lg mt-[2px]" />
            <p className=" text-base text-pragaraphColor"><span className="font-semibold text-base text-descriptionColor">Email:</span> esther@gmail.com</p>
          </div>
          <div className="flex gap-2 items-start">
            <IoCallOutline className="text-primaryColor text-lg mt-[2px]" />
            <p className=" text-base text-pragaraphColor"><span className="font-semibold text-base text-descriptionColor">Phone:</span> 183454389</p>
          </div>
          <div className="flex gap-2 items-start">
            <HiOutlineLocationMarker className="text-primaryColor text-lg mt-[2px]" />
            <p className=" text-base text-pragaraphColor"><span className="font-semibold text-base text-descriptionColor">Address:</span> 4319 Wakefield Street, Philadelphia, PA 19126</p>
          </div>
        </div>
      </div>

     
    </div>
  );
}
