import { CgNotes } from "react-icons/cg";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoCallOutline, IoMailOutline } from "react-icons/io5";
import { MdOutlineCalendarMonth } from "react-icons/md";

export default function ContactInfoSection() {
  return (
    <div className="space-y-6 text-sm text-gray-700">
      {/* Contact Details */}
      <div>
        <h3 className="text-headerColor text-lg font-semibold  mb-2">Contact Details</h3>
        <div className="space-y-4">
          <div className="flex gap-2 items-start">
            <HiOutlineLocationMarker className="text-primaryColor text-lg mt-[2px]" />
            <p className=" text-base text-pragaraphColor"><span className="font-semibold text-base text-descriptionColor">Business Location:</span> 4319 Wakefield Street, Philadelphia, PA 19126</p>
          </div>
          <div className="flex gap-2 items-start">
            <IoMailOutline
            className="text-primaryColor text-lg mt-[2px]" />
            <p className=" text-base text-pragaraphColor"><span className="font-semibold text-base text-descriptionColor">Email:</span> carflex@gmail.com</p>
          </div>
          <div className="flex gap-2 items-start">
            <IoCallOutline className="text-primaryColor text-lg mt-[2px]" />
            <p className=" text-base text-pragaraphColor"><span className="font-semibold text-base text-descriptionColor">Phone:</span> 183454389</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div>
        <h3 className="text-headerColor text-lg font-semibold   mb-2">Personal Informations</h3>
        <div className="space-y-4">
          <div className="flex gap-2 items-start">
            <MdOutlineCalendarMonth className="text-primaryColor text-lg mt-[2px]" />
            <p className=" text-base text-pragaraphColor"><span className="font-semibold text-base text-descriptionColor">Date of Birthday:</span> 9th January, 1998</p>
          </div>
          <div className="flex gap-2 items-start">
            <HiOutlineLocationMarker className="text-primaryColor text-lg mt-[2px]" />
            <p className=" text-base text-pragaraphColor"><span className="font-semibold text-base text-descriptionColor">Address:</span> 2825 Winding Way, Providence, RI 02908</p>
          </div>
          <div className="flex gap-2 items-start">
            <CgNotes className="text-primaryColor text-lg mt-[2px]" />
            <p className=" text-base text-pragaraphColor"><span className="font-semibold text-base text-descriptionColor">NID:</span> 183454389</p>
          </div>
        </div>
      </div>
    </div>
  );
}
