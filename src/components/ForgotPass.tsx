import React, { useState } from "react";
import axios from "axios";
import { Notify } from "notiflix";

interface ForgotPassProps {
  open: boolean;
  onClose: () => void;
  onOTPSent: (email: string) => void;
}

function ForgotPass({ open, onClose, onOTPSent }: ForgotPassProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      Notify.failure("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api_v1/user/forgot-password",
        { email }
      );
      if (res.data?.message) {
        Notify.success(res.data.message);
        onOTPSent(email);
      } else {
        Notify.failure("Unexpected response from server.");
      }
    } catch (err) {
      Notify.failure(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to send OTP. Please try again."
      );
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-gray-900/80 transition-opacity duration-300'>
      <div className='relative w-full max-w-md mx-auto'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 z-50 text-black dark:text-yellow-100 hover:text-gray-600 dark:hover:text-yellow-400 text-2xl font-bold focus:outline-none bg-transparent border-0 p-0'
          aria-label='Close forgot password dialog'
        >
          ×
        </button>
        <div className='p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg'>
          <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-yellow-100 text-center'>
            Forgot Password
          </h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <label className='block font-semibold text-gray-800 dark:text-yellow-100'>
              Email:
              <input
                type='email'
                name='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='mt-2 w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                autoComplete='email'
                placeholder='Enter your email'
              />
            </label>
            <button
              type='submit'
              className='w-full py-2 px-4 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition-colors'
              disabled={loading}
            >
              {loading ? "Sending..." : "Reset Password"}
            </button>
            <button
              type='button'
              className='w-full mt-2 py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-yellow-100 font-semibold rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors'
              onClick={onClose}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPass;
