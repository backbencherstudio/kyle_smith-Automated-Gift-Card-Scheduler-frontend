"use client";
import ProfileDetails from "@/components/profile/ProfileDetails";
import ProfileEdit from "@/components/profile/ProfileEdit";
import Image from "next/image";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { GrLocation } from "react-icons/gr";
import { IoMailOutline } from "react-icons/io5";


interface dataTypes {
  name: string;
  email: string;
  location: string;
  phone: string;
  profileImage: string;
  coverImage: string;
  aboutUs: string;
  dob: Date;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  role: string;
}

const userData: dataTypes = {
  name: "Esther Howard",
  email: "esther@gmail.com",
  location: "4319 Wakefield Street, Philadelphia, PA 19126",
  phone: "1234567890",
  role: "Owner Of Timely",
  profileImage: "/image/proimag.jpg",
  coverImage: "/image/profile-cover-img.jpg",
  aboutUs: "Timely Gift was built to simplify the way we celebrate the people we care about. Forgetful moments or last-minute rushes are a thing of the past our platform ensures that thoughtful gifts are delivered on time, every time. With just a few clicks, users can add their friends' birthdays, schedule personalized Amazon gift cards, and receive smart reminders when special days are near. Once confirmed, the gift is sent instantly via email turning a simple gesture into a meaningful memory.",
  dob: new Date(),
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
}

function MyProfile() {
  const [isEdite, setIsEdite] = useState<boolean>(false);
  return (
    <div>
      <div>
        <div className="">
          {isEdite ? (
            <ProfileEdit setIsEdite={setIsEdite} userData={userData} />
          ) : (
            <div className=" ">
              <div className="bg-whiteColor p-4 md:p-6 rounded-2xl ">
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
                      <BiEdit className="lg:w-4.5 lg:h-4.5 w-3.5 h-3.5" /> Edit Profile
                    </button>
                  </div>
                </div>
                <div className="flex justify-between ">
                  <div className=" relative w-full">
                    <Image
                      src={userData.coverImage}
                      alt="profilebg"
                      width={1220}
                      height={300}
                      className="w-full h-[300px] rounded-lg object-cover "
                    />
                    <div className=" absolute top-0 left-0 bg-blackColor/80 w-full h-full  rounded-lg">

                      <div className=" flex flex-col md:flex-row h-full  md:ml-15 justify-center md:justify-start md:items-center gap-3 md:gap-5 ml-6" >
                        <div className=" ml-5  relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px]  rounded-full overflow-hidden border-2 border-whiteColor">
                          <Image
                            src={userData.profileImage}
                            alt="profilebg"
                            width={158}
                            height={150}
                            className="w-full h-full rounded-full "
                          />
                        </div>
                        <div className=" ">
                          <h4 className="text-lg md:text-2xl lg:text-[32px] font-semibold text-whiteColor ">
                            {userData.name}
                          </h4>
                          <p className="text-base  text-[#D2D2D5] md:my-1">
                            {userData.role}
                          </p>
                          <div className="mt-2 md:mt-0">
                            <p className="flex items-center gap-2 text-sm md:text-base text-[#D2D2D5]"><span><GrLocation /></span> {userData.location}</p>
                            <p className="flex items-center gap-2 text-sm md:text-base text-[#D2D2D5]"><span><IoMailOutline />
                            </span> {userData.email}</p>

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
                <ProfileDetails userData={userData} />
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
