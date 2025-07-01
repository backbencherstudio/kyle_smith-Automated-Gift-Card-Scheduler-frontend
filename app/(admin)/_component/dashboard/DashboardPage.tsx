
import { UserService } from '@/service/user/user.service'
import { cookies } from 'next/headers'
import NewUserChart from '../Chart/LineChart'
import UpcomingGift from '../Chart/UpcomingGift'
import RecentOrderTable from './RecentOrderTable'
import StatCards from './StatCards'

async function DashboardPage() {
  const endpoint = `/admin-dashboard/overview`
  const cookieStore = await cookies();
  const token = cookieStore.get("token").value;
  const dashboardData = await UserService?.getData(token, endpoint)

  return (
    <div className='flex flex-col justify-between h-full'>
      <StatCards sateData={dashboardData.metrics} />

      <div className=' grid grid-cols-1 gap-6 lg:grid-cols-2 my-4'>
        <NewUserChart />
        <UpcomingGift giftData={dashboardData?.upcoming_gifts} />
      </div>
      <div className=' '>
        <RecentOrderTable userData={dashboardData?.recent_activity} />
      </div>
    </div>
  )
}

export default DashboardPage
