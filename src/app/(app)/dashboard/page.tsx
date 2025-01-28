'use client';

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { message } from "@/model/User";
import { accpetMessageSchema } from "@/Schema/acceptMessageSchema";
import { APIResponse } from "@/types/Apiresponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import {Loader2, RefreshCcw} from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";




const dashboard = () => {
  const [message,setMessage]=useState<message[]>([]);
  const [isLoading,setIsLoading]=useState(false);
  const [isSwitchLoading,setIsSwithcLoading]=useState(false);
  const toast=useToast()
  const {data:session}=useSession();
  const handleRemoveMessage=(messageId:string)=>{
    setMessage(message.filter((message)=>message._id!==messageId))
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
    setMessage(response.data.messages || []);

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
      const response=await axios.post<APIResponse>('/api/accept-message',{
        acceptingmessage:!acceptmessages
      });
      setValue('acceptMessage',!acceptmessages);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-black text-center sm:text-left">
            User Dashboard
          </h1>
          <Button
            onClick={(e) => {
              e.preventDefault();
              fetchmessages(true);
            }}
            className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-all w-full sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <RefreshCcw className="h-5 w-5" />
            )}
          </Button>
        </div>
  
        {/* Profile Link Section */}
        <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">
            Your Unique Profile Link
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch gap-4">
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
        <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
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
            <span className="text-base font-medium text-black text-center sm:text-left">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
            <div className="bg-white shadow-sm rounded-lg p-8 text-center">
              <p className="text-base sm:text-lg text-gray-500">
                No messages to display
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>  
  );
}

export default dashboard;
