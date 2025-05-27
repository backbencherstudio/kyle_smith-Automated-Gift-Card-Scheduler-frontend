"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa";

export default function ProfileForm({setIsEdite}:any) {
  const { register, handleSubmit } = useForm();
  const profileInputRef = useRef(null);

  const [profileImg, setProfileImg] = useState("/image/profile.jpg");
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const onSubmit = (data) => {
    console.log("Form Data:", data);
    console.log("Profile Image File:", profileInputRef.current?.files[0]);
    console.log("License Front:", frontImage?.file);
    console.log("License Back:", backImage?.file);
    setIsEdite(false)

  };
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      setProfileImg(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      {/* PROFILE IMAGE */}
      <div className="flex justify-between md:px-8">
        <div className=" md:flex items-center gap-5">
          <div className="-mt-12 ">
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
                className="absolute lg:bottom-0 cursor-pointer bottom-1 -right-4  lg:right-0 bg-black text-white p-2.5 border-3 border-whiteColor rounded-full hover:scale-105 transition"
              >
                <FaCamera className="w-4 h-4" />
              </button>
            </div>
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
        <div className="mt-6 text-right">
          <button
            type="submit"
            className="flex items-center gap-1 whitespace-nowrap bg-primaryColor cursor-pointer text-white px-3 sm:px-4 py-2 lg:py-3 lg:px-6 rounded-md text-xs sm:text-sm font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>

    
     

      {/* FORM GRID */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div>
            <div className="mb-2">
                <h5 className="text-headerColor text-lg font-semibold ">Contact Details</h5>
            </div>
          <label className="text-grayColor1 mb-1 text-[14px] block">
            Business Location
          </label>
          <input
            {...register("businessLocation")}
            defaultValue="4319 Wakefield Street, Philadelphia, PA 19126"
            className="w-full border px-3 py-3 rounded-md"
          />

          <label className="text-grayColor1 mb-1 text-[14px] block mt-4">
            Email
          </label>
          <input
            {...register("email")}
            defaultValue="carflex@gmail.com"
            className="w-full border px-3 py-3 rounded-md"
          />

          <label className="text-grayColor1 mb-1 text-[14px] block mt-4">
            Phone
          </label>
          <input
            {...register("phone")}
            defaultValue="183454389"
            className="w-full border px-3 py-3 rounded-md"
          />
        </div>

        <div>
        <div className="mb-2">
                <h5 className="text-headerColor text-lg font-semibold ">Personal Informations</h5>
            </div>
          <label className="text-grayColor1 mb-1 text-[14px] block">
            Date of Birth
          </label>
          <input
            {...register("dob")}
            defaultValue="9th January, 1998"
            className="w-full border px-3 py-3 rounded-md"
          />

          <label className="text-grayColor1 mb-1 text-[14px] block mt-4">
            Address
          </label>
          <input
            {...register("address")}
            defaultValue="2825 Winding Way, Providence, RI 02908"
            className="w-full border px-3 py-3 rounded-md"
          />

          <label className="text-grayColor1 mb-1 text-[14px] block mt-4">
            NID
          </label>
          <input
            {...register("nid")}
            defaultValue="183454389"
            className="w-full border px-3 py-3 rounded-md"
          />
        </div>
      </div>

      {/* ABOUT */}
      <div className="mt-6">
        <label className="text-headerColor text-lg lg:text-xl font-semibold mb-3 block">About</label>
        <textarea
          {...register("about")}
          className="w-full border px-3 py-3 rounded-md h-36"
          defaultValue={`We believe that keeping your car clean should be effortless, affordable, and eco-conscious...`}
        />
      </div>
  
      <div className="mt-6 ">
      <h5 className="text-headerColor text-lg lg:text-xl font-semibold mb-3 block">Licences</h5>
      <div className="grid md:grid-cols-2 gap-4 ">
        <ImageUploader
          label="Upload Your License Front Photo"
          setImage={setFrontImage}
        />
        <ImageUploader
          label="Upload Your License Back Photo"
          setImage={setBackImage}
        />
      </div>
      </div>

      {/* SAVE BUTTON */}
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
            <Image src="/icon/upload.svg" alt="upload" width={40} height={29} className=""/>
          </div>
          <p className="text-grayColor1 text-[14px] mb-2">{label}</p>
          <p className="text-xs text-[#B4B4B4] ">
          Only support .jpg, .png and .svg and zip files
          </p>
          <div className="flex items-centerc justify-center">

          <button  className=" mt-3 gap-1 bg-primaryColor cursor-pointer text-white px-4 py-2 lg:py-3 lg:px-6 rounded-md text-sm font-medium"> Click To Upload</button>
          </div>
        </div>
      )}
    </div>
  );
}
