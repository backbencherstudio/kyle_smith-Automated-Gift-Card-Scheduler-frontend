"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { IoMailOutline } from "react-icons/io5";
import { Switch } from "../ui/switch";

export default function ProfileForm({ setIsEdite }: any) {
  const { register, handleSubmit } = useForm();
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [profileImg, setProfileImg] = useState("/image/proimag.jpg");
  const [coverImg, setCoverImg] = useState("/image/profile-cover-img.jpg");
  const [birthdayNotify, setBirthdayNotify] = useState(true);
  const [deliveryNotify, setDeliveryNotify] = useState(true);
  const [allNotify, setAllNotify] = useState(true);
  const onSubmit = (data) => {
    console.log("Form Data:", {data, coverImg ,profileImg ,birthdayNotify ,deliveryNotify ,allNotify});
   
  
    setIsEdite(false);
  };
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      setProfileImg(URL.createObjectURL(file));
    }
    
  };
  
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      setCoverImg(URL.createObjectURL(file)); // ✅ Now works!
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      {/* PROFILE IMAGE */}
      <div className="bg-whiteColor p-3 md:p-6 rounded-2xl ">
        <div className=" flex justify-between items-center pb-2 mb-6 ">
          <h2 className="text-headerColor text-lg lg:text-lg font-bold  ">
            {" "}
            Profile
          </h2>

          <div className="">
            <button
              onClick={() => setIsEdite(true)}
              className="flex items-center gap-1 bg-primaryColor cursor-pointer text-headerColor px-3 py-1.5  md:px-3 md:py-3  rounded-md text-sm font-semibold"
            >
              Save & Changes
            </button>
          </div>
        </div>
        <div className="flex justify-between ">
          <div className=" relative w-full">

            <Image
              src={coverImg}
              alt="Cover"
              width={1220}
              height={300}
              className="w-full h-[300px] rounded-lg object-cover"
              unoptimized={coverImg.startsWith("blob:")}
            />
            <input
          type="file"
          accept="image/*"
          ref={coverInputRef}
          onChange={handleCoverChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => coverInputRef.current.click()}
          className="absolute bottom-4 right-4 z-10 bg-[#D2D2D5]/10 text-white md:px-4 px-2 py-1.5 md:py-2 rounded-md flex items-center text-sm md:text-base gap-1 hover:scale-105 transition"
        >
          <FaCamera className="lg:w-4 lg:h-4 w-3 h-3" /> Edit Cover
        </button>
            <div className=" absolute top-0 left-0 bg-blackColor/80 w-full h-full  rounded-lg">
              <div className=" flex  flex-col md:flex-row  md:items-center h-full gap-3 md:gap-5 pl-6 md:ml-0">
                <div className="md:flex flex-col md:flex-row ml-5 lg:ml-15 items-center gap-5">
                  <div className="relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px] rounded-full border-2 lg:border-4 border-white shadow md:mb-4 mt-4 shrink-0">
                    <Image
                      src={profileImg}
                      alt="Profile"
                      fill
                      unoptimized={profileImg.startsWith("blob:")}
                      className="object-cover rounded-full"
                      sizes="150px"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={profileInputRef}
                      onChange={handleProfileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => profileInputRef.current.click()}
                      className="absolute lg:bottom-0 cursor-pointer bottom-1 -right-2  lg:right-0 bg-black text-white md:p-2.5 p-1.5 border-1 border-whiteColor rounded-full hover:scale-105 transition"
                    >
                      <FaCamera className="lg:w-4 lg:h-4 w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="">
                  <h4 className="text-lg md:text-2xl lg:text-[32px] font-semibold text-whiteColor ">
                    Esther Howard
                  </h4>
                  <p className="text-base  text-[#D2D2D5] md:my-1">
                    Owner Of Timely
                  </p>
                  <div className=" mt-2 md:mt-0">
                    <p className="flex items-center text-sm md:text-base gap-2 text-[#D2D2D5]">
                      <span>
                        <GrLocation />
                      </span>{" "}
                      4319 Wakefield Street, Philadelphia, PA 19126
                    </p>
                    <p className="flex items-center gap-2 text-sm md:text-base text-[#D2D2D5]">
                      <span>
                        <IoMailOutline />
                      </span>{" "}
                      esther@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FORM GRID */}
      <div className="md:grid  md:grid-cols-2 gap-4 mt-6 bg-white p-4 md:p-6 rounded-xl">
        <div className="mb-2 col-span-2">
          <h5 className="text-headerColor text-lg font-bold ">
            Contact Details
          </h5>
        </div>
        <div className=" col-span-1">
          <label className="text-headerColor mb-1 text-[14px] block font-semibold">
            Name
          </label>
          <input
            {...register("name")}
            defaultValue="Esther Howard"
            placeholder="Enter your Name"
            className="w-full border px-3 py-3 rounded-md bg-borderColor2/35"
          />

          <label className="text-headerColor mb-1 text-[14px] block font-semibold mt-4">
            Email
          </label>
          <input
            {...register("email")}
            defaultValue="abc@gmail.com"
            
            placeholder="Enter your Email"
            className="w-full border px-3 py-3 rounded-md bg-borderColor2/35"
          />
          <label className="text-headerColor mb-1 text-[14px] block font-semibold mt-4">
            Date of Birth
          </label>
          <input
            {...register("dob")}
            defaultValue="9th January, 1998"
            className="w-full border px-3 py-3 rounded-md bg-borderColor2/35"
          />
        </div>

        <div className=" col-span-1 mt-4 md:mt-0">
          <label className="text-headerColor mb-1 text-[14px] block font-semibold ">
            Address
          </label>
          <input
            {...register("address")}
            defaultValue="2825 Winding Way, Providence, RI 02908"
            className="w-full border px-3 py-3 rounded-md bg-borderColor2/35"
          />

          <label className="text-headerColor mb-1 text-[14px] block font-semibold mt-4">
            Phone Number
          </label>
          <input
            {...register("phone")}
            defaultValue="183454389"
            className="w-full border px-3 py-3 rounded-md bg-borderColor2/35"
          />
        </div>
      </div>

      {/* password */}
      <div className="mt-6 p-6 rounded-xl bg-whiteColor">
        <label className="text-headerColor text-lg lg:text-xl font-semibold mb-3 block">
        Password Settings
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-2">
          <div>
          <label className="text-headerColor mb-1 text-[14px] block font-semibold">
            Current Password
          </label>
          <input
            {...register("name")}
            type="password"
            defaultValue="Esther Howard"
            placeholder="Enter your Name"
            className="w-full border px-3 py-3 rounded-md bg-borderColor2/35"
          />
          </div>
          <div>
          <label className="text-headerColor mb-1 text-[14px] block font-semibold  w-full">
            New Password
          </label>
          <input
            {...register("email")}
            type="password"
            defaultValue="abc@gmail.com"
            placeholder="Enter your Email"
            className="w-full border px-3 py-3 rounded-md bg-borderColor2/35 "
          />
          </div>

         <div>
         <label className="text-headerColor mb-1 text-[14px] block font-semibold ">
            Confirmed Password
          </label>
          <input
          type="password"
            {...register("dob")}
            defaultValue="9th January, 1998"
            className="w-full border px-3 py-3 rounded-md bg-borderColor2/35"
          />
         </div>
        </div>
      </div>
      {/* ABOUT */}
      <div className="mt-6 p-4 md:p-6 rounded-xl bg-whiteColor">
        <label className="text-headerColor text-lg lg:text-xl font-semibold mb-3 block">
          About
        </label>
        <textarea
          {...register("about")}
          className="w-full border px-3 py-3 rounded-md bg-borderColor2/35 h-36"
          defaultValue={`We believe that keeping your car clean should be effortless, affordable, and eco-conscious. Founded with a passion for quality service and convenience, we’ve redefined the traditional car wash experience by introducing a seamless, subscription-based model that puts your time and comfort first.`}
        />
      </div>
      <div className="bg-white p-6 rounded-lg mt-6 w-full">
        <h3 className="text-headerColor text-lg font-bold">Email Notifications Settings</h3>
        <div className="space-y-4 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-base text-descriptionColor">Birthday Schedule Notifications</span>
            <Switch
              checked={birthdayNotify}
              onCheckedChange={setBirthdayNotify}
              className={birthdayNotify ? "!bg-[#2F54EB]" : ""}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base text-descriptionColor">After Delivery Notifications</span>
            <Switch
              checked={deliveryNotify}
              onCheckedChange={setDeliveryNotify}
              className={deliveryNotify ? "!bg-[#2F54EB]" : ""}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base text-descriptionColor">All Notifications</span>
            <Switch
              checked={allNotify}
              onCheckedChange={setAllNotify}
              className={allNotify ? "!bg-[#2F54EB]" : ""}
            />
          </div>
        </div>
      </div>
    </form>
  );
}


