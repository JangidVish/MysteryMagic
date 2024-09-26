'use client'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import * as z  from "zod"
import React from 'react'
import {useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiRespones'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const VerifyAccount = () => {
    const router = useRouter()
    const param = useParams<{username: string}>()
    const {toast} = useToast();

    
  //zodd implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),

    
  })

  const onSubmit = async(data: z.infer<typeof verifySchema>) =>{
    try {
     const response = await axios.post(`/api/verify-code`,{
        username: param.username,
        code: data.code
      })

      toast({
        title:"Verified Successfully",
        description:response.data.message
      })

      router.replace('/sign-in')
    } catch (error) {
     const axiosError = error as AxiosError<ApiResponse>
     let errorMessage = axiosError.response?.data.message
     toast({
      title:"Verify Failed",
      description: errorMessage,
      variant:"destructive"
     })
    }
  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-700'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Verify Your Account
        </h1>
        <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField 
          name="code"
          control={form.control}
          render={({field})=>(
            <FormItem>
              <FormLabel>
                Verification Code
              </FormLabel>
              <FormControl>
              <Input placeholder="Code" {...field}/>
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <Button type='submit'>Submit</Button>
        </form>
      </Form>
      </div>
    </div>
  )
}

export default VerifyAccount
