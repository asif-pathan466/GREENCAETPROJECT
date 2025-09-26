import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div className="relative w-full">
      {/* Background Images */}
      <img
        src={assets.main_banner_bg}
        alt="banner"
        className="w-full hidden md:block object-cover"
      />
      <img
        src={assets.main_banner_bg_sm}
        alt="banner"
        className="w-full md:hidden object-cover"
      />

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col items-center md:items-start justify-center 
        px-4 sm:px-8 md:px-16 lg:px-24 text-center md:text-left"
      >
        {/* Title */}
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 
          font-bold leading-tight max-w-md md:max-w-lg lg:max-w-2xl text-gray-900"
        >
          Freshness you can trust, <br className="hidden sm:block" />
          savings you will love
        </h1>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 font-medium">
          {/* Shop Now (Primary) */}
          <Link
            to="/product"
            className="group flex items-center gap-2 px-6 sm:px-8 py-3 
            bg-primary hover:bg-primary-dull transition rounded-full 
            text-white shadow-md"
          >
            Shop Now
            <img
              className="transition group-hover:translate-x-1 w-4 h-4"
              src={assets.white_arrow_icon}
              alt="arrow"
            />
          </Link>

          {/* Explore Deals (Secondary) */}
          <Link
            to="/product"
            className="group flex items-center gap-2 px-6 sm:px-8 py-3 
            bg-white hover:bg-gray-100 transition rounded-full shadow 
            text-gray-800"
          >
            Explore Deals
            <img
              className="transition group-hover:translate-x-1 w-4 h-4"
              src={assets.black_arrow_icon}
              alt="arrow"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MainBanner
