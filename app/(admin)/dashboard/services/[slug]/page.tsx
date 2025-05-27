import Rating from "@/components/reusable/Rating";
import CarWashServiceList from "@/components/service/CarWashServiceList";
import { serviceList } from "@/demoData/serviceList";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineArrowForwardIos } from "react-icons/md";

async function ServiceDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  const singleCar = serviceList.find((item) => item.slug == slug);

  const serviceDetails = [
    { icon: "/icon/caricon.svg", label: "Car Wash" },
    { icon: "/icon/maps-location-01.svg", label: "New York City" },
    { icon: "/icon/ptime.svg", label: "09:30 AM - 11:00 PM" },
  ];

  return (
    <div>
      <div className="flex gap-4 items-center">
        <Link
          href="/dashboard/services"
          className="text-blackColor font-semibold text-xl lg:text-2xl"
        >
          Our Services
        </Link>{" "}
        <MdOutlineArrowForwardIos className=" text-xl lg:text-2xl" />
        <p className="text-blackColor font-semibold text-xl lg:text-2xl">
          Exterior Wash
        </p>
      </div>
      <div className="lg:px-5 pt-6">
        <div className="">
          <Image
            src="/image/carBigImage.jpg"
            alt="car image"
            width={1200}
            height={500}
            className="rounded-md "
          />
        </div>
        <div className=" grid grid-cols-2 md:grid-cols-3 mt-8">
          <div className="md:col-span-2">
            <h4 className=" text-lg font-medium text-headerColor ">
              {singleCar?.title}
            </h4>
            <p className="text-pragaraphColor text-base">CarFlix</p>
            <Rating ratings={5} />
          </div>
          <div className="md:col-span-1">
            <div className="md:space-y-4 space-y-3">
              {serviceDetails.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div>
                    <Image
                      src={item?.icon}
                      alt={item?.label}
                      width={17}
                      height={16}
                      className=""
                    />
                  </div>
                  <span className="text-base text-pragaraphColor">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 mb-11">
          <h3 className=" text-lg font-semibold text-headerColor ">
            About the Provider
          </h3>
          <p className="text-base text-pragaraphColor mt-0.5">
            Keep your vehicle sparkling with thorough interior and exterior car
            cleaning. Refresh your car’s appearance with premium hand washing.
          </p>
        </div>

        <div className="md:flex space-y-3 md:space-y-0 gap-4 items-center">
          <div className="flex  items-center gap-2">
            <Image
              src="/icon/user.svg"
              alt="user"
              width={18}
              height={18}
              className=""
            />
            <p className="text-base text-secondaryColor">
              <span>Team Size:</span> 03
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/icon/car-2.svg"
              alt="user"
              width={18}
              height={18}
              className=""
            />
            <p className="text-base text-secondaryColor">
              <span>Mobile:</span> Available
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/icon/home.svg"
              alt="user"
              width={18}
              height={18}
              className=""
            />
            <p className="text-base text-secondaryColor">
              <span>Garage:</span> Available
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8">

        <CarWashServiceList/>
      </div>
    </div>
  );
}

export default ServiceDetailsPage;
