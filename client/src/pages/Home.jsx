import React from 'react'
import MainBaner from '../component/MainBaner'
import Categories from '../component/Categories'
import BestSeller from '../component/BestSeller'
import BottomBanner from '../component/BottomBanner'
import NewsLetter from '../component/NewsLetter'

const Home = () => {
  return (
    <div className='mt-10'>
       <MainBaner />
       <Categories />
       <BestSeller />
       <BottomBanner />
       <NewsLetter />
      
    </div>
  )
}

export default Home