// Required dependencies:
// npm install react-hook-form
// shadcn/ui already assumed installed

"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function AddServiceDialog({ open, onClose }: { open: boolean; onClose: any }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      serviceName: "",
      category: "",
      location: "",
      teamSize: "",
      availableTime: "",
      description: "",
      isMobile: true,
      isGarage: false,
      image: null,
    },
  });

  const [imageName, setImageName] = useState("");

  const onSubmit = (data: any) => {
    console.log("Submitted Data:", data);
    onClose();
    reset();
    setImageName("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="lg:!max-w-[800px] !max-w-[90vw] h-[90vh] md:h-auto overflow-y-auto  px-6 py-6">
        <DialogHeader>
          <DialogTitle className="text-xl lg:text-2xl font-medium text-headerColor">Add New Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="md:grid space-y-4 md:space-y-0 grid-cols-1 md:grid-cols-2 gap-5 items-center mt-4">
          <div className="space-y-2 ">
            <Label className="text-[14px] font-medium text-headerColor">Service Name</Label>
            <Input {...register("serviceName" as const)} placeholder="Exterior Wash" className="rounded-md !h-[45px] text-[14px] text-grayColor" />
          </div>
          <div className="space-y-2">
            <Label className="text-[14px] font-medium text-headerColor">Service Category</Label>
            <Input {...register("category" as const)} placeholder="Sedan" className="rounded-md !h-[45px] text-[14px] text-grayColor" />
          </div>
          <div className="space-y-2">
            <Label className="text-[14px] font-medium text-headerColor">Location</Label>
            <Input {...register("location" as const)} placeholder="New York City" className="rounded-md !h-[45px] text-[14px] text-grayColor" />
          </div>
          <div className="space-y-2">
            <Label className="text-[14px] font-medium text-headerColor">Available Time</Label>
            <Input {...register("availableTime" as const)} placeholder="09:30 AM - 11:00 PM" className="rounded-md !h-[45px] text-[14px] text-grayColor" />
          </div>
          <div className="space-y-2">
            <Label className="text-[14px] font-medium text-headerColor">Team Size</Label>
            <Input {...register("teamSize" as const)} placeholder="03" className="rounded-md !h-[45px] text-[14px] text-grayColor" />
          </div>

          <div className="space-y-2">
           
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Label className="text-sm text-headerColor">Mobile</Label>
                <Controller
                  control={control}
                  name="isMobile"
                  render={({ field: { value, onChange } }) => (
                    <Switch checked={value} onCheckedChange={onChange} className="data-[state=checked]:bg-primaryColor" />
                  )}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Garage</Label>
                <Controller
                  control={control}
                  name="isGarage"
                  render={({ field: { value, onChange } }) => (
                    <Switch checked={value} onCheckedChange={onChange} className="data-[state=checked]:bg-primaryColor" />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[14px] font-medium text-headerColor">Descriptions</Label>
            <Textarea
              {...register("description" as const)}
              placeholder="description..."
              className="rounded-md h-[123px] text-[14px] text-grayColor"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[14px] font-medium text-headerColor">Additional image</Label>
            <div className="border-2 border-primaryColor border-dashed bg-gray-50 rounded-md p-5 flex items-center justify-center text-xs text-gray-500 relative h-[123px]">
              <label htmlFor="image-upload" className="cursor-pointer text-center w-full">
                <Input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setValue("image", file);
                      setImageName(file.name);
                    }
                  }}
                />
                {imageName ? (
                  <p className="text-sm font-medium text-gray-700">{imageName}</p>
                ) : ( 
                    <div className="flex flex-col items-center ">
                           <div className="  w-10 h-10 flex justify-center items-center rounded-full  bg-whiteColor">
                            <Image src="/icon/image.svg" alt="image" width={20} height={16} />
                           </div>
                        <p className="text-sm">Min 2mb, PNG, JPEG or PDF</p>
                    </div>
                )}
              </label>
            </div>
          </div>

          <div className="col-span-2 flex justify-between gap-3 mt-6">
            <button type="button"  onClick={()=>onClose(false)} className="flex items-center gap-1 bg-grayColor1/20 cursor-pointer text-descriptionColor px-4 py-2 lg:py-3 lg:px-6 rounded-md text-sm font-medium">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-1 bg-primaryColor cursor-pointer text-white px-4 py-2 lg:py-3 lg:px-6 rounded-md text-sm font-medium">
              Save
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
