import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Notify } from "notiflix";

// close button
interface SignupProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function Signup({
  open,
  onClose,
  onSwitchToLogin,
}: SignupProps) {
  const [show, setShow] = useState(open);
  const [animate, setAnimate] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormData>();

  // toggle signup dialog
  useEffect(() => {
    if (open) {
      setShow(true);
      setTimeout(() => setAnimate(true), 10);
    } else if (show) {
      setAnimate(false);
      const timeout = setTimeout(() => setShow(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [open, show]);
  if (!show) return null;

  interface FormData {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
    userRole: string;
  }

  const onRegister = async (data: FormData) => {
    try {
      const { username, email, password, confirmPassword } = data;
      const formData = new FormData();

      formData.append("firstname", data.firstname);
      formData.append("lastname", data.lastname);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("userRole", data.userRole);
      // formData.append("confirmPassword", confirmPassword);

      const response = await axios.post(
        "http://localhost:5000/api_v1/user/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Notify.success("Registration Successful");
      reset();
      onSwitchToLogin();
    } catch (error) {
      Notify.failure("Registration Failed");
      reset();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
        animate ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative rounded-lg shadow-lg w-full max-w-xl mx-auto flex flex-col md:flex-row transform transition-all duration-300 ${
          animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className='p-6 md:p-8 bg-yellow-400 w-full md:w-1/2 flex-shrink-0'>
          <h2 className='text-2xl md:text-3xl font-bold mb-2'>Sign Up</h2>
          <div className='text-sm md:text-base text-black w-full pt-4 md:pt-6'>
            Create an account to access your orders, wishlist and
            recommendations.
          </div>
        </div>
        <div className='relative bg-white p-6 md:p-8 w-full'>
          <button
            onClick={onClose}
            className='fixed md:absolute top-0 right-2 z-50 text-black hover:text-gray-600 text-2xl font-bold focus:outline-none bg-transparent border-0 p-0'
            aria-label='Close signup dialog'
          >
            ×
          </button>

          {/* Form section */}
          <form
            className='space-y-4 flex flex-wrap'
            onSubmit={handleSubmit(onRegister)}
          >
            <div>
              <input
                className='outline-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent'
                type='text'
                placeholder='Username'
                required
                {...register("username", {
                  required: true,
                  maxLength: 20,
                  minLength: 3,
                })}
              />
            </div>
            <div>
              <input
                className='outline-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent'
                type='text'
                placeholder='First Name'
                required
                {...register("firstname", { required: true })}
              />
            </div>
            <div>
              <input
                className='outline-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent'
                type='text'
                placeholder='Last Name'
                required
                {...register("lastname", { required: true })}
              />
            </div>
            <div>
              <input
                className='outline-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent'
                type='email'
                placeholder='Email address'
                required
                {...register("email", { required: true })}
              />
            </div>
            <div>
              <input
                className='outline-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent'
                type='password'
                placeholder='Password'
                required
                {...register("password", { required: true })}
              />
            </div>
            <div>
              <input
                className='outline-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent'
                type='password'
                placeholder='Confirm Password'
                required
                {...register("confirmPassword", { required: true })}
              />
            </div>
            <select
              className='outline-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent'
              name='userRole'
              {...register("userRole", { required: true })}
            >
              <option value='user'>Customer</option>
              <option value='admin'>Admin</option>
            </select>
            <button
              type='submit'
              className='w-full mt-2 bg-black text-yellow-400 hover:bg-gray-800 hover:text-white'
            >
              Sign Up
            </button>
            <div className='text-center pt-2'>
              <span className='text-sm'>Already have an account? </span>
              <button
                type='button'
                className='text-primary font-bold hover:underline bg-transparent border-0 p-0 text-sm'
                onClick={onSwitchToLogin}
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
