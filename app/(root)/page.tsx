"use client";

import React, { FormEvent, useState } from "react";
import { roastUserAction } from "@/actions/action";
import Image from "next/image";
import { Flame, Star, Zap } from "lucide-react";

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
    roast: { intro?: string; roast?: string; spiceLabel?: string; roastTagline?: string; spiceLevel: number } | undefined;
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
          {isLoading ? <><Image src='/bread.png' alt="logo" width={25} height={25} className="animate-spin-slow" /> roasting...</> : "Get Roast"}
        </button>
      </form>


      <section className="w-full mt-10">
        {isLoading ? (
          <div className="mx-auto">
            <Image src='/bread.png' alt="logo" width={300} height={300} className="mx-auto animate-pulse" />
            <h1 className="text-center mt-5">roasting your GitHub</h1>
          </div>
        ) : (
          data && (
            <>
              <h3 className="text-xl font-semibold text-center text-white">Your Roast</h3>


              <div className="w-full max-w-md mx-auto rounded-3xl p-6 
  bg-gradient-to-br from-[#2c1a17] via-[#3b1d1a] to-[#1c1c1c] 
  shadow-[0_4px_60px_rgba(255,87,34,0.2)] 
  border border-[#ff5722]/20 
  backdrop-blur-xl 
  space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image src="/bread.png" alt="logo" width={28} height={28} />
                    <h1 className="text-lg font-bold tracking-wide text-[#f97316]">DevRoastify</h1>
                  </div>
                  <div className="bg-[#dc2626]/20 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-[#dc2626]/30">
                    <Flame className="w-4 h-4 text-[#facc15]" />
                    {data?.roast?.spiceLabel || "Mild"}
                  </div>
                </div>

                {/* Profile Section */}
                <div className="relative flex flex-col items-center text-center bg-white/5 backdrop-blur-sm rounded-2xl p-5 shadow-inner border border-white/10">
                  <div className="relative -top-12">
                    <div className="w-28 h-28 rounded-full border-4 border-[#f97316] overflow-hidden shadow-lg">
                      <Image
                        src={data?.user?.avatar_url || "/placeholder.png"}
                        alt="profile"
                        width={112}
                        height={112}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="mt-[-2rem] mb-2">
                    <h2 className="text-2xl font-extrabold text-white">@{data?.user?.login}</h2>
                  </div>
                  <div className="flex justify-center gap-8 mt-3">
                    <div className="flex flex-col items-center">
                      <p className="text-xs text-gray-400">Followers</p>
                      <p className="text-xl font-bold text-[#facc15]">{data?.user?.followers}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-xs text-gray-400">Following</p>
                      <p className="text-xl font-bold text-[#facc15]">{data?.user?.following}</p>
                    </div>
                  </div>
                </div>

                {/* Roast Section */}
                <div className="text-center px-2">
                  <p className="text-base font-semibold italic text-[#f97316] mb-1">{data?.roast?.intro}</p>
                  <p className="text-sm text-gray-300">{data?.roast?.roast}</p>
                  <p className="mt-3 text-md font-medium italic text-[#f97316]">{data?.roast?.roastTagline}</p>
                </div>

                {/* Divider */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Stats & Spice */}
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl shadow-inner border border-white/10">

                  {/* Dev Traits */}
                  <div className="space-y-3 text-sm text-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#facc15]/20 rounded-full">
                        <Zap className="w-5 h-5 text-[#facc15]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Commit Energy</p>
                        <p className="font-semibold">{data?.devTraits.commitEnergy}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#facc15]/20 rounded-full">
                        <Star className="w-5 h-5 text-[#facc15]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Star Power</p>
                        <p className="font-semibold">{data?.devTraits.starPower}</p>
                      </div>
                    </div>
                  </div>

                  {/* Spice Level Block */}
                  <div className="flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-br from-[#7f1d1d]/40 to-[#dc2626]/20 border border-[#dc2626] shadow-md">
                    <Flame className="w-6 h-6 text-[#facc15] animate-pulse mb-1" />
                    <p className="text-3xl font-bold text-[#facc15]">{data?.roast?.spiceLevel || 0}</p>
                    <span className="text-xs text-gray-300 mb-1">Spice Level</span>

                    <div className="relative w-24 h-2 rounded-full bg-[#f87171]/20 overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-[#dc2626] transition-all duration-300"
                        style={{ width: `${data?.roast?.spiceLevel || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-white/70 border-t border-white/10 pt-3 px-1">
                  <span>Card No. #{"00000"}</span>
                  <span className="text-green-400">#GithubRoast</span>
                  <span className="italic">@NikhilsaiAnkil1</span>
                </div>
              </div>


            </>
          )
        )}
      </section>

    </main>
  );
};

export default HomePage;
