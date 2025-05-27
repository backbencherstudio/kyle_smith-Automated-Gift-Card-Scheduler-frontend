import Image from 'next/image'

function UserNID() {
  return (
    <div>
      <h4 className='text-headerColor text-lg font-semibold  mb-2'>Licences</h4>
      <div className=' grid grid-cols-1 md:grid-cols-2 gap-6 '>
         <Image  src="/image/nid1.png" alt='NID' width={600} height={400} className=' w-full  rounded-md' />
         <Image  src="/image/nid2.png" alt='NID' width={600} height={400} className=' w-full  rounded-md' />
      </div>
    </div>
  )
}

export default UserNID
