import React from 'react';
import ChoseUsCardfst from '../reusable/ChoseUsCardfst';
import image from '@/public/image/choose/img1.png'
import ChoseUsCard2nd from '../reusable/ChoseUsCard2nd';
import image2 from '@/public/image/choose/img2.png'
import image3 from '@/public/image/choose/img3.png'
import image4 from '@/public/image/choose/img4.png'
import image5 from '@/public/image/choose/img5.png'

export default function WhyChooseUs() {
    return (
        <div className="container p-4 ">
            <h2 className="text-3xl font-bold mb-14 text-center">Why Choose Us</h2>
            <div className='space-y-20 md:space-y-10'>
                <ChoseUsCardfst
                    imageWidth={1000}
                    imageHeight={1000}
                    imageSrc={image.src}
                    imageClassName=" md:w-[550px]"
                    title="Automated Gift Scheduling"
                    description="Easily manage important dates by signing up and adding contacts. Automate your gift scheduling and never miss a special occasion again."
                    buttonText="Sign Up"
                // onClick={() => alert("Redirect to sign up!")}
                />
                <ChoseUsCard2nd
                    imageWidth={1000}
                    imageHeight={1000}
                    imageSrc={image2.src}
                    imageClassName=" md:w-[550px]"
                    title="Customizable Gift Cards"
                    description="Choose the perfect gift with customizable options. Select the amount, add a personal message, and choose a theme to make every gift unique"
                    buttonText="Sign Up"
                // onClick={() => alert("Redirect to sign up!")}
                />

                <ChoseUsCardfst
                    imageWidth={1000}
                    imageHeight={1000}
                    imageSrc={image3.src}
                    imageClassName=" md:w-[550px]"
                    title="Secure Payments"
                    description="Make payments with confidence using our secure and trusted methods. We offer easy transactions through credit cards, debit cards, and PayPal."
                    buttonText="Sign Up"
                // onClick={() => alert("Redirect to sign up!")}
                />

                <ChoseUsCard2nd
                    imageWidth={1000}
                    imageHeight={1000}
                    imageSrc={image4.src}
                    imageClassName=" md:w-[550px]"
                    title="SMS/Email Reminders"
                    description="Receive timely reminders via SMS or email, so you never forget an important occasion. We’ll notify you before every gift is due to be sent."
                    buttonText="Sign Up"
                // onClick={() => alert("Redirect to sign up!")}
                />

                <ChoseUsCardfst
                    imageWidth={1000}
                    imageHeight={1000}
                    imageSrc={image5.src}
                    imageClassName=" md:w-[550px]"
                    title="Facebook Sync"
                    description="Effortlessly sync birthdays and important events directly from Facebook, keeping your contact list updated automatically. "
                    buttonText="Sign Up"
                // onClick={() => alert("Redirect to sign up!")}
                />s
            </div>
        </div>
    );
}
