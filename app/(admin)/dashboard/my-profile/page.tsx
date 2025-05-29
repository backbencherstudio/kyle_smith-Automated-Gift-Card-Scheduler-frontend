"use client";
import ProfileDetails from "@/components/profile/ProfileDetails";
import ProfileForm from "@/components/profile/ProfileForm";
import Image from "next/image";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { GrLocation } from "react-icons/gr";
import { IoMailOutline } from "react-icons/io5";
function MyProfile() {
  const [isEdite, setIsEdite] = useState<boolean>(false);
  return (
    <div>
      <div>
        <div className="">
          {isEdite ? (
            <ProfileForm setIsEdite={setIsEdite} />
          ) : (
            <div className=" ">
              <div className="bg-whiteColor p-6 rounded-2xl ">
              <div className=" flex justify-between items-center pb-2 mb-6 ">
                <h2 className="text-headerColor text-lg lg:text-lg font-bold  ">
                  {" "}
                   Profile
                </h2>

                <div className="">
                  <button
                    onClick={() => setIsEdite(true)}
                    className="flex items-center gap-1 bg-primaryColor cursor-pointer text-headerColor px-2 py-2  md:px-3 md:py-3  rounded-md text-sm font-semibold"
                  >
                   <BiEdit className="lg:w-4.5 lg:h-4.5 w-3.5 h-3.5"  /> Edit Profile
                  </button>
                </div>
              </div>
              <div className="flex justify-between ">
                <div className=" relative">
                  <Image
                    src="/image/profile-cover-img.jpg"
                    alt="profilebg"
                    width={1220}
                    height={300}
                    className="w-full h-[300px] rounded-lg object-cover "
                  />
                  <div className=" absolute top-0 left-0 bg-blackColor/80 w-full h-full  rounded-lg">

                  <div className=" flex flex-col md:flex-row h-full md:ml-15 justify-center md:items-center gap-3 md:gap-5 ml-6" >
                    <div className="  relative w-[80px] h-[80px] md:w-[10px] md:h-[10px] lg:w-[120px] lg:h-[120px]  rounded-full overflow-hidden border-2 border-whiteColor">
                      <Image
                        src="/image/proimag.jpg"
                        alt="profilebg"
                        width={158}
                        height={150}
                        className="w-full h-full rounded-full "
                      />
                    </div>
                    <div className=" ">
                      <h4 className="text-lg md:text-2xl lg:text-[32px] font-semibold text-whiteColor ">
                      Esther Howard
                      </h4>
                      <p className="text-base  text-[#D2D2D5] md:my-1">
                      Owner Of Timely
                      </p>
                      <div className="mt-2 md:mt-0">
                        <p className="flex items-center gap-2 text-sm md:text-base text-[#D2D2D5]"><span><GrLocation /></span> 4319 Wakefield Street, Philadelphia, PA 19126</p>
                        <p className="flex items-center gap-2 text-sm md:text-base text-[#D2D2D5]"><span><IoMailOutline />
                        </span> esther@gmail.com</p>
                        
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>

              </div>
              <div>
                <h4 className="lg:text-2xl text-xl font-bold text-headerColor py-6 ">Informations</h4>
              </div>
              <div className="">
                <ProfileDetails />
              </div>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
