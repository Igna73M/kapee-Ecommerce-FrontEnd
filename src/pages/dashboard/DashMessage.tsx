import { useEffect, useState } from "react";
import axios from "axios";
import { Notify } from "notiflix";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const DashMessage = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  const fetchMessages = async () => {
    setLoading(true);
    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      Notify.failure("You must be logged in as admin to view messages.");
      setMessages([]);
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/support/messages`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      setMessages(Array.isArray(res.data) ? res.data : []);
      Notify.success("Contact messages loaded.");
    } catch (err) {
      Notify.failure(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch contact messages. Please try again."
      );
      setMessages([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, []);

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6 text-gray-900 dark:text-yellow-100'>
        Contact Messages
      </h1>
      {loading ? (
        <div className='text-center text-muted-foreground dark:text-yellow-100 py-16'>
          Loading messages...
        </div>
      ) : messages.length === 0 ? (
        <div className='text-center text-muted-foreground dark:text-yellow-100 py-16'>
          No contact messages found.
          <br />
          <button
            className='mt-4 px-4 py-2 bg-primary text-primary-foreground dark:bg-yellow-500 dark:text-gray-900 rounded hover:bg-primary/90 dark:hover:bg-yellow-400'
            onClick={fetchMessages}
            type='button'
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className='mb-4 text-sm text-gray-700 dark:text-yellow-100'>
            Showing {messages.length} message{messages.length > 1 ? "s" : ""}
          </div>
          <div className='space-y-6'>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className='bg-white dark:bg-gray-800 rounded-lg shadow p-4 border dark:border-yellow-600'
                tabIndex={0}
                aria-label={`Message from ${msg.name} (${msg.email})`}
              >
                <div className='font-semibold text-gray-900 dark:text-yellow-100'>
                  {msg.name} ({msg.email})
                </div>
                <div className='text-sm text-muted-foreground dark:text-yellow-100 mt-2'>
                  {msg.message}
                </div>
                <div className='text-xs text-gray-500 dark:text-yellow-400 mt-2'>
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DashMessage;
