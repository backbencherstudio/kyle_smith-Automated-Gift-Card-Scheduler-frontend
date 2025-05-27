"use client"
interface UserData {
    No: number;
  orderId: string;
  userName: string;
  serviceName: string;
  serviceType: string;
  location: string;
  serviceDate: string;
  status: 'Completed' | 'Ongoing';
  }
  export const statusStyles = {
    Completed: {
      bg: 'bg-[#38c976]/10',
      border: 'outline-[#abefc6]',
      text: 'text-[#3F9917]',
      
    },
    Ongoing: {
      bg: 'bg-[#FFFCF1]',
      border: 'outline-[#ffa23a]',
      text: 'text-[#EBBB06]',
     
    },
   
  };


function BookingStatuse({ status }: { status: UserData['status'] }) {
 console.log(status);
 
    const style = statusStyles[status];
  return (
    <div className={`px-1  py-2.5 ${style.bg} rounded-sm  outline-offset-[-1px]  flex justify-center items-center gap-1`}>
      
      <div className={`text-center justify-start ${style.text} text-xs font-normal font-['Inter'] leading-3`}>
        {status}
      </div>
    </div>
  )
}

export default BookingStatuse
