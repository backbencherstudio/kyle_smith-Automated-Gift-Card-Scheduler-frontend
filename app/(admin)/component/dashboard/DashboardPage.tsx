

import { RevenueLineChart } from '../Chart/LineChart'
import UpcomingGift from '../Chart/UpcomingGift'
import StatCards from './StatCards'

function DashboardPage() {
  return (
    <div className='flex flex-col justify-between h-full'>
      <h2 className='lg:text-2xl text-lg md:text-xl font-bold text-black mb-4 lg:mb-6'>Dashboard</h2>
      <StatCards/> 

      <div className=' grid grid-cols-1 gap-6 lg:grid-cols-2 my-4'>
        <RevenueLineChart/>
        <UpcomingGift/>
      </div>
      <div className=' '>
      {/* <RecentOrderTable/> */}
      </div>
    </div>
  )
}

export default DashboardPage
