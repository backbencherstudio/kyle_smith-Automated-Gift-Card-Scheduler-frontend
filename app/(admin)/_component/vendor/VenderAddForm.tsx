import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToken } from "@/hooks/useToken";

import { Switch } from "@/components/ui/switch";
import { UserService } from "@/service/user.service";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";


export default function VenderAddForm({ open, onClose, initialData, onfetch }: { open: boolean; onClose: any; initialData?: any, onfetch?: any }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      website: initialData?.website || "",
      logo: null,
      isActive: initialData?.is_active ?? true,
    },
  });
  const [loading, setLoding] = useState(false)
  const [logoName, setLogoName] = useState(initialData?.logo ? initialData.logo : "");
  const { token } = useToken();
  const router = useRouter()

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        website: initialData.website || "",
        logo: null,
        isActive: initialData.is_active ?? true,
      });
      setLogoName(initialData.logo || "");
    } else {
      reset({ name: "", description: "", website: "", logo: null, isActive: true });
      setLogoName("");
    }
  }, [initialData, reset]);

  const onSubmit = async (data: any) => {
    setLoding(true)
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("website", data.website);
    formData.append("is_active", data.isActive);
    if (logoName && data.logo) {
      formData.append("logo", data.logo);
    }
    try {
      let response;
      if (initialData?.id) {
        const endpoint = `/admin/vendor/${initialData.id}`;
        response = await UserService.updateProtectedData(token, endpoint, formData);
      } else {

        response = await UserService.addVendore(formData, token);
        console.log(token);

        console.log(response);

      }
      if (response?.data?.success == true) {
        toast.success(initialData?.id ? "Vendor updated successfully" : "Successfully Add New Vendor");
        reset();
        router.replace("/dashboard/add-vendor")
        onfetch()
        setLogoName("");
        onClose(false)
        setLoding(false)
      }
    } catch (error) {
      setLoding(false)
      console.error("Error submitting form:", error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="lg:!max-w-[800px] !max-w-[90vw] h-[90vh] md:h-auto overflow-y-auto  px-6 py-6">
        <DialogHeader>
          <DialogTitle className="text-xl lg:text-2xl font-medium text-headerColor">{initialData?.id ? "Update Vendor" : "Add New Vendor"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="md:grid space-y-4 md:space-y-0 grid-cols-1 md:grid-cols-2 gap-5 items-center mt-4">
          <div className="space-y-2">
            <Label className="text-[16px] font-medium text-headerColor">Vendor Name</Label>
            <Input {...register("name" as const)} placeholder="Vendor Name" className="rounded-md !h-[45px] text-[14px] text-grayColor" required />
          </div>
          <div className="space-y-2">
            <Label className="text-[16px] font-medium text-headerColor">Website</Label>
            <Input {...register("website" as const)} placeholder="https://example.com" className="rounded-md !h-[45px] text-[14px] text-grayColor" required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-[16px] font-medium text-headerColor">Description</Label>
            <Textarea {...register("description" as const)} placeholder="Description..." required className="rounded-md h-[123px] text-[14px] text-grayColor" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-[16px] font-medium text-headerColor">Card Image</Label>
            <div className="border-2 border-primaryColor border-dashed bg-gray-50 rounded-md p-5 flex items-center justify-center text-xs text-gray-500 relative h-[123px]">
              <label htmlFor="logo-upload" className="cursor-pointer text-center w-full">
                <Input
                  id="logo-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setValue("logo", file);
                      setLogoName(file.name);
                    }
                  }}
                />
                {logoName ? (
                  typeof logoName === "string" && logoName.endsWith(".png") ? (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 flex justify-center items-center rounded-full bg-whiteColor">
                        <Image src={typeof logoName === "string" ? `/uploads/${logoName}` : "/icon/image.svg"} alt="logo" width={40} height={32} className="object-contain" />
                      </div>
                      <p className="text-sm">{logoName}</p>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-gray-700">{logoName}</p>
                  )
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 flex justify-center items-center rounded-full bg-whiteColor">
                      <Image src="/icon/image.svg" alt="logo" width={20} height={16} className="object-contain" />
                    </div>
                    <p className="text-sm">Min 2mb, PNG, JPEG or PDF</p>
                  </div>
                )}
              </label>
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-[16px] font-medium text-headerColor"> Vendor Status</Label>
            <div className="flex items-center gap-3">
              <Controller
                control={control}
                name="isActive"
                render={({ field: { value, onChange } }) => (
                  <>
                    <Switch
                      checked={value}
                      onCheckedChange={onChange}
                      id="isActive"
                      className={value ? '!bg-green-600' : 'bg-red-500'}
                    />
                    <label
                      htmlFor="isActive"
                      className={`text-[18px] font-bold ${value ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {value ? 'Is Active' : 'In Active'}
                    </label>
                  </>
                )}
              />
            </div>
          </div>
          {/* Save and Cancel Buttons */}
          <div className="col-span-2 flex justify-between gap-3 mt-6">
            <button type="button" onClick={() => onClose(false)} className="flex items-center gap-1 bg-grayColor1/20 cursor-pointer text-descriptionColor hover:scale-105 transition-all duration-200 px-4 py-2 lg:py-3 lg:px-6 rounded-md text-sm font-medium">
              Cancel
            </button>
            <button disabled={loading == true} type="submit" className="text-base cursor-pointer shadow-sm hover:scale-105 transition-all duration-200 font-medium text-descriptionColor px-8 py-2 rounded-sm bg-primaryColor">
              {loading ? (initialData?.id ? "Updating..." : "Sending...") : (initialData?.id ? "Update" : "Save")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
