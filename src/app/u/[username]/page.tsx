'use client'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { messageSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/types/apiRespones'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z  from "zod"


const UserMessage = () => {
    const param = useParams<{username: string}>()
    const [suggestMessage, setsuggestMessage] = useState<string[]>([])
    const {toast} = useToast();

    const fetchSuggestion = useCallback(async()=>{
      try {
        const response = await axios.get('/api/suggest-messages')
        const messageString = response.data.story
        // console.log(messageString);
        const messageArray = messageString.split('||').map((msg:string) => msg.trim())
        setsuggestMessage(messageArray)
        
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title:"Error",
          description: axiosError.response?.data.message || "Error while Fetching Message settings",
          variant: "destructive"
        })
      }
    },[toast])


    //zodd implementation
    const form = useForm< z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema)
    })

    const onSubmit = async(data: z.infer<typeof messageSchema>) =>{
        try {
            const respone = await axios.post(`/api/send-message`,{
                username: param.username,
                content: data.content
            })

            toast({
                title: "Message Sent Successfully",
                description: respone.data.message
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast({
             title:"Message Do not Send",
             description: errorMessage,
             variant:"destructive"
            })
        }
    }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-700'>
    <div className='w-full p-8 space-y-8 bg-gray-100 rounded-lg shadow-md justify-center flex-col flex items-center min-h-screen'>
    <div className="text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Public Profile Link
      </h1>
      <p className="mb-4 font-semibold">Enter your message</p>
      </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 w-3/4'>
        <FormField 
        name="content"
        control={form.control}
        render={({field})=>(
          <FormItem>
            <FormLabel>
            </FormLabel>
            <FormControl>
            <Input placeholder="message" {...field}/>
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )} />
      <Button type='submit'>Submit</Button>
      </form>
    </Form>

    <Button onClick={fetchSuggestion}>Suggest Messages</Button>
    <p>Click to copy</p>
    <div className="suggest-list">
      <ul className=''>
        {suggestMessage.map((message, index)=>(
          <li key={index} className='border p-4 rounded bg-gray-200 font-semibold mt-2'>
          <button onClick={ ()=>{
              navigator.clipboard.writeText(message)
              toast({
                title: "Url Copied Successfully",
                description:"Profile Url has been copied to board"
              })
            } }>{message}</button></li>
        ))}
      </ul>
    </div>
    </div>
  </div>
  )
}

export default UserMessage