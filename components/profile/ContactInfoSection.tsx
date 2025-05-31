import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoCallOutline, IoMailOutline } from "react-icons/io5";

interface ContactInfoProps {
  email: string;
  phone: string;
  address: string;
}

export default function ContactInfoSection({ email, phone, address }: ContactInfoProps) {
  return (
    <div className="space-y-6 text-sm text-gray-700">
      {/* Contact Details */}
      <div>
        <h3 className="text-headerColor text-lg font-semibold mb-2">Contact Details</h3>
        <div className="space-y-4">
          <div className="flex gap-2 items-start">
            <IoMailOutline className="text-primaryColor text-lg mt-[2px]" />
            <p className="text-base text-pragaraphColor">
              <span className="font-semibold text-base text-descriptionColor">Email:</span> {email}
            </p>
          </div>
          <div className="flex gap-2 items-start">
            <IoCallOutline className="text-primaryColor text-lg mt-[2px]" />
            <p className="text-base text-pragaraphColor">
              <span className="font-semibold text-base text-descriptionColor">Phone:</span> {phone}
            </p>
          </div>
          <div className="flex gap-2 items-start">
            <HiOutlineLocationMarker className="text-primaryColor text-2xl sm:text-lg mt-[2px]" />
            <p className="text-base text-pragaraphColor">
              <span className="font-semibold text-base text-descriptionColor">Address:</span> {address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
