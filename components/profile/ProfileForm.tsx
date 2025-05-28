"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { IoMailOutline } from "react-icons/io5";

export default function ProfileForm({ setIsEdite }: any) {
  const { register, handleSubmit } = useForm();
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [profileImg, setProfileImg] = useState("/image/proimag.jpg");
  const [coverImg, setCoverImg] = useState("/image/profile-cover-img.jpg");
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const onSubmit = (data) => {
    console.log("Form Data:", data);
    console.log("Profile Image File:", profileInputRef.current?.files[0]);
    console.log("License Front:", frontImage?.file);
    console.log("License Back:", backImage?.file);
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
      setCoverImg(URL.createObjectURL(file));
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      {/* PROFILE IMAGE */}
      <div className="bg-whiteColor p-6 rounded-2xl ">
        <div className=" flex justify-between items-center pb-2 mb-6 ">
          <h2 className="text-headerColor text-lg lg:text-lg font-bold  ">
            {" "}
            Profile
          </h2>

          <div className="">
            <button
              onClick={() => setIsEdite(true)}
              className="flex items-center gap-1 bg-primaryColor cursor-pointer text-headerColor  px-3 py-3  rounded-md text-sm font-semibold"
            >
              Save Profile
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
          className="absolute bottom-4 right-4 z-10 bg-black text-white px-4 py-2 rounded-md flex items-center gap-1 hover:scale-105 transition"
        >
          <FaCamera className="w-4 h-4" /> Edit Cover
        </button>
            <div className=" absolute top-0 left-0 bg-blackColor/80 w-full h-full  rounded-lg">
              <div className=" md:flex items-center h-full gap-5">
                <div className="md:flex h-full md:ml-15 items-center gap-5">
                  <div className="relative w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-full border-4 border-white shadow mb-4 shrink-0">
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
                      className="absolute lg:bottom-0 cursor-pointer bottom-1 -right-4  lg:right-0 bg-black text-white p-2.5 border-1 border-whiteColor rounded-full hover:scale-105 transition"
                    >
                      <FaCamera className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className=" ">
                  <h4 className="text-lg md:text-2xl lg:text-[32px] font-semibold text-whiteColor ">
                    Esther Howard
                  </h4>
                  <p className="text-base  text-[#D2D2D5] md:my-1">
                    Owner Of Timely
                  </p>
                  <div>
                    <p className="flex items-center gap-2 text-[#D2D2D5]">
                      <span>
                        <GrLocation />
                      </span>{" "}
                      4319 Wakefield Street, Philadelphia, PA 19126
                    </p>
                    <p className="flex items-center gap-2 text-[#D2D2D5]">
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
      <div className="grid md:grid-cols-2 gap-4 mt-6 bg-white p-6 rounded-xl">
        <div className="mb-2 col-span-2">
          <h5 className="text-headerColor text-lg font-bold ">
            Contact Details
          </h5>
        </div>
        <div>
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

        <div>
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
        <div className=" md:grid grid-cols-3 gap-2 ">
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
      <div className="mt-6 p-6 rounded-xl bg-whiteColor">
        <label className="text-headerColor text-lg lg:text-xl font-semibold mb-3 block">
          About
        </label>
        <textarea
          {...register("about")}
          className="w-full border px-3 py-3 rounded-md bg-borderColor2/35 h-36"
          defaultValue={`We believe that keeping your car clean should be effortless, affordable, and eco-conscious. Founded with a passion for quality service and convenience, we’ve redefined the traditional car wash experience by introducing a seamless, subscription-based model that puts your time and comfort first.`}
        />
      </div>
    </form>
  );
}

function ImageUploader({ label, setImage }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImage({ file, url });
    }
  };

  return (
    <div className="relative w-full h-[200px] md:h-[263px] border-2 border-dashed border-primaryColor rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
      />
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Preview"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="text-center z-0">
          <div className="flex justify-center mb-3">
            <Image
              src="/icon/upload.svg"
              alt="upload"
              width={40}
              height={29}
              className=""
            />
          </div>
          <p className="text-headerColor text-[14px] mb-2">{label}</p>
          <p className="text-xs text-[#B4B4B4] ">
            Only support .jpg, .png and .svg and zip files
          </p>
          <div className="flex items-centerc justify-center">
            <button className=" mt-3 gap-1 bg-primaryColor cursor-pointer text-white px-4 py-2 lg:py-3 lg:px-6 rounded-md text-sm font-medium">
              {" "}
              Click To Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
