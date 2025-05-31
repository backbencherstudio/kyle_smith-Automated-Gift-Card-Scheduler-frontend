import React from 'react'
import UserNID from "@/components/profile/UserNID"
import Image from "next/image"
import ProfileDetails from './ProfileDetails' 
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
}
function profileAllInformation({ userData }: { userData: dataTypes }) {
  return (
    <div>
       <div>
        <div className="">
           <Image src="/image/probg.jpg" alt="profilebg" width={1220} height={300} className="w-full rounded-md object-cover h-full"/>
           <div className="flex justify-between md:px-8">
            <div className=" md:flex items-center gap-5">
             <div className="-mt-12 w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden border-2 border-whiteColor">
             <Image src="/image/profile.jpg" alt="profilebg" width={158} height={150} className="w-full h-full rounded-full "/>
             </div>
                <div className=" md:pt-6">
                   <h4 className="text-lg md:text-2xl lg:text-[32px] font-semibold ">Ali Eyad</h4> 
                   <p className="text-base md:text-lg text-descriptionColor md:mt-1">Owner of Carflex Company</p>
                </div>
            </div>
             <div className=" mt-6"> 
               <button className="flex items-center gap-1 bg-primaryColor cursor-pointer text-white px-4 py-2 lg:py-3 lg:px-6 rounded-md text-sm font-medium">Edit Profile</button>
             </div>
           </div>
        </div>
      <div className="py-6">
        <ProfileDetails userData={userData} />
      </div>
      <div>
     <UserNID/>
        </div>
      </div>
    </div>
  )
}

export default profileAllInformation
