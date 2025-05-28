

import { RevenueLineChart } from '../Chart/LineChart'
import UpcomingGift from '../Chart/UpcomingGift'
import RecentOrderTable from './RecentOrderTable'
import StatCards from './StatCards'

function DashboardPage() {
  return (
    <div className='flex flex-col justify-between h-full'>
     
      <StatCards/> 

      <div className=' grid grid-cols-1 gap-6 lg:grid-cols-2 my-4'>
        <RevenueLineChart/>
        <UpcomingGift/>
      </div>
      <div className=' '>
      <RecentOrderTable/>
      </div>
    </div>
  )
}

export default DashboardPage
