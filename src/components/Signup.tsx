import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import axios from "axios";
import { register } from "module";

// const RegistrationForm = () => {

// };
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
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [show, setShow] = useState(open);
  const [animate, setAnimate] = useState(false);
  const { register, handleSubmit } = useForm<FormData>();

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
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const onRegister = async (data: FormData) => {
    try {
      const { username, email, password, confirmPassword } = data;
      const formData = new FormData();

      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);

      const response = await axios.post(
        "http://localhost:5000/api_v1/user/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log("Registration Failed", error);
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
            Create an account to access your Orders, Wishlist and
            Recommendations.
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
          <form className='space-y-4' onSubmit={handleSubmit(onRegister)}>
            <div>
              <input
                type='text'
                onChange={(e) => setUsername(e.target.value)}
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
                type='email'
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email address'
                required
                {...register("email", { required: true })}
              />
            </div>
            <div>
              <input
                type='password'
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                required
                {...register("password", { required: true })}
              />
            </div>
            <div>
              <input
                type='password'
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Confirm Password'
                required
                {...register("confirmPassword", { required: true })}
              />
            </div>
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
