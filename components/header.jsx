import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from "next/link"
import Image from "next/image"
import { Button } from '@/components/ui/button'
import { LuLayoutDashboard } from "react-icons/lu";
import { FaPenToSquare } from "react-icons/fa6";

export default function Header() {
  return (
    <header className="container mx-auto fixed top-0 left-0 right-0 w-full bg-white/80 backdrop-blur-md border-b z-50">

      <div className="px-4 md:px-6">
        <nav className="flex items-center justify-between py-4">

          {/* Logo */}
          <Link href="/">
            <Image
              src="/welth.png"
              alt="welth logo"
              width={100}
              height={50}
              priority // <-- This fixes the LCP (Largest Contentful Paint) warning
              className="h-10 w-auto"
            />
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">

            <Show when="signed-in">
              <Link href="/dashboard">
                <Button variant="outline" className={"p-4.5"}>
                  <LuLayoutDashboard />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>

              <Link href="/transactions/create">
                <Button className={"p-4.5"}>
                  <FaPenToSquare />
                  <span className="hidden md:inline">Add transactions</span>
                </Button>
              </Link>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: {
                      width: "35px",
                      height: "35px"
                    }
                  }
                }}
              />
            </Show>

            <Show when="signed-out">
              <SignInButton>
                <Button variant="outline" size="lg">Login</Button>
              </SignInButton>

              <SignUpButton>
                <Button variant="outline" size="lg">Sign-up</Button>
              </SignUpButton>
            </Show>

          </div>
        </nav>
      </div>
    </header>
  )
}