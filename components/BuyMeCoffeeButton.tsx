// components/BuyMeCoffeeButton.jsx
import { CoffeeIcon } from "lucide-react";

export default function BuyMeCoffeeButton() {
  return (
    <a
      href="https://www.buymeacoffee.com/yourusername"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 flex items-center bg-yellow-400 text-gray-900 font-semibold text-sm md:text-base p-3 rounded-full shadow-2xl border-2 border-transparent hover:border-yellow-400 transition-[border-radius,box-shadow,transform] duration-300 ease-in-out cursor-pointer group hover:shadow-xl hover:-translate-y-1 z-50 overflow-hidden"
    >
      <CoffeeIcon size={20} className="text-gray-900 flex-shrink-0" />
      <span className="max-w-0 text-sm font-normal scale-x-0 opacity-0 group-hover:max-w-[120px] group-hover:scale-x-100 group-hover:opacity-100 transition-[max-width,opacity,transform] duration-300 ease-in-out whitespace-nowrap ml-2">
        Buy Me a Coffee
      </span>
    </a>
  );
}