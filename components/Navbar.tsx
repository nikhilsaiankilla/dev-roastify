
import React from 'react'
import Button from './Button'
import { TwitterIcon } from 'lucide-react'
import Image from 'next/image'

const Navbar = () => {
    return (
        <header className="w-full flex items-center justify-between py-4 bg-[#1E1E1E] shadow-md">
            <span className='flex items-center justify-center gap-1'>
                <Image src='/bread.png' alt="logo" width={35} height={35} />
                <h1 className="text-lg md:text-2xl font-bold tracking-wide text-[#FF5733]">
                    DevRoastify
                </h1>
            </span>

            <Button text="Follow" icon={<TwitterIcon size={16} />} destination="https://x.com/NikhilsaiAnkil1" />
        </header>
    )
}

export default Navbar
