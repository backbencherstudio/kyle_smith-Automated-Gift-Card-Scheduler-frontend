import Banner from '@/components/home/Banner'
import Celebration from '@/components/home/Celebration'
import Contact from '@/components/home/Contact'
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
      <Contact />
    </div>
  )
}

export default HomePage
