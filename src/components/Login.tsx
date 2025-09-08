import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface LoginProps {
  open: boolean;
  onClose: () => void;
}

export default function Login({ open, onClose }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  if (!open) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='relative  rounded-lg shadow-lg w-full max-w-xl mx-auto flex'>
        <div className='p-8 bg-yellow-400'>
          <h2 className='text-2xl font-bold mb-2'>Login</h2>
          <div className='text-sm text-muted-foreground'>
            Get access to your Orders, Wishlist and Recommendations.
          </div>
        </div>
        <div className='relative bg-white p-8 w-full '>
          <button
            onClick={onClose}
            className='absolute top-2 right-2 text-black hover:text-gray-600 text-xl font-bold focus:outline-none'
            aria-label='Close login dialog'
          >
            ×
          </button>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Enter Username/Email address'
                required
              />
            </div>
            <div>
              <Input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter Password'
                required
              />
            </div>
            <div className='flex items-center justify-between'>
              <label className='flex items-center gap-2 text-sm'>
                <Checkbox
                  checked={remember}
                  onCheckedChange={(v) => setRemember(!!v)}
                />
                Remember me
              </label>
              <button
                type='button'
                className='text-xs text-primary hover:underline bg-transparent border-0 p-0'
              >
                Lost your password?
              </button>
            </div>
            <Button
              type='submit'
              className='w-full mt-2 bg-black text-yellow-400'
            >
              Log in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
