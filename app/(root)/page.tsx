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
  const [imageRendered, setImageRendered] = useState<boolean>(false);
  const [isCardVisible, setIsCardVisible] = useState<boolean>(false);

  const roastCard = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<RoastData | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsCardVisible(false);
      setIsLoading(true);

      const formData = new FormData(e.currentTarget);
      const res = await roastUserAction(formData);

      if (!res?.success) {
        setIsCardVisible(false)
        return alert(res.message || 'Something went wrong!')
      }

      setData(res?.data)
      setIsCardVisible(true)
      setImageRendered(true);
    } catch (error) {
      setIsCardVisible(false);
      setImageRendered(false);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const htmlToPng = async () => {
    if (roastCard.current) {
      try {

        const dataUrl = await htmlToImage.toJpeg(roastCard.current, { quality: 0.9 });
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

  const shareOnTwitter = () => {
    const tweetText = encodeURIComponent(
      "Just got absolutely grilled by DevRoastify🔥\nWanna know how spicy your GitHub is?\n Try it now: 👇\nhttps://dev-roastify.vercel.app\n\nMade by @NikhilsaiAnkil1\n#GithubRoast #DevRoastify"
    );
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(tweetUrl, "_blank");
  };


  return (
    <main className="flex flex-col items-center justify-start p-3 md:px-6 py-12 bg-background text-foreground pb-20">
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
  Relax, we&apos;re not spying on you. No shady trackers, no data hoarding—just brutally honest roasts served hot and unforgiving. Your secrets are safe (but your code? Not so much).
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
          className="w-full text-sm placeholder:text-sm bg-[#333333] text-white px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF5733] transition-all"
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

      {
        data && imageRendered
          ?
          <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-10">
            <button
              onClick={() => setTimeout(() => htmlToPng(), 1000)}
              className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-[#FF5733] hover:bg-[#FFB300] transition-all duration-300 rounded-lg shadow-lg px-4 py-3 cursor-pointer"
            >
              <Download size={16} /> Download Card
            </button>
            <button
              onClick={() => setTimeout(() => copyCardToClipboard(), 1000)}
              className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-[#FF5733] hover:bg-[#FFB300] transition-all duration-300 rounded-lg shadow-lg  px-4 py-3 cursor-pointer"
            >
              <Copy size={16} /> Copy Image
            </button>
            <button
              onClick={shareOnTwitter}
              className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-[#FF5733] hover:bg-[#FFB300] transition-all duration-300 rounded-lg shadow-lg  px-4 py-3 col-span-2 cursor-pointer"
            >
              <TwitterIcon size={16} /> Share on Twitter
            </button>
            <button
              onClick={() => window.open("https://www.buymeacoffee.com/nikhilsaiankilla", "_blank")}
              className="flex items-center justify-center gap-2 text-sm font-medium text-[#FFB300] border-[#FFB300] border-2 hover:bg-[#FFB300] hover:text-white transition-all duration-300 rounded-lg shadow-lg  px-4 py-3 col-span-2 cursor-pointer"
            >
              <CoffeeIcon size={16} /> Buy Me Coffee
            </button>
          </div>
          :
          <></>
      }

      <section className="w-full mt-10">
        {
          isLoading ? (
            <div className="w-full mx-auto max-w-sm animate-pulse space-y-4 rounded-xl bg-muted p-4 shadow">
              <div className="h-6 w-1/3 rounded bg-gray-300" />
              <div className="h-4 w-2/3 rounded bg-gray-300" />
              <div className="h-4 w-full rounded bg-gray-300" />
              <div className="h-4 w-5/6 rounded bg-gray-300" />
              <div className="mt-4 flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-300" />
                <div className="h-4 w-1/3 rounded bg-gray-300" />
              </div>
            </div>
          ) : (
            isCardVisible && data && (<div className="w-full h-full relative bg-background z-10">

              <div className="max-w-[500px] h-full w-full mx-auto">
                <div
                  className="relative rounded-2xl p-4 bg-gradient-to-br from-[#2c1a17] via-[#3b1d1a] to-[#1c1c1c] shadow-[0_4px_40px_rgba(255,87,34,0.2)] border border-[#ff5722]/20 backdrop-blur-xl space-y-4"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image src="/bread.png" alt="logo" width={30} height={30} />
                      <h1 className="text-base font-bold tracking-wide text-[#f97316]">DevRoastify</h1>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border border-[#dc2626]/30 bg-[#dc2626]/20">
                      <Flame className="w-4 h-4 text-[#facc15]" />
                      {data?.roast?.spiceLabel || "Mild"}
                    </div>
                  </div>

                  {/* Profile */}
                  <div className="bg-white/5 rounded-xl p-3 shadow-inner border border-white/10 grid grid-cols-2">
                    <Image
                      src={data?.user?.avatar_url || "/chilli.png"}
                      alt="profile"
                      width={150}
                      height={150}
                      className="mx-auto rounded-full border-4 border-[#f97316] object-cover"
                    />
                    <div className="flex items-center justify-center flex-col">
                      <h2 className="text-sm md:text-lg font-extrabold text-white mt-2">@{data?.user?.login}</h2>
                      <div className="flex justify-center gap-6 mt-2">
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Followers</p>
                          <p className="text-2xl font-bold text-[#facc15]">{data?.user?.followers}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Following</p>
                          <p className="text-2xl font-bold text-[#facc15]">{data?.user?.following}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Roast Content */}
                  <div className="text-center space-y-1 px-2">
                    <p className="text-sm font-semibold italic text-[#f97316]">{data?.roast?.intro}</p>
                    <p className="text-xs text-gray-300">{data?.roast?.roast}</p>
                    <p className="text-sm italic text-[#f97316] font-medium mt-2">{data?.roast?.roastTagline}</p>
                  </div>

                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 bg-white/5 p-3 rounded-xl shadow-inner border border-white/10">
                    <div className="space-y-2">
                      {["Commit Energy", "Star Power"].map((label, idx) => {
                        const Icon = idx === 0 ? Zap : Star;
                        const value = idx === 0 ? data?.devTraits.commitEnergy : data?.devTraits.starPower;
                        return (
                          <div key={label} className="flex items-center gap-2 p-2 rounded-md border border-[#facc15] bg-[#facc151b]">
                            <div className="p-1 bg-[#facc15]/20 rounded-full">
                              <Icon className="w-4 h-4 text-[#facc15]" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">{label}</p>
                              <p className="text-sm font-semibold">{value}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#7f1d1d]/40 to-[#dc2626]/20 p-2 rounded-md border border-[#dc2626] shadow-md">
                      <Flame className="w-5 h-5 text-[#facc15] animate-pulse mb-1" />
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

                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* Badges */}
                  <div className="flex flex-wrap justify-center gap-2 p-2 border border-[#facc15] bg-[#facc151b] rounded-md">
                    {data?.roast?.badges?.map((badge, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs font-normal text-white ${badgeColors[index % badgeColors.length]}`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between flex-wrap items-center text-xs text-white/70 border-t border-white/10 pt-2">
                    <span>Card #{data?.cardId}</span>
                    <span className="text-green-400">#GithubRoast</span>
                    <span className="italic">@NikhilsaiAnkil1</span>
                  </div>
                </div>
              </div>

              <div className="w-[500px] h-[550px] opacity-0 pointer-events-none">
                <div
                  ref={roastCard}
                  className="relative rounded-2xl p-4 bg-gradient-to-br from-[#2c1a17] via-[#3b1d1a] to-[#1c1c1c] shadow-[0_4px_40px_rgba(255,87,34,0.2)] border border-[#ff5722]/20 backdrop-blur-xl space-y-4"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image src="/bread.png" alt="logo" width={30} height={30} />
                      <h1 className="text-base font-bold tracking-wide text-[#f97316]">DevRoastify</h1>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border border-[#dc2626]/30 bg-[#dc2626]/20">
                      <Flame className="w-4 h-4 text-[#facc15]" />
                      {data?.roast?.spiceLabel || "Mild"}
                    </div>
                  </div>

                  {/* Profile */}
                  <div className="bg-white/5 rounded-xl p-3 shadow-inner border border-white/10 grid grid-cols-2">
                    <Image
                      src={data?.user?.avatar_url || "/chilli.png"}
                      alt="profile"
                      width={150}
                      height={150}
                      className="mx-auto rounded-full border-4 border-[#f97316] object-cover"
                    />
                    <div className="flex items-center justify-center flex-col">
                      <h2 className="text-lg font-extrabold text-white mt-2">@{data?.user?.login}</h2>
                      <div className="flex justify-center gap-6 mt-2">
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Followers</p>
                          <p className="text-2xl font-bold text-[#facc15]">{data?.user?.followers}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Following</p>
                          <p className="text-2xl font-bold text-[#facc15]">{data?.user?.following}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Roast Content */}
                  <div className="text-center space-y-1 px-2">
                    <p className="text-sm font-semibold italic text-[#f97316]">{data?.roast?.intro}</p>
                    <p className="text-xs text-gray-300">{data?.roast?.roast}</p>
                    <p className="text-sm italic text-[#f97316] font-medium mt-2">{data?.roast?.roastTagline}</p>
                  </div>

                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 bg-white/5 p-3 rounded-xl shadow-inner border border-white/10">
                    <div className="space-y-2">
                      {["Commit Energy", "Star Power"].map((label, idx) => {
                        const Icon = idx === 0 ? Zap : Star;
                        const value = idx === 0 ? data?.devTraits.commitEnergy : data?.devTraits.starPower;
                        return (
                          <div key={label} className="flex items-center gap-2 p-2 rounded-md border border-[#facc15] bg-[#facc151b]">
                            <div className="p-1 bg-[#facc15]/20 rounded-full">
                              <Icon className="w-4 h-4 text-[#facc15]" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">{label}</p>
                              <p className="text-sm font-semibold">{value}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#7f1d1d]/40 to-[#dc2626]/20 p-2 rounded-md border border-[#dc2626] shadow-md">
                      <Flame className="w-5 h-5 text-[#facc15] animate-pulse mb-1" />
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

                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* Badges */}
                  <div className="flex flex-wrap justify-center gap-2 p-2 border border-[#facc15] bg-[#facc151b] rounded-md">
                    {data?.roast?.badges?.map((badge, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs font-normal text-white ${badgeColors[index % badgeColors.length]}`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between flex-wrap items-center text-xs text-white/70 border-t border-white/10 pt-2">
                    <span>Card #{data?.cardId}</span>
                    <span className="text-green-400">#GithubRoast</span>
                    <span className="italic">@NikhilsaiAnkil1</span>
                  </div>
                </div>
              </div>
            </div>
            )
          )
        }
      </section>

    </main>
  );
};

export default HomePage;