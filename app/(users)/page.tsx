import Banner from '@/components/home/Banner'
import Celebration from '@/components/home/Celebration'
import HowItWorks from '@/components/home/HowItWorks'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import React from 'react'

function HomePage() {
  return (
    <div>
      <Banner />
      <HowItWorks />
      <WhyChooseUs />
      <Celebration />
    </div>
  )
}

export default HomePage
