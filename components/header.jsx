import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from "next/link"
import Image from "next/image"
import { Button } from '@/components/ui/button'
import { LuLayoutDashboard } from "react-icons/lu";
import { FaPenToSquare } from "react-icons/fa6";


export default function Header() {
    return (
      <div className='fixed top-0 w-full bg-white/80 backdrop-blur-md border-b-2 z-50'>
        <nav className='px-14 py-4 flex justify-between items-center'>
          <Link href='/'>
            <Image src={"/logo.png"} alt='welth logo' width={100} height={50} />
          </Link>

          <div className='w-35 flex gap-3 justify-end px-2'>
            <Show when="signed-in">
              <Link href={"/dashboard"}>
                <Button variant='outline'>
                  <LuLayoutDashboard />
                  <span className='hidden md:inline'>Dashboard</span>
                </Button>
              </Link>

              <Link href={"/transactions/create"}>
                <Button>
                  <FaPenToSquare />
                  <span className='hidden md:inline'>Add transactions</span>
                </Button>
              </Link>
            </Show>

            <Show when="signed-out">
              <SignInButton>
                <Button variant='outline' size="lg">Login</Button>
              </SignInButton>
              <SignUpButton>
                <Button variant='outline' size="lg">Sign-up</Button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
            <UserButton
            appearance={{
              elements: {
                avatarBox: {
                  width: "33px",
                  height: "33px"
                }
              }
            }}  
            />
            </Show>
          </div>
        </nav>
      </div>
    )
}