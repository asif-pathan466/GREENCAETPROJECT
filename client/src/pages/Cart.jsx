import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    products,
    currency,
    cartItem,
    removeCartItem,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    axios,
    user,
    setCartItem,
  } = useAppContext();

  const [showAddress, setShowAddress] = useState(false);
  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectAddress, setSelectAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [loading, setLoading] = useState(false);

  // ✅ Create safe copy instead of mutating product object
  const getCart = () => {
    const tempArray = [];
    for (const key in cartItem) {
      const product = products.find((item) => item._id === key);
      if (product) {
        tempArray.push({ ...product, quantity: cartItem[key] });
      }
    }
    setCartArray(tempArray);
  };

  // ✅ Fetch user addresses
  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) setSelectAddress(data.addresses[0]);
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to load address");
    }
  };

  // ✅ Place order
  const placeOrder = async () => {
    if (!selectAddress) return toast.error("Please select an address");

    setLoading(true);
    try {
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items: cartArray.map((item) => ({ productId: item._id, quantity: item.quantity })),
          address: selectAddress._id,
        });
        if (data.success) {
          toast.success(data.message);
          setCartItem({});
          navigate("/my-orders");
        } else toast.error(data.message);
      } else {
        const { data } = await axios.post("/api/order/stripe", {
          items: cartArray.map((item) => ({ productId: item._id, quantity: item.quantity })),
          address: selectAddress._id,
        });
        if (data.success && data.url) window.location.replace(data.url);
        else toast.error(data.message || "Failed to initiate payment");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItem) getCart();
  }, [products, cartItem]);

  useEffect(() => {
    if (user) getUserAddress();
  }, [user]);

  if (!products.length || !cartItem) return null;

  // ✅ Pre-calculate values
  const cartAmount = getCartAmount();
  const tax = cartAmount * 0.02;
  const total = cartAmount + tax;

  return (
    
    <div className="flex flex-col md:flex-row mt-16">
      {/* LEFT SIDE - CART ITEMS */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(`/product/${product.category.toLowerCase()}/${product._id}`);
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>
                    Weight: <span>{product.weight || "N/A"}</span>
                  </p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      onChange={(e) => updateCartItem(product._id, Number(e.target.value))}
                      value={cartItem[product._id]}
                      className="outline-none"
                    >
                      {Array.from({ length: Math.max(cartItem[product._id] || 1, 10) }, (_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">
              {currency}
              {(product.offerPrice * product.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeCartItem(product._id)}
              className="cursor-pointer mx-auto"
            >
              <img
                src={assets.remove_icon}
                alt="remove"
                className="inline-block h-6 w-6"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate("/product");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
        >
          <img
            src={assets.arrow_right_icon_colored}
            alt="arrow"
            className="group-hover:-translate-x-1 transition"
          />
          Continue Shopping
        </button>
      </div>

      {/* RIGHT SIDE - ORDER SUMMARY */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectAddress
                ? `${selectAddress.street}, ${selectAddress.city}, ${selectAddress.state}, ${selectAddress.country}`
                : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary hover:underline cursor-pointer"
            >
              Change
            </button>

            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-50">
                {addresses.map((address, idx) => (
                  <p
                    key={idx}
                    onClick={() => {
                      setSelectAddress(address);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {address.street}, {address.state}, {address.country}, {address.city}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-primary-500 text-center cursor-pointer p-2 hover:bg-primary-dull/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {cartAmount.toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {tax.toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>
              {currency}
              {total.toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          disabled={loading}
          className={`w-full py-3 mt-6 cursor-pointer font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary-dull"
          }`}
        >
          {loading
            ? "Processing..."
            : paymentOption === "COD"
            ? "Place Order"
            : "Proceed To Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;