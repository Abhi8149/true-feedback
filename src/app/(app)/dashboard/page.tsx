'use client';

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { message } from "@/model/User";
import { accpetMessageSchema } from "@/Schema/acceptMessageSchema";
import { APIResponse } from "@/types/Apiresponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader, Loader2, RefreshCcw, WineOff } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";




const dashboard = () => {
  const [message,setmessage]=useState<message[]>([]);
  const [isLoading,setIsLoading]=useState(false);
  const [isSwitchLoading,setIsSwithcLoading]=useState(false);
  const toast=useToast()
  const {data:session}=useSession();
  const handleRemoveMessage=(messageId:string)=>{
    setmessage(message.filter((message)=>message._id!==messageId))
  }

  const form=useForm({
    resolver:zodResolver(accpetMessageSchema)
  })

  const {register,watch,setValue}=form
  const acceptmessages=watch('acceptMessage')
  console.log(acceptmessages)
  const fetchAcceptMessages=useCallback(async()=>{
       try {
        setIsLoading(true);
        const response=await axios.get<APIResponse>('/api/accept-message')
        setValue('accept-messages',response.data.isAcceptingMessage);
       } catch (error) {
          const axiosError = error as AxiosError<APIResponse>;
          toast.toast({
            title: 'Error',
            description:
              axiosError.response?.data.message ??
              'Failed to fetch message settings',
            variant: 'destructive',
          });
       }
       finally{
        setIsLoading(false);
       }
  },[setValue])

  const fetchmessages=useCallback(async(refresh:boolean=false)=>{
    setIsLoading(true);
    setIsSwithcLoading(true);
   try {
    const response=await axios.get('/api/get-message');
    setmessage(response.data.messages || []);

    if(refresh){
      toast.toast({
        title: 'Message refreshed',
        description: 'Message list has been refreshed',
      })
    }
   } catch (error) {
    const axiosError = error as AxiosError<APIResponse>;
    toast.toast({
      title: 'Error',
      description:
        axiosError.response?.data.message ??
        'Failed to fetch message settings',
      variant: 'destructive',
    });
   }
   finally{
    setIsLoading(false);
    setIsSwithcLoading(false);
   }
  },[setValue])

  useEffect(() => {
  if(!session || !session.user){
    return;
  }

  fetchAcceptMessages();
  fetchmessages()
  }, [session,fetchAcceptMessages,fetchmessages]);

  const handleSwitchChange=async()=>{
    try {
      console.log(acceptmessages)
      const response=await axios.post<APIResponse>('/api/accept-message',{
        acceptingmessage:!acceptmessages
      });
      setValue('acceptMessage',!acceptmessages);
      console.log(response.data)
      toast.toast({
        title:response.data.message
      })
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      toast.toast({
      title: 'Error',
      description:
        axiosError.response?.data.message ??
        'Failed to fetch message settings',
      variant: 'destructive',
    });
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };


  if(!session || !session.user){
    return <div>
      <h1>Please Login</h1>
    </div>
  }

  const user:User=session.user as User;
  
  const username=user.username;
  const baseUrl=`${window.location.protocol}//${window.location.host}`
  const profileUrl=`${baseUrl}/u/${username}`
  
  return (
    <div className="min-h-screen bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-black">
          User Dashboard
        </h1>
        <Button
          onClick={(e) => {
            e.preventDefault();
            fetchmessages(true);
          }}
          className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-all"
        >
          {isLoading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <RefreshCcw className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Profile Link Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-black mb-4">
          Your Unique Profile Link
        </h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="flex-grow bg-gray-50 text-black p-3 rounded-md border border-gray-200 focus:outline-none"
          />
          <Button 
            onClick={copyToClipboard}
            className="bg-black text-white px-6 py-2.5 rounded-md hover:bg-gray-800 transition-all"
          >
            Copy
          </Button>
        </div>
      </div>

      {/* Toggle Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center gap-6">
          <Switch
            {...register('acceptMessage')}
            checked={acceptmessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            className={`${
              acceptmessages ? 'bg-black' : 'bg-gray-200'
            } relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full transition-colors`}
          >
            <span
              className={`${
                acceptmessages ? 'translate-x-6' : 'translate-x-0'
              } inline-block h-6 w-6 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
          <span className="text-base font-medium text-black">
            Accept Messages: 
            <span className={acceptmessages ? 'text-black' : 'text-gray-500'}>
              {acceptmessages ? ' On' : ' Off'}
            </span>
          </span>
        </div>
      </div>

      {/* Messages Grid */}
      <div className="space-y-4">
        {message.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {message.map((message) => (
              <div 
                key={message._id} 
                className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <MessageCard
                  message={message}
                  onRemoveMessage={handleRemoveMessage}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg p-12 text-center">
            <p className="text-lg text-gray-500">No messages to display</p>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
  );
}

export default dashboard