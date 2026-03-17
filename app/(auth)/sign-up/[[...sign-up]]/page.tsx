import { SignUp } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 p-4">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="flex flex-col items-center mb-6 transition-all hover:scale-105 duration-300">
          <span className="text-4xl font-black tracking-tighter text-neutral-900 dark:text-white leading-none">
            Post<span className="text-blue-600">Bloom</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.4em] text-blue-600/60 dark:text-blue-400/60 font-black mt-2">
            Intelligence
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Join PostBloom</h1>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-sm font-medium">
          Create your account to start generating platform-optimized content in seconds.
        </p>
      </div>
      <div>
        <SignUp />
      </div>
    </div>
  );
};

export default Page;
