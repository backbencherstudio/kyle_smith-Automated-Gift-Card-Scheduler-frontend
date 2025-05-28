import ContactInfoSection from "./ContactInfoSection"

function ProfileDetails() {
  return (
    <section className=' grid grid-cols-1 md:grid-cols-2 gap-6'>
       <div className="py-6 px-5 bg-whiteColor rounded-xl">
        <h4 className='text-headerColor text-lg font-semibold '> About Us</h4>
        <p className="text-base text-pragaraphColor leading-[140%] pt-2">We believe that keeping your car clean should be effortless, affordable, and eco-conscious. Founded with a passion for quality service and convenience, we’ve redefined the traditional car wash experience by introducing a seamless, subscription-based model that puts your time and comfort first.</p>
        <p className="text-base text-pragaraphColor leading-[140%] pt-2">Our team of experienced technicians is trained to provide both instant and scheduled services, all tailored to fit your lifestyle. Using high-quality products and modern techniques, we ensure a sparkling finish without harming your car or the environment.</p>
       </div>
       <div className="py-6 px-5 bg-whiteColor rounded-xl">
        <ContactInfoSection/>
       </div>
      
    </section>
  )
}

export default ProfileDetails
