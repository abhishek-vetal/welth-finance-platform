import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Hero from "@/components/hero"
import { Card, CardContent } from "@/components/ui/card"
import { statsData, featuresData, howItWorksData, testimonialsData } from "@/data/landing"
import checkUser from "@/lib/checkUser"

export default async function Home() {

  await checkUser()

  return (
    <>
      <Hero />

      {/* Stats */}
      <section className="container mx-auto mt-20 bg-blue-50 py-20">
        <div className="px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center">
              <h2 className="text-blue-600 font-bold text-2xl">{stat.value}</h2>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto mt-20">
        <div className="px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center">
            Everything you need to manage your finances
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {featuresData.map((feature, index) => (
              <Card key={index}>
                <CardContent className="flex flex-col gap-2 p-6">
                  <div>{feature.icon}</div>
                  <h2 className="font-bold text-xl">{feature.title}</h2>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto mt-20 bg-blue-50 py-20">
        <div className="px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center">How it Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {howItWorksData.map((data, index) => (
              <div key={index} className="flex flex-col gap-5 p-6 items-center text-center">
                <div>{data.icon}</div>
                <h2 className="font-bold text-xl">{data.title}</h2>
                <p className="text-gray-600">{data.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto mt-20">
        <div className="px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center">
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {testimonialsData.map((data, index) => (
              <Card key={index}>
                <CardContent className="flex flex-col gap-2 px-6 py-8">
                  <div className="flex items-center gap-5">
                    <Image 
                      src={data.image}
                      alt="user profile image"
                      width={35}
                      height={35}
                      className="rounded-full"
                    />

                    <div>
                      <h2 className="font-bold text-xl">{data.name}</h2>
                      <p className="text-gray-600 text-xs">{data.role}</p>
                    </div>
                  </div>

                  <p className="text-gray-600">{data.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto mt-20 bg-blue-600 py-20">
        <div className="px-4 md:px-6 text-white flex flex-col items-center gap-5 text-center">
          <h2 className="text-3xl font-bold">
            Ready To Take Control Of Your Finances?
          </h2>

          <p>
            Join thousands of users who are already managing their finances smarter with Welth
          </p>

          <Link href="/dashboard">
            <Button className="bg-white text-blue-600 mt-4 px-7 py-5 hover:scale-105 transition-all duration-300">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}