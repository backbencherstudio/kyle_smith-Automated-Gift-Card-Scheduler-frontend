"use client";

import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import contactImg from "@/public/image/contact/contactImg.png";
import ButtonReuseable from "../reusable/ButtonReuseable";

export default function Contact() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <div className="container p-4 pt-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                {/* Left Form Section */}
                <div className="w-full md:w-1/2 space-y-4">
                    <h2 className="text-4xl font-bold text-[#1D1F2C]">Get in Touch</h2>
                    <p className="text-gray-600">
                        Please provide your email so we can contact you when we're able to
                        accommodate your request.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name and Birthday */}
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Name Input */}
                            <div className="w-full">
                                <Input
                                    className="py-5"
                                    placeholder="Enter Your Name"
                                    {...register("name", { required: "Name is required" })}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>
                                )}
                            </div>

                            {/* Custom Birthday Picker */}
                            <div className="w-full">
                                <Controller
                                    name="birthday"
                                    control={control}
                                    rules={{ required: "Birthday is required" }}
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full py-5 justify-start text-left font-normal pr-10",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value
                                                        ? format(field.value, "PPP")
                                                        : "Enter Your Birthday"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                                {errors.birthday && (
                                    <p className="text-red-500 text-sm mt-1">{errors.birthday.message as string}</p>
                                )}
                            </div>
                        </div>

                        {/* Address Input */}
                        <div className="w-full">
                            <Input
                                className="py-5"
                                placeholder="Enter Your Address"
                                {...register("address", { required: "Address is required" })}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">{errors.address.message as string}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <ButtonReuseable
                            title="Submit"
                            className="bg-[#FAD33E] w-full border border-[#FAD33E] hover:bg-white transform duration-300 px-7 py-2 text-md cursor-pointer font-semibold"
                        // onClick={() => console.log('Get Started clicked')}
                        />
                    </form>
                </div>

                {/* Right Image Section */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                    <Image
                        src={contactImg}
                        alt="Contact Image"
                        className="max-w-full h-auto rounded-xl"
                    />
                </div>
            </div>
        </div>
    );
}
