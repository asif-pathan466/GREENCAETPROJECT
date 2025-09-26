import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItem, setCartItem] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // ✅ should be string, not {}

  // ✅ fetch seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    }
  };

  // ✅ fetch user auth status (user data + cart)
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItem(data.user.cartItem || {});
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  // ✅ fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ add product to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItem);
    cartData[itemId] = (cartData[itemId] || 0) + 1;

    setCartItem(cartData);
    toast.success("Added to cart");
  };

  // ✅ update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItem);
    if (quantity > 0) {
      cartData[itemId] = quantity;
    } else {
      delete cartData[itemId];
    }
    setCartItem(cartData);
    toast.success("Cart updated");
  };

  // ✅ remove item from cart
  const removeCartItem = (itemId) => {
    let cartData = structuredClone(cartItem);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) delete cartData[itemId];
    }
    setCartItem(cartData);
    toast.success("Removed from cart");
  };

  // ✅ get total cart count
 const getCartCount = () => {
  if (!cartItem || typeof cartItem !== "object") return 0;
  return Object.values(cartItem).reduce((sum, qty) => sum + qty, 0) || 0;
};
  // ✅ get cart total amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItem) {
      const itemInfo = products.find((p) => p._id === itemId);
      if (itemInfo) {
        totalAmount += itemInfo.offerPrice * cartItem[itemId];
      }
    }
    return Math.round(totalAmount * 100) / 100; // ✅ safe rounding
  };

  // ✅ initial fetches
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  // ✅ sync cart with DB
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", {cartItem});
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItem, user]); // ✅ also depend on `user`

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeCartItem,
    cartItem,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    setCartItem
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
