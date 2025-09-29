import React, { useEffect, useState } from "react";
import axios from "axios";

function ClientSupport() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem("dashboardDarkMode") === "true";
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (!message || message.length < 10) {
      setError("Please enter a message with at least 10 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api_v1/support/contact",
        { email, message },
        { withCredentials: true }
      );
      if (res.data?.message === "Message sent successfully.") {
        setSubmitted(true);
        setMessage("");
        setEmail("");
      } else {
        setError(
          res.data?.message || "Failed to send message. Please try again."
        );
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to send message. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <div className='max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow min-h-[60vh] flex flex-col justify-center'>
      <h1 className='text-2xl font-bold mb-4 text-gray-900 dark:text-yellow-100 text-center'>
        Customer Support
      </h1>
      <p className='mb-6 text-gray-700 dark:text-yellow-100 text-center'>
        Need help? Fill out the form below and our support team will get back to
        you as soon as possible.
      </p>
      {submitted ? (
        <div className='text-green-600 dark:text-green-400 text-center font-semibold'>
          Thank you! Your message has been sent. Our support team will contact
          you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='space-y-4'>
          {error && (
            <div className='text-red-500 dark:text-red-400 text-center font-semibold'>
              {error}
            </div>
          )}
          <div>
            <label className='block mb-1 font-semibold text-gray-800 dark:text-yellow-100'>
              Your Email
            </label>
            <input
              type='email'
              className='w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='you@example.com'
              autoComplete='email'
            />
          </div>
          <div>
            <label className='block mb-1 font-semibold text-gray-800 dark:text-yellow-100'>
              Message
            </label>
            <textarea
              className='w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
              placeholder='Describe your issue or question...'
            />
          </div>
          <button
            type='submit'
            className='w-full py-2 px-4 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition-colors'
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
      <div className='mt-8 text-center text-gray-500 dark:text-yellow-100 text-sm'>
        Or email us directly at{" "}
        <a
          href='mailto:i08690199@gmail.com'
          className='text-yellow-600 dark:text-yellow-300 underline'
        >
          i08690199@gmail.com
        </a>
      </div>
    </div>
  );
}

export default ClientSupport;
