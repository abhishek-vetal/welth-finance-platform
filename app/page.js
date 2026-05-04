import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Hero from "@/components/hero"
import { Card, CardContent } from "@/components/ui/card"
import { statsData, featuresData, howItWorksData, testimonialsData } from "@/data/landing"

export default function Home() {

  return (
    <>
      <Hero />

      <section className="mt-20">
        <div>
          <section className="bg-blue-50 py-20">
            <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-10">
              {statsData.map((stat, index) => (
                <div key={index} className="text-center">
                  <h2 className="text-blue-600 font-bold text-2xl">{stat.value}</h2>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-20">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center">
                Everything you need to manage your finances
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-20 mt-15">
                  {featuresData.map((feature, index) => {
                    return <Card key={index}>
                      <CardContent className={"flex flex-col gap-2 p-6"}>
                        <div>{feature.icon}</div>
                        <h2 className="font-bold text-xl">{feature.title}</h2>
                        <p className="text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  })}
              </div>
            </div>
          </section>

          <section className="bg-blue-50 mt-20 py-20">
            <div className="container mx-auto"> 
              <h2 className="text-3xl font-bold text-center">How it Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-10 mt-10">
                  {howItWorksData.map((data, index) => {
                    return <div key={index} className={"flex flex-col gap-5 p-6 items-center text-center"}>
                      <div>{data.icon}</div>
                      <h2 className="font-bold text-xl">{data.title}</h2>
                      <p className="text-gray-600">{data.description}</p>
                    </div>
                  })}
              </div>
            </div>
          </section>

          <section className="mt-20">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center">
                What Our Users Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-20 mt-15">
                  {testimonialsData.map((data, index) => {
                    return <Card key={index}>
                      <CardContent className={"flex flex-col gap-2 px-10 py-10"}>
                        <div className="flex items-center gap-5">
                          <div>
                            <Image 
                              src={data.image}
                              alt="user profile image"
                              width={35}
                              height={35}
                              className="rounded-full"
                            />
                          </div>
                          <div>
                            <h2 className="font-bold text-xl">{data.name}</h2>
                            <p className="text-gray-600 text-xs">{data.role}</p>
                          </div>
                        </div>
                        <p className="text-gray-600">{data.quote}</p>
                      </CardContent>
                    </Card>
                  })}
              </div>
            </div>
          </section>

          <section className="mt-20 bg-blue-600 py-20">
            <div className="container mx-auto text-white flex flex-col items-center gap-5">
              <h2 className="text-3xl font-bold">
                Ready To Take Control Of Your Finances?
              </h2>
              <p>
                Join thousands of users who are already managing their finances smarter with Welth
              </p>
              <Link href={"/dashboard"}>
                <Button className={"bg-white text-blue-600 mt-4 px-7 py-5 animate-bounce"}>
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </section>

          

        </div>
      </section>

    </>
  );
}
