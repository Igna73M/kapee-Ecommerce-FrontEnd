import { useState, useEffect } from "react";
import Signup from "./Signup";
import ForgotPass from "./ForgotPass";
import VerifyOTP from "./VerifyOTP";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Notify } from "notiflix";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  open: boolean;
  onClose: () => void;
}

export default function Login({ open, onClose }: LoginProps) {
  const [show, setShow] = useState(open);
  const [animate, setAnimate] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showVerifyOTP, setShowVerifyOTP] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const { register, handleSubmit, reset } = useForm<FormData>();
  const navigate = useNavigate();

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

  if (showSignup) {
    return (
      <Signup
        open={showSignup}
        onClose={() => {
          setShowSignup(false);
          onClose();
        }}
        onSwitchToLogin={() => setShowSignup(false)}
      />
    );
  }

  if (showForgot) {
    return (
      <ForgotPass
        open={showForgot}
        onClose={() => setShowForgot(false)}
        onOTPSent={(email) => {
          setForgotEmail(email);
          setShowForgot(false);
          setShowVerifyOTP(true);
        }}
      />
    );
  }

  if (showVerifyOTP) {
    return (
      <VerifyOTP
        open={showVerifyOTP}
        email={forgotEmail}
        onClose={() => {
          setShowVerifyOTP(false);
          setShow(true);
        }}
      />
    );
  }

  if (!show) return null;

  interface FormData {
    email: string;
    password: string;
  }

  const onLogin = async (data: FormData) => {
    try {
      const { email, password } = data;
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const res = await axios.post(
        "http://localhost:5000/api_v1/user/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data && res.data.user) {
        document.cookie = `username=${res.data.user.username}; path=/`;
        document.cookie = `accessToken=${res.data.user.accessToken}; path=/`;
        document.cookie = `userRole=${res.data.user.userRole}; path=/`;

        // Send login notification email
        try {
          await axios.post(
            "http://localhost:5000/api_v1/user/send-login-email",
            {
              email: res.data.user.email,
            }
          );
        } catch (err) {
          // Optionally handle email send error, but don't block login
          console.error("Failed to send login email:", err);
        }
      }
      Notify.success("Login Successful");
      reset();
      onClose();
      setTimeout(() => {
        if (res.data && res.data.user && res.data.user.userRole === "admin") {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/client-dashboard";
        }
      }, 200);
    } catch (error) {
      Notify.failure("Login failed");
      reset();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-gray-900/80 transition-opacity duration-300 ${
        animate ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative rounded-lg shadow-lg w-full max-w-xl mx-auto flex flex-col md:flex-row transform transition-all duration-300 ${
          animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className='p-6 md:p-8 bg-yellow-400 w-full md:w-1/2 flex-shrink-0'>
          <h2 className='text-2xl md:text-3xl font-bold mb-2'>Login</h2>
          <div className='text-sm md:text-base text-black w-full pt-4 md:pt-6'>
            Get access to your Orders, Wishlist and Recommendations.
          </div>
        </div>
        <div className='relative bg-white dark:bg-gray-900 p-6 md:p-8 w-full'>
          <button
            onClick={onClose}
            className='fixed md:absolute top-0 right-2 z-50 text-black dark:text-yellow-100 hover:text-gray-600 dark:hover:text-yellow-400 text-2xl font-bold focus:outline-none bg-transparent border-0 p-0'
            aria-label='Close login dialog'
          >
            ×
          </button>
          <form className='space-y-4' onSubmit={handleSubmit(onLogin)}>
            <div>
              <input
                id='email'
                type='email'
                placeholder='Email address'
                required
                {...register("email", { required: true })}
                className='mb-2 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-yellow-100'
              />
            </div>
            <div>
              <input
                id='password'
                type='password'
                placeholder='Enter Password'
                required
                {...register("password", { required: true })}
                className='mb-2 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-yellow-100'
              />
            </div>
            <div className='flex items-center justify-between'>
              <button
                type='button'
                className='text-xs text-primary hover:underline bg-transparent border-0 p-0 font-bold'
                onClick={() => setShowForgot(true)}
              >
                Forgot your password?
              </button>
            </div>
            <button
              type='submit'
              className='w-full mt-2 bg-black dark:bg-yellow-500 text-yellow-400 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-yellow-400 hover:text-white dark:hover:text-gray-900'
            >
              Log in
            </button>
            <div className='text-center pt-2'>
              <span className='text-sm text-gray-900 dark:text-yellow-100'>
                Don't have an account?{" "}
              </span>
              <button
                type='button'
                className='text-primary dark:text-yellow-400 font-bold hover:underline bg-transparent border-0 p-0 text-sm'
                onClick={() => setShowSignup(true)}
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
