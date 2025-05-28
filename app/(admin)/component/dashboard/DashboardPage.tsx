
import { HomeBarChart } from '../Chart/BarChart'
import { RevenueLineChart } from '../Chart/LineChart'
import StatCards from './StatCards'

function DashboardPage() {
  return (
    <div className='flex flex-col justify-between h-full'>
      <StatCards/> 

      <div className=' grid grid-cols-1 gap-6 lg:grid-cols-2 my-4'>
        <RevenueLineChart/>
        <HomeBarChart/>
      </div>
      <div className=' '>
      {/* <RecentOrderTable/> */}
      </div>
    </div>
  )
}

export default DashboardPage
