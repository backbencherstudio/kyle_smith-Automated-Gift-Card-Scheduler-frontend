"use client";
import ProfileDetails from "@/components/profile/ProfileDetails";
import ProfileForm from "@/components/profile/ProfileForm";
import UserNID from "@/components/profile/UserNID";
import Image from "next/image";
import { useState } from "react";

function MyProfile() {
  const [isEdite, setIsEdite] = useState<boolean>(false);
  return (
    <div>
      <h2 className="text-headerColor text-lg lg:text-xl font-semibold py-2">
        {" "}
        Edit Profile
      </h2>

      <div>
        <div className="">
          <Image
            src="/image/probg.jpg"
            alt="profilebg"
            width={1220}
            height={300}
            className="w-full rounded-md object-cover h-full"
          />

          {isEdite ? (
            <ProfileForm setIsEdite={setIsEdite} />
          ) : (
            <div>
              <div className="flex justify-between md:px-8">
                <div className=" md:flex items-center gap-5">
                  <div className="-mt-12 w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden border-2 border-whiteColor">
                    <Image
                      src="/image/profile.jpg"
                      alt="profilebg"
                      width={158}
                      height={150}
                      className="w-full h-full rounded-full "
                    />
                  </div>
                  <div className=" md:pt-6">
                    <h4 className="text-lg md:text-2xl lg:text-[32px] font-semibold ">
                      Ali Eyad
                    </h4>
                    <p className="text-base md:text-lg text-descriptionColor md:mt-1">
                      Owner of Carflex Company
                    </p>
                  </div>
                </div>
                <div className=" mt-6">
                  <button
                    onClick={() => setIsEdite(true)}
                    className="flex items-center gap-1 bg-primaryColor cursor-pointer text-white px-4 py-2 lg:py-3 lg:px-6 rounded-md text-sm font-medium"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
              <div className="py-6">
                <ProfileDetails />
              </div>
              <div>
                <UserNID />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
