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
import { UserService } from "@/service/user/user.service";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";


export default function VenderAddForm({ open, onClose }: { open: boolean; onClose: any }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      website: "",
      logo: null,
    },
  });
  const [loading, setLoding] = useState(false)
  const [logoName, setLogoName] = useState("");
  const { token } = useToken();
  const router = useRouter()
  const onSubmit = async (data: any) => {
    setLoding(true)
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("website", data.website);
    if (logoName) {
      formData.append("logo", data.logo);
    }
    try {
      const response = await UserService.addVendore(formData, token);
      if (response?.data?.success == true) {
        toast.success("Successfully Add New Vendor")
        reset();
        router.replace("/dashboard/add-vendor")
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
          <DialogTitle className="text-xl lg:text-2xl font-medium text-headerColor">Add New Vendor</DialogTitle>
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
                  required
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
                  <p className="text-sm font-medium text-gray-700">{logoName}</p>
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
          {/* Save and Cancel Buttons */}
          <div className="col-span-2 flex justify-between gap-3 mt-6">
            <button type="button" onClick={() => onClose(false)} className="flex items-center gap-1 bg-grayColor1/20 cursor-pointer text-descriptionColor px-4 py-2 lg:py-3 lg:px-6 rounded-md text-sm font-medium">
              Cancel
            </button>
            <button disabled={loading == true} type="submit" className="flex disabled:cursor-not-allowed items-center disabled:bg-primary/50  gap-1 bg-primaryColor cursor-pointer text-white px-4 py-2 lg:py-3 lg:px-6 rounded-md text-sm font-medium">
              {loading ? "Sending..." : "Save"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
