import React from 'react'
import Navbar from './component/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
// If your file really is `Fotter.js` keep it; otherwise change to Footer
import Fotter from './component/Fotter'
import Login from './component/Login'
import { useAppContext } from './context/AppContext'
import AllProduct from './pages/AllProduct'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrders from './pages/MyOrders'
import SellerLogin from './component/seller/SellerLogin'
import SellerLayout from './pages/seller/SellerLayout'
import AddProduct from './pages/seller/AddProduct'
import ProductList from './pages/seller/ProductList'
import Orders from './pages/seller/Orders'
import Loading from './component/Loading'

const App = () => {
  const isSellerPath = useLocation().pathname.includes('seller')
  const { showUserLogin, isSeller } = useAppContext()

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Login />}

      <Toaster />

      <div className={`${isSellerPath ? '' : 'px-6 md:px-16 lg:px-24 xl:px-32'}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/product' element={<AllProduct />} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
           <Route path='/my-orders' element={<MyOrders />} />
            <Route path='/loader' element={<Loading />} />
           <Route path='seller' element={isSeller ? <SellerLayout /> : <SellerLogin />}>
           <Route index element={isSeller ? <AddProduct /> : null} />

          <Route path='product-list' element={<ProductList />} />

           <Route path='orders' element={<Orders />} />

           </Route>
        </Routes>
      </div>

      {!isSellerPath && <Fotter />}
    </div>
  )
}

export default App
