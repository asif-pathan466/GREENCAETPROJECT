import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!email || !password) return toast.error("Please enter email and password");
    setLoading(true);
    try {
      const { data } = await axios.post('/api/seller/login', { email, password });

      if (data.success) {
        setIsSeller(true);
        toast.success("Logged in successfully!");
        navigate("/seller");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSeller) navigate("/seller"); // redirect if already logged in
  }, [isSeller, navigate]);

  if (isSeller) return null; // hide login form if already logged in

  return (
    <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center text-sm text-gray-600">
      <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">Seller</span> Login
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-primary text-white w-full py-2 rounded-md cursor-pointer ${loading ? "opacity-50" : ""}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
};

export default SellerLogin;
