import ContactInfoSection from "./ContactInfoSection"

interface ProfileDetailsProps {
  userData: {
    email: string;
    phone: string;
    location: string;
    aboutUs: string;
  };
}

function ProfileDetails({ userData }: ProfileDetailsProps) {
  // Split the aboutUs text into two paragraphs
  const [firstPara, secondPara] = userData.aboutUs.split("With just a few clicks");

  return (
    <section className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <div className="py-6 px-5 bg-whiteColor rounded-xl">
        <h4 className='text-headerColor text-lg font-semibold'> About Us</h4>
        <p className="text-base text-pragaraphColor leading-[140%] pt-2">
          {firstPara}
        </p>
        <p className="text-base text-pragaraphColor leading-[140%] mt-4">
          With just a few clicks{secondPara}
        </p>
      </div>
      <div className="py-6 px-5 bg-whiteColor rounded-xl">
        <ContactInfoSection 
          email={userData.email}
          phone={userData.phone}
          address={userData.location}
        />
      </div>
    </section>
  )
}

export default ProfileDetails
