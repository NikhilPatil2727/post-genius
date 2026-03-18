import { SignUp } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6 text-center">
          <span className="text-3xl">Welcome! to </span>
          <span className="text-3xl sm:text-4xl font-black tracking-tighter text-neutral-900 dark:text-white leading-none">
            Post<span className="text-blue-600">Bloom</span>
          </span>
        </h1>
        <p className="text-sm sm:text-lg mb-4 font-semibold text-gray-300 text-center px-2">
          Please sign up to continue. If you already have an account, you can
          sign in.
        </p>
        <div className="mt-4 sm:mt-6 w-full flex justify-center">
          <SignUp />
        </div>
      </div>
    </div>
  );
};

export default Page;