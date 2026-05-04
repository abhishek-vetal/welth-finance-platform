"use client"

import Link from "next/link"
import Image from "next/image"
import React from "react"
import { Button } from "@/components/ui/button"

export default function Hero() {
    const imageRef = React.useRef(null)

    React.useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY
            const tilt = Math.max(0, 15 - scrolled * 0.05)
            if (imageRef.current) {
                imageRef.current.style.transform = `perspective(1000px) rotateX(${tilt}deg)`
            }
        }

        // Set initial tilt before any scrolling
        if (imageRef.current) {
            imageRef.current.style.transform = `perspective(1000px) rotateX(15deg)`
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    })

    return (
        <>
            <div className="container mx-auto px-3 flex flex-col items-center text-center">
                <h1 className="gradient text-5xl md:text-[110px] font-bold mt-10 tracking-tighter">
                    Manage Your Finances <br />  With Intelligence
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    An Ai-powered financial management platform that helps you track, <br />
                    analyze, and optimize your spending with real-time insights.
                </p>
                <Link href={"/dashboard"}>
                    <Button size="lg" 
                        className={"px-8 py-5.5 mt-4 shadow-lg shadow-gray-600 transition-all duration-300 hover:bg-violet-800 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/50"}>
                        Get Started
                    </Button>
                </Link>

                <div ref={imageRef} className="hero-image-div px-10 md:px-0 mt-20 shadow-2xl shadow-gray-600">
                    <Image 
                        src={"/banner.jpeg"} 
                        alt="banner image" 
                        width={1250} 
                        height={500}
                    />
                </div>
            </div>
        </>
    )
}