'use client'
import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/model/User.model'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/apiRespones'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import React, { useCallback } from 'react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Loader2, RefreshCcw } from 'lucide-react'
import MessageCard from '@/components/messageCard'



const Dashboard = () => {
  const [messages, setmessages] = useState<Message[]>([])
  const [isLoading, setisLoading] = useState(false)
  const [isSwitchLoading, setisSwitchLoading] = useState(false)

  const {toast} =  useToast()

  const handleDeleteMessage = (messageId: string) =>{
    setmessages(messages.filter((message)=> message._id !== messageId))
  }

  const {data: session}= useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const {register, watch, setValue} = form

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async ()=>{
    setisSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/acceptMessage')
      setValue('acceptMessages', response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title:"Error",
        description: axiosError.response?.data.message || "Error while Fetching Message settings",
        variant: "destructive"
      })
    } finally{
      setisSwitchLoading(false);
    }
  }, [setValue, toast])

  const fetchMessage = useCallback(async (refresh : boolean = false)=>{
    setisLoading(true);
    setisSwitchLoading(false);
    try {
      const response = await axios.get('/api/get-messages')
      const messageArray :Message[] = response.data.message || []
      
      setmessages(messageArray)
      console.log(messages);
      
      
      
      if(refresh){
        toast({
          title:"Refresh",
          description: "Showing Latest Messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title:"Error",
        description: axiosError.response?.data.message || "Error while Fetching Message settings",
        variant: "destructive"
      })
    } finally{
      setisLoading(false);
      setisSwitchLoading(false);
    }
  },[])



  useEffect(() => {
    if(!session || !session.user) return

    fetchMessage()
    fetchAcceptMessage()
  }, [session, fetchAcceptMessage, fetchMessage, toast, setValue])
  
    //handle switch change
    const handleSwitchChange = async () => {
      try {
        const response = await axios.post<ApiResponse>('api/acceptMessage', { 
          acceptMessages: !acceptMessages
        });
    
        setValue('acceptMessages', !acceptMessages);
        
        toast({
          title: response.data.message,
          variant: 'default'
        });
      } catch (error) {
        // Check if the error is an AxiosError
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast({
            title: "Error",
            description: axiosError.response?.data.message || "Error while fetching message settings",
            variant: "destructive"
          });
        } else {
          // Handle non-Axios errors
          toast({
            title: "Error",
            description: "An unexpected error occurred",
            variant: "destructive"
          });
        }
      }
    };
    if (!session || !session.user) {
      return <div></div>;
    }

    const { username } = session.user as User;
    // console.log(username);
    

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard =()=>{
      navigator.clipboard.writeText(profileUrl)
      toast({
        title: "Url Copied Successfully",
        description:"Profile Url has been copied to board"
      })
    }

    if(!session || !session.user){
      return <div>Please Login</div>
    } 

  return( 
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input type="text" value={profileUrl} disabled  className='input input-bordered w-full p-2 mr-2' />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
       <Switch {...register('acceptMessages')} checked={acceptMessages} onCheckedChange={handleSwitchChange} disabled={isSwitchLoading} />
       <span className="ml-2">
        Accept Messages : {acceptMessages ? 'On': 'Off'}
       </span>
      </div>
      <Separator />

      <Button className="mt-4" variant={"outline"}
      onClick={(e)=>{
        e.preventDefault();
        fetchMessage(true)
      }}>
        {isLoading?(
          <Loader2 className='h-4 w-4 animate-spin' />):(
            <RefreshCcw className='h-4 w-4' />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length>0 ?(
          messages.map((message, index )=>(
            <MessageCard key={index} message={message} onMessageDelete={handleDeleteMessage} />
            
          ))
        ):(
          <p>No messages to display</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard