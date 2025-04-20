"use client";

import React, { FormEvent, useRef, useState } from "react";
import { roastUserAction } from "@/actions/action";
import Image from "next/image";
import { CoffeeIcon, Copy, Download, Flame, Star, TwitterIcon, Zap } from "lucide-react";

const badgeColors = [
  "bg-red-500/70",
  "bg-green-500/70",
  "bg-yellow-500/70",
  "bg-purple-500/70",
  "bg-pink-500/70",
  "bg-orange-500/70",
  "bg-teal-500/70",
  "bg-indigo-500/70",
  "bg-cyan-500/70",
  "bg-rose-500/70"
];

import * as htmlToImage from 'html-to-image';

interface RoastData {
  cardId: string;
  user: {
    login: string;
    name: string;
    bio: string;
    avatar_url: string;
    public_repos: string;
    followers: string;
    following: string;
    stars: number;
    location: string;
  };
  roast?: {
    intro?: string;
    roast?: string;
    spiceLabel?: string;
    roastTagline?: string;
    spiceLevel: number;
    badges?: string[];
  };
  devTraits: {
    commitEnergy: number;
    starPower: number;
  };
}

const HomePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const roastCard = useRef<HTMLDivElement>(null);

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

  const htmlToPng = async () => {
    if (roastCard.current) {
      try {
        const dataUrl = await htmlToImage.toJpeg(roastCard.current, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = 'dev-roast-card.jpeg';
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Failed to generate image', error);
      }
    } else {
      console.error('Card not found');
    }
  };

  const copyCardToClipboard = async () => {
    const node = roastCard.current;

    if (!node) return;

    const blob = await htmlToImage.toBlob(node);
    if (blob) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        alert("Roast card copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-start p-3 md:px-6 py-12 bg-background text-foreground">
      {/* Intro */}
      <section className="max-w-2xl text-center my-10">
        <span className='flex items-center justify-center gap-1'>
          <Image src='/bread.png' alt="logo" width={55} height={55} />
          <h1 className="text-3xl md:text-5xl font-bold tracking-wide text-white">
            DevRoastify
          </h1>
        </span>
        <p className="text-sm md:text-lg text-gray-300 mt-5">
          Drop your GitHub username and get a roast card that&apos;ll burn brighter than your last deploy failure.
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
          className="w-full md:w-fit whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 text-sm font-medium text-white bg-[#FF5733] hover:bg-[#FFB300] transition-all duration-300 ease-in-out rounded-full shadow-lg hover:scale-105 active:scale-95 px-6 py-4"
        >
          {isLoading ? (
            <>
              <svg
                className="w-5 h-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0Z"
                />
              </svg>
              <span>Roasting...</span>
            </>
          ) : (
            "Get Roast"
          )}
        </button>
      </form>


      <section className="w-full mt-10">
        {isLoading ? (
          <div className="mx-auto text-center">
            {/* Bouncing Logo */}
            <Image
              src="/bread.png"
              alt="logo"
              width={300}
              height={300}
              className="mx-auto animate-bounce"
            />

            {/* Animated Text */}
            <h1 className="text-center mt-5 text-xl font-semibold text-gray-700 animate-fade-in">
              Roasting your GitHub...
            </h1>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-[#FF5733] h-2.5 rounded-full animate-pulse" style={{ width: '80%' }} />
              </div>
            </div>
          </div>

        ) : (
          data && (
            <>
              <h3 className="text-xl font-semibold text-center text-white mt-5 opacity-0 animate-fadeIn animate-delay-500 underline hover:underline hover:text-[#FF5733] transition-all duration-300 ease-in-out">
                Your Roast
              </h3>

              <div className="w-full max-w-md mx-auto">

                <div className="rounded-2xl p-3 
                      bg-gradient-to-br from-[#2c1a17] via-[#3b1d1a] to-[#1c1c1c] 
                      shadow-[0_4px_40px_rgba(255,87,34,0.2)] 
                      border border-[#ff5722]/20 
                      backdrop-blur-xl 
                      space-y-3"
                  ref={roastCard}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image src="/bread.png" alt="logo" width={24} height={24} />
                      <h1 className="text-base font-bold tracking-wide text-[#f97316]">DevRoastify</h1>
                    </div>
                    <div className="bg-[#dc2626]/20 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 border border-[#dc2626]/30">
                      <Flame className="w-4 h-4 text-[#facc15]" />
                      {data?.roast?.spiceLabel || "Mild"}
                    </div>
                  </div>

                  {/* Profile */}
                  <div className="bg-white/5 rounded-xl p-2 shadow-inner border border-white/10">
                    <Image
                      src={data?.user?.avatar_url || "/placeholder.png"}
                      alt="profile"
                      width={130}
                      height={130}
                      className="object-cover mx-auto rounded-full border-4 border-[#f97316]"
                    />
                    <h2 className="text-lg text-center font-extrabold text-white mt-1">@{data?.user?.login}</h2>
                    <div className="flex justify-center gap-6 mt-1">
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Followers</p>
                        <p className="text-lg font-bold text-[#facc15]">{data?.user?.followers}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Following</p>
                        <p className="text-lg font-bold text-[#facc15]">{data?.user?.following}</p>
                      </div>
                    </div>
                  </div>

                  {/* Roast */}
                  <div className="text-center px-1">
                    <p className="text-sm font-semibold italic text-[#f97316]">{data?.roast?.intro}</p>
                    <p className="text-xs text-gray-300 mt-1">{data?.roast?.roast}</p>
                    <p className="mt-2 text-sm italic text-[#f97316] font-medium">{data?.roast?.roastTagline}</p>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 bg-white/5 p-2 rounded-xl shadow-inner border border-white/10">
                    <div className="flex flex-col gap-2">
                      {/* Commit Energy */}
                      <div className="flex items-center gap-2 p-2 rounded-md border border-[#facc15] bg-[#facc151b]">
                        <div className="p-1 bg-[#facc15]/20 rounded-full">
                          <Zap className="w-4 h-4 text-[#facc15]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Commit Energy</p>
                          <p className="text-sm font-semibold">{data?.devTraits.commitEnergy}</p>
                        </div>
                      </div>
                      {/* Star Power */}
                      <div className="flex items-center gap-2 p-2 rounded-md border border-[#facc15] bg-[#facc151b]">
                        <div className="p-1 bg-[#facc15]/20 rounded-full">
                          <Star className="w-4 h-4 text-[#facc15]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Star Power</p>
                          <p className="text-sm font-semibold">{data?.devTraits.starPower}</p>
                        </div>
                      </div>
                    </div>

                    {/* Spice Level */}
                    <div className="flex flex-col items-center justify-center px-2 py-2 rounded-md bg-gradient-to-br from-[#7f1d1d]/40 to-[#dc2626]/20 border border-[#dc2626] shadow-md">
                      <Flame className="w-5 h-5 text-[#facc15] animate-pulse mb-0.5" />
                      <p className="text-2xl font-bold text-[#facc15]">{data?.roast?.spiceLevel || 0}</p>
                      <span className="text-xs text-gray-300">Spice Level</span>
                      <div className="relative w-20 h-1.5 rounded-full bg-[#f87171]/20 mt-1">
                        <div
                          className="absolute top-0 left-0 h-full bg-[#dc2626] transition-all duration-300"
                          style={{ width: `${data?.roast?.spiceLevel || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* Badges */}
                  <div className="w-full p-2 rounded-md border border-[#facc15] bg-[#facc151b] flex flex-wrap justify-center gap-1">
                    {data?.roast?.badges?.map((badge: string, index: number) => {
                      const colorClass = badgeColors[index % badgeColors.length];
                      return (
                        <span key={index} className={`px-2 py-1 rounded text-xs font-normal text-white ${colorClass}`}>
                          {badge}
                        </span>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between flex-wrap items-center text-xs text-white/70 border-t border-white/10 pt-2 px-1">
                    <span>Card #{data?.cardId}</span>
                    <span className="text-green-400">#GithubRoast</span>
                    <span className="italic">@NikhilsaiAnkil1</span>
                  </div>
                </div>

              </div>

              <div className="w-full max-w-md mx-auto flex flex-wrap items-center gap-2 mt-3">

                <div className="w-full flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setTimeout(() => {
                        htmlToPng();
                      }, 500);
                    }}
                    className="w-full whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 text-sm font-medium text-white bg-[#FF5733] hover:bg-[#FFB300] transition-all duration-300 ease-in-out rounded-lg shadow-lg hover:scale-105 active:scale-95 px-6 py-4"
                  >
                    <Download size={16} />
                    Download card
                  </button>

                  <button
                    onClick={() => {
                      setTimeout(() => {
                        copyCardToClipboard();
                      }, 500);
                    }}
                    className="w-full whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 text-sm font-medium text-white bg-[#FF5733] hover:bg-[#FFB300] transition-all duration-300 ease-in-out rounded-lg shadow-lg hover:scale-105 active:scale-95 px-6 py-4"
                  >
                    <Copy size={16} /> Copy Image
                  </button>
                </div>

                <div className="w-full flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setTimeout(() => {
                        copyCardToClipboard();
                      }, 500);
                    }}
                    className="w-full whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 text-sm font-medium text-white bg-[#FF5733] hover:bg-[#FFB300] transition-all duration-300 ease-in-out rounded-lg shadow-lg hover:scale-105 active:scale-95 px-6 py-4"
                  >
                    <TwitterIcon size={16} /> Share on Twitter
                  </button>

                  <button
                    onClick={() => {
                      setTimeout(() => {
                        copyCardToClipboard();
                      }, 500);
                    }}
                    className="w-full whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 text-sm font-medium text-white hover:bg-[#FF5733] bg-[#FFB300] transition-all duration-300 ease-in-out rounded-lg shadow-lg hover:scale-105 active:scale-95 px-6 py-4"
                  >
                    <CoffeeIcon size={16} /> Buy Me Coffee
                  </button>
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
