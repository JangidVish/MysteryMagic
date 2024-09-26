'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from './ui/button'
const Navbar = () => {
    const {data: session}= useSession()

    const user: User = session?.user as User

  return (
    <nav className='p-2 md:p-6 shadow-md '>
    <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <Link href="#" className='text-xl font-bold'>Mystery Message</Link>
        {
            session ?(
                <>                
                <span className='mr-4'>Welcome, {user.username || user.email}</span>
                <Button onClick={()=> signOut()} className='w-full md:w-auto'>Log Out</Button>
                </>
            ):(
                <Link href='/sign-in'>
                    <Button className='w-full md:w-auto cursor-pointer'>Login</Button>
                </Link>
            )
        }
    </div>
    </nav>
  )

}


export default Navbar