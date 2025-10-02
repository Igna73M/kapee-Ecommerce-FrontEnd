import React, { useState } from "react";
import axios from "axios";
import { Notify } from "notiflix";

function ResetPass() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      Notify.failure("All fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      Notify.failure("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Notify.failure("New password and confirm password do not match.");
      return;
    }
    setLoading(true);
    try {
      const accessToken = getCookie("accessToken");
      const res = await axios.post(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/user/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      if (res.data?.message) {
        Notify.success(res.data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Notify.failure("Unexpected response from server.");
      }
    } catch (err) {
      Notify.failure(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to change password. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <div className='max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow'>
      <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-yellow-100 text-center'>
        Change Password
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <label className='block font-semibold text-gray-800 dark:text-yellow-100'>
          Current Password:
          <input
            type='password'
            name='currentPassword'
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className='mt-2 w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
            placeholder='Enter current password'
          />
        </label>
        <label className='block font-semibold text-gray-800 dark:text-yellow-100'>
          New Password:
          <input
            type='password'
            name='newPassword'
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className='mt-2 w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
            placeholder='Enter new password'
          />
        </label>
        <label className='block font-semibold text-gray-800 dark:text-yellow-100'>
          Confirm Password:
          <input
            type='password'
            name='confirmPassword'
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='mt-2 w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
            placeholder='Confirm new password'
          />
        </label>
        <button
          type='submit'
          className='w-full py-2 px-4 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition-colors'
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPass;
