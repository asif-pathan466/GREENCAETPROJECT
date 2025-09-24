import React from "react";
import { useAppContext} from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {

     const {setShowUserLogin, setUser, axios, navigate} = useAppContext()

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmitHandler = async (event) => {

    try {
       event.preventDefault();

        const {data} = await axios.post(`/api/user/${state}`, {
          name, email, password
        })

        if(data.success){
          navigate('/')
          setUser(data.user)
          setShowUserLogin(false)
          //
          toast.success(data.message)
        } else {
          toast.error(data.message)
        }        
        
    } catch (error) {
      toast.error(error.message)
    }

};


  return (
    <div onClick={() => setShowUserLogin(false)} className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="relative flex flex-col gap-5 w-80 sm:w-[380px] p-8 rounded-2xl shadow-2xl border border-gray-100 bg-white">
        {/* Heading */}
        <p className="text-2xl font-bold text-center text-gray-800">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {/* Name (only for register) */}
        {state === "register" && (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter your name"
              className="border border-gray-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              type="text"
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email"
            className="border border-gray-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            type="email"
            required
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter your password"
            className="border border-gray-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            type="password"
            required
          />
        </div>

        {/* Toggle Link */}
        <p className="text-sm text-center text-gray-600">
          {state === "register" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("login")}
                className="text-primary font-medium cursor-pointer hover:underline"
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setState("register")}
                className="text-primary font-medium cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </>
          )}
        </p>

        {/* Submit Button */}
        <button className="bg-primary hover:bg-primary-dull transition text-white w-full py-2 rounded-lg shadow-md font-medium">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
