import ContactInfoSection from "./ContactInfoSection"

interface ProfileDetailsProps {
  userData: {
    email: string;
    phone: string;
    location: string;
    aboutUs: string;
    name: string;
    accountType?: string;
    memberSince?: string;
  };
}

function ProfileDetails({ userData }: ProfileDetailsProps) {
  // Split the aboutUs text into two paragraphs


  return (
    <section className='grid grid-cols-1  gap-6'>
     
      <div className="py-6 px-5 bg-whiteColor rounded-xl">
        <ContactInfoSection 
          email={userData.email}
          phone={userData.phone}
          address={userData.location}
          accountType={userData.accountType}
          memberSince={userData.memberSince}
        />
      </div>
    </section>
  )
}

export default ProfileDetails
