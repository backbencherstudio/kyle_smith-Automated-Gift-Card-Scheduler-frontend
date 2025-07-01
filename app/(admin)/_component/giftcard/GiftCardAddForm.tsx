import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToken } from "@/hooks/useToken";
import { UserService } from "@/service/user.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const formatDateForInput = (dateString: string) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  } catch (error) {
    return "";
  }
};

const formatDateForBackend = (dateString: string) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return date.toISOString(); // Returns full ISO string
  } catch (error) {
    return null;
  }
};

export default function GiftCardAddForm({ open, onClose, initialData, onfetch }: { open: boolean; onClose: any; initialData?: any, onfetch?: any }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      vendor_id: "",
      card_code: "",
      face_value: "",
      purchase_cost: "",
      selling_price: "",
      status: "AVAILABLE",
      purchase_date: "",
      expiry_date: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const { token } = useToken();
  const router = useRouter();
  const [vendorData, setVendorData] = useState([]);

  useEffect(() => {
    if (initialData) {
      reset({
        vendor_id: initialData.vendor_id || "",
        card_code: initialData.card_code || "",
        face_value: initialData.face_value || "",
        purchase_cost: initialData.purchase_cost || "",
        selling_price: initialData.selling_price || "",
        status: initialData.status || "AVAILABLE",
        purchase_date: initialData.purchase_date ? formatDateForInput(initialData.purchase_date) : "",
        expiry_date: initialData.expiry_date ? formatDateForInput(initialData.expiry_date) : "",
      });
    } else {
      reset({
        vendor_id: "",
        card_code: "",
        face_value: "",
        purchase_cost: "",
        selling_price: "",
        status: "AVAILABLE",
        purchase_date: "",
        expiry_date: ""
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true)

    try {
      let response;
      if (initialData?.id) {
        const updateData = {
          vendor_id: data.vendor_id,
          card_code: data.card_code,
          face_value: Number(data.face_value),
          purchase_cost: Number(data.purchase_cost),
          selling_price: Number(data.selling_price),
          status: data.status,
          purchase_date: formatDateForBackend(data.purchase_date),
          expiry_date: formatDateForBackend(data.expiry_date),
        };
        console.log(updateData);
        const endpoint = `/admin/gift-card-inventory/${initialData.id}`;
        response = await UserService.updateJsonProtectedData(token, endpoint, updateData);
      } else {
        const createData = {
          vendor_id: data.vendor_id,
          card_code: data.card_code,
          face_value: Number(data.face_value),
          purchase_cost: Number(data.purchase_cost),
          selling_price: Number(data.selling_price),
          status: data.status,
          purchase_date: formatDateForBackend(data.purchase_date),
          expiry_date: formatDateForBackend(data.expiry_date),
        };
        const endpoint = `/admin/gift-card-inventory`;
        response = await UserService.createData(token, endpoint, createData);
      }

      if (response?.data?.success == true) {
        toast.success(initialData?.id ? "Gift card updated successfully" : "Successfully Added New Gift Card");
        reset();
        router.replace("/dashboard/add-giftcard")
        onfetch()
        onClose(false)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false)
    }
  };

  const fetchVendor = async () => {
    setLoading(true);
    try {
      const endpoint = `/admin/vendor`;
      const res = await UserService.getData(token, endpoint);
      const result = res;
      setVendorData(result?.data || []);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching vendor data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor()
  }, [token]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="lg:!max-w-[800px] !max-w-[90vw] h-[90vh] md:h-auto overflow-y-auto px-6 py-6">
        <DialogHeader>
          <DialogTitle className="text-xl lg:text-2xl font-medium text-headerColor">
            {initialData?.id ? "Update Gift Card" : "Add New Gift Card"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="md:grid space-y-4 md:space-y-0 grid-cols-1 md:grid-cols-2 gap-5 items-center mt-4">
          <div className="space-y-2">
            <Label className="text-[16px] font-medium text-headerColor">Vendor Name</Label>
            <Controller
              control={control}
              name="vendor_id"
              render={({ field: { value, onChange } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger className="rounded-md w-full !h-[45px] text-[14px] text-grayColor">
                    <SelectValue placeholder="Select vendor Name" />
                  </SelectTrigger>
                  <SelectContent >
                    {vendorData?.length > 0 ? vendorData.map((vendor) => (
                      <SelectItem className="hover:!bg-primaryColor transition-all" key={vendor?.id} value={vendor?.id}>{vendor?.name}</SelectItem>
                    )) : "Not found vendor id"}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.vendor_id && <span className="text-red-500 text-sm">{(errors.vendor_id.message).toString()}</span>}
          </div>

          <div className="space-y-2">
            <Label className="text-[16px] font-medium text-headerColor">Card Code</Label>
            <Input
              {...register("card_code", { required: "Card code is required" })}
              placeholder="Card Code"
              className="rounded-md !h-[45px] text-[14px] text-grayColor"
            />
            {errors.card_code && <span className="text-red-500 text-sm">{(errors.card_code.message).toString()}</span>}
          </div>

          <div className="space-y-2">
            <Label className="text-[16px] font-medium text-headerColor">Face Value</Label>
            <Input
              {...register("face_value", {
                required: "Face value is required",
                valueAsNumber: true
              })}
              type="number"
              placeholder="Face Value"
              className="rounded-md !h-[45px] text-[14px] text-grayColor"
            />
            {errors.face_value && <span className="text-red-500 text-sm">{(errors.face_value.message).toString()}</span>}
          </div>

          <div className="space-y-2">
            <Label className="text-[16px] font-medium text-headerColor">Purchase Cost</Label>
            <Input
              {...register("purchase_cost", {
                required: "Purchase cost is required",
                valueAsNumber: true
              })}
              type="number"
              placeholder="Purchase Cost"
              className="rounded-md !h-[45px] text-[14px] text-grayColor"
            />
            {errors.purchase_cost && <span className="text-red-500 text-sm">{(errors.purchase_cost.message).toString()}</span>}
          </div>

          <div className="space-y-2">
            <Label className="text-[16px] font-medium text-headerColor">Selling Price</Label>
            <Input
              {...register("selling_price", {
                required: "Selling price is required",
                valueAsNumber: true
              })}
              type="number"
              placeholder="Selling Price"
              className="rounded-md !h-[45px] text-[14px] text-grayColor"
            />
            {errors.selling_price && <span className="text-red-500 text-sm">{(errors.selling_price.message).toString()}</span>}
          </div>

          <div className="space-y-2">
            <Label className="text-[16px] font-medium text-headerColor">Status</Label>
            <Controller
              control={control}
              name="status"
              rules={{
                required: "Status is required",
                validate: (value) => {
                  const validStatuses = ["AVAILABLE", "USED", "EXPIRED", "RESERVED"];
                  if (!validStatuses.includes(value)) {
                    return "Status must be one of: AVAILABLE, USED, EXPIRED, RESERVED";
                  }
                  return true;
                }
              }}
              render={({ field: { value, onChange } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger className="rounded-md w-full !h-[45px] text-[14px] text-grayColor">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="hover:!bg-primaryColor transition-all" value="AVAILABLE">Available</SelectItem>
                    <SelectItem className="hover:!bg-primaryColor transition-all" value="USED">Used</SelectItem>
                    <SelectItem className="hover:!bg-primaryColor transition-all" value="EXPIRED">Expired</SelectItem>
                    <SelectItem className="hover:!bg-primaryColor transition-all" value="RESERVED">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && <span className="text-red-500 text-sm">{(errors.status.message).toString()}</span>}
          </div>

          {/* Other date fields */}
          <div className="space-y-2">
            <Label className="text-[16px] font-medium text-headerColor">Purchase Date</Label>
            <Input {...register("purchase_date", { required: "Purchase date is required" })} type="date" className="rounded-md !h-[45px] text-[14px] text-grayColor" />
            {errors.purchase_date && <span className="text-red-500 text-sm">{(errors.purchase_date.message).toString()}</span>}
          </div>

          <div className="space-y-2">
            <Label className="text-[16px] font-medium text-headerColor">Expiry Date</Label>
            <Input {...register("expiry_date", { required: "Expiry date is required" })} type="date" className="rounded-md !h-[45px] text-[14px] text-grayColor" />
            {errors.expiry_date && <span className="text-red-500 text-sm">{(errors.expiry_date.message).toString()}</span>}
          </div>

          {/* Save and Cancel Buttons */}
          <div className="col-span-2 flex justify-between gap-3 mt-6">
            <button type="button" onClick={() => onClose(false)} className="flex items-center gap-1 bg-grayColor1/20 cursor-pointer text-descriptionColor hover:scale-105 transition-all duration-200 px-4 py-2 lg:py-3 lg:px-6 rounded-md text-sm font-medium">
              Cancel
            </button>
            <button disabled={loading} type="submit" className="text-base cursor-pointer shadow-sm hover:scale-105 transition-all duration-200 font-medium text-descriptionColor px-8 py-2 rounded-sm bg-primaryColor">
              {loading ? (initialData?.id ? "Updating..." : "Sending...") : (initialData?.id ? "Update" : "Save")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
