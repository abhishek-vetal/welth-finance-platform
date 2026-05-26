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

    if (imageRef.current) {
      imageRef.current.style.transform = `perspective(1000px) rotateX(15deg)`
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="container mx-auto px-4 pt-20 md:px-6 flex flex-col items-center text-center">
      <h1 className="gradient text-5xl md:text-[110px] font-bold mt-10 pb-2.5 tracking-tight drop-shadow-sm">
        Manage Your Finances <br /> With Intelligence
      </h1>

      <p className="mt-2 text-lg text-gray-600">
        An Ai-powered financial management platform that helps you track, <br />
        analyze, and optimize your spending with real-time insights.
      </p>

      <Link href={"/dashboard"}>
        <Button
          size="lg"
          className="px-8 py-5 mt-5 shadow-lg transition-all duration-300 hover:bg-violet-800 hover:scale-105 hover:shadow-xl"
        >
          Get Started
        </Button>
      </Link>

      <div
        ref={imageRef}
        className="hero-image-div mt-20 mx-4 md:px-0 shadow-2xl will-change-transform"
      >
        <Image
          src={"/banner.jpeg"}
          alt="banner image"
          width={1300}
          height={500}
        />
      </div>
    </div>
  )
}