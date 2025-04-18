"use client";

import React, { FormEvent, useState } from "react";
import { roastUserAction } from "@/actions/action";
import Image from "next/image";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  interface RoastData {
    user: {
      login: any;
      name: any;
      bio: any;
      avatar_url: any;
      public_repos: any;
      followers: any;
      following: any;
      stars: number;
      location: any;
    };
    roast: string | undefined;
    devTraits: {
      commitEnergy: number;
      starPower: number;
    };
  }

  const [data, setData] = useState<RoastData | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const formData = new FormData(e.currentTarget);
      const res = await roastUserAction(formData);

      if (!res?.success) {
        return console.log(res);
      }
      
      setData(res?.data)
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-start px-6 py-12 bg-background text-foreground">
      {/* Intro */}
      <section className="max-w-2xl text-center my-10">
        <span className='flex items-center justify-center gap-1'>
          <Image src='/bread.png' alt="logo" width={55} height={55} />
          <h1 className="text-3xl md:text-5xl font-bold tracking-wide text-white">
            DevRoastify
          </h1>
        </span>
        <p className="text-sm md:text-lg text-gray-300 mt-5">
          Drop your GitHub username and get a roast card that'll burn brighter than your last deploy failure.
        </p>
      </section>

      {/* Privacy Note */}
      <section className="max-w-md text-center text-sm text-gray-400 mb-8">
        <p>
          We only store your GitHub username and the roast card — nothing else. No stalky analytics, no creepy data mining. Just roasts, pure and spicy.
        </p>
      </section>

      {/* Input + Roast Display */}

      <form
        className="w-full max-w-md flex flex-col md:flex-row items-center gap-3"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="username"
          placeholder="Enter your GitHub username"
          className="w-full text-sm placeholder:text-sm bg-[#333333] text-white px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
        <button
          type="submit"
          className="w-full md:w-fit whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 text-sm font-medium text-white bg-[#FF5733] hover:bg-[#FFB300] transition-all duration-200 ease-in-out rounded-full shadow-lg hover:scale-105 active:scale-95 px-6 py-4"
        >
          {isLoading ? <><Image src='/bread.png' alt="logo" width={25} height={25} className="animate-spin-slow"/> roasting...</> : "Get Roast"}
        </button>
      </form>

      <section className="w-full mt-10">
        {
          isLoading
            ?
            <div className="mx-auto">
              <Image src='/bread.png' alt="logo" width={300} height={300} className="mx-auto animate-pulse" />
              <h1 className="text-center mt-5">roasting your github</h1>
            </div>
            :
            data &&

            <>
              <h3 className="text-xl font-semibold text-center">roast title</h3>
              <div className="w-full max-w-sm mx-auto rounded-3xl border-10 border-[#FF5733] p-4 text-white mt-4">
                <div className="w-full flex items-center justify-between">
                  <span className='flex items-center justify-center gap-1'>
                    <Image src='/bread.png' alt="logo" width={30} height={30} />
                    <h1 className="text-sm font-normal tracking-wide text-white">
                      DevRoastify
                    </h1>
                  </span>

                  <span className="px-3 py-0.5 font-semibold bg-blue-500 rounded-md text-sm">Rare</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <div>
                    <span className="text-xs text-center">Followers</span>
                    <h1 className="text-center font-bold text-3xl">{data?.user.followers}</h1>
                  </div>
                  <div className="rounded-full border-4 border-[#FF5733] mt-5">
                    <Image
                      src={data?.user?.avatar_url || '/bread_logo.png'}
                      alt={data?.user.login}
                      width={150}
                      height={150}
                      className="rounded-full border-4 border-white"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-center">Following</span>
                    <h1 className="text-center font-bold text-3xl">{data?.user.following}</h1>
                  </div>
                </div>
                <h2 className="text-center text-sm font-normal mt-1">@{data?.user?.login}</h2>

                <div className="w-full h-0.5 mt-2 bg-gradient-to-r from-transparent via-[#FF5733] to-transparent" />

              </div>
            </>
        }
      </section>


    </main>
  );
};

export default HomePage;
