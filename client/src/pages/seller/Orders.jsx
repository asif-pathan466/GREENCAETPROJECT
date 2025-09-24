import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets, dummyOrders } from '../../assets/assets'
import toast from 'react-hot-toast'

const Orders = () => {
  const { currency, axios } = useAppContext()
  const [orders, setOrders] = useState([])

  const fetchOrders = async () => {
   
    try {
      const {data} = await axios.get('/api/order/seller')

      if(data.success){
        setOrders(data.orders)
      } else{
        toast.error(data.message) 
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="no-scrollbar flex-1 h-[95vh] bg-gray-50">
      <div className="md:p-10 p-4 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">📦 Orders List</h2>

        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white shadow-md hover:shadow-lg transition rounded-xl border border-gray-200 p-5 flex flex-col gap-5 md:grid md:grid-cols-4 md:items-center"
          >
            {/* Items Section */}
            <div className="flex gap-4 items-start">
              <img
                className="w-14 h-14 object-cover rounded-md bg-gray-100 p-2"
                src={assets.box_icon}
                alt="boxIcon"
              />
              <div>
                {order.items.map((item, idx) => (
                  <p key={idx} className="font-medium text-gray-700">
                    {item.product.name}{' '}
                    <span className="text-primary font-semibold">x {item.quantity}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="text-sm text-gray-600 leading-relaxed">
              <p className="text-gray-800 font-medium">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>
                {order.address.street}, {order.address.city}
              </p>
              <p>
                {order.address.state}, {order.address.zipcode}, {order.address.country}
              </p>
              <p className="text-gray-500">📞 {order.address.phone}</p>
            </div>

            {/* Amount */}
            <div className="flex flex-col justify-center items-start md:items-center">
              <p className="text-lg font-bold text-gray-800">
                {currency}
                {order.amount}
              </p>
              <span
                className={`px-2 py-1 text-xs rounded mt-1 ${
                  order.isPaid ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}
              >
                {order.isPaid ? 'Paid' : 'Pending'}
              </span>
            </div>

            {/* Payment & Date */}
            <div className="flex flex-col gap-1 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-700">Method:</span> {order.paymentType}
              </p>
              <p>
                <span className="font-medium text-gray-700">Date:</span>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
