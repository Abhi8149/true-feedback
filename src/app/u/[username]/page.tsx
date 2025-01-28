'use client';
import { Button } from '@/components/ui/button'
import {Form, FormControl,FormField, FormItem} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { messagesSchema } from '@/Schema/messageSchema';
import { APIResponse } from '@/types/Apiresponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import {useForm } from 'react-hook-form';
import { z } from 'zod';

const sendMessage = () => {
 const [isLoading,setIsLoading]=useState(false);
 const [isLoading2,setIsLoading2]=useState(false);
 
 const [question,setQuestion]=useState([]);
 const toast=useToast();
 const params=useParams();
const form = useForm<z.infer<typeof messagesSchema>>({
    resolver: zodResolver(messagesSchema),
  })

 const onSubmit=async(data:z.infer<typeof messagesSchema>)=>{
    setIsLoading(true);
    try {
        const response=await axios.post<APIResponse>('/api/send-message',{
            username:params.username,
            content:data.content
        })
        if(response.data.success===true){
            toast.toast({
                title:response.data.message,
    
            })
        }
        else{
            toast.toast({
                title:'User is not accepting message',
                variant:'destructive'
            })
        }

    } catch (error) {
        console.log(error)
        toast.toast({
            title:'Error in sending message',
            variant:'destructive'
        })
    }
    finally{
        setIsLoading(false);
    }
 }

 const getmessages=async()=>{
    setIsLoading2(true);
    try {
       const response=await axios.post('/api/suggest-message');
       const responseArray=response.data.message.split('||');
       setQuestion(responseArray);
    } catch (error) {
        console.log(error)
        toast.toast({
           title:'Error in suggesting message',
           variant:'destructive'
        })
    }
    finally{
        setIsLoading2(false);
    }
 }
 const handleMessageClick=(msg:string)=>{
    form.setValue('content',msg)
 }


  return (
<div className="min-h-screen bg-white text-black">
  {/* Header Section */}
  <header className="py-6 sm:py-12 text-center border-b border-gray-100">
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h1 className="text-3xl sm:text-4xl font-bold">Anonymous Messaging</h1>
      </div>
      <h2 className="text-xl sm:text-2xl text-gray-600">Send a Message to @{params.username}</h2>
    </div>
  </header>

  {/* Main Content */}
  <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  placeholder="Write your anonymous message here..." 
                  {...field} 
                  className="w-full h-32 sm:h-40 border border-gray-200 rounded-lg p-3 sm:p-4 text-base sm:text-lg focus:ring-1 focus:ring-black focus:border-black transition-all resize-none"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {isLoading ? (
            <div className="flex-1 flex justify-center py-3">
              <Loader className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-black" />
            </div>
          ) : (
            <Button 
              type="submit" 
              className="w-full sm:flex-1 bg-black text-white py-3 text-base sm:text-lg rounded-lg hover:bg-gray-800 transition-colors"
              disabled={isLoading}
            >
              Send Anonymous Message
            </Button>
          )}
          
          {isLoading2 ? (
            <div className="flex-1 flex justify-center py-3">
              <Loader className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-black" />
            </div>
          ) : (
            <Button
              onClick={getmessages}
              className="w-full sm:flex-1 bg-gray-100 text-black py-3 text-base sm:text-lg rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading2}
            >
              Suggest Messages
            </Button>
          )}
        </div>
      </form>
    </Form>

    {/* Suggested Messages */}
    {question.length > 0 && (
      <section className="mt-8 sm:mt-16">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Suggested Messages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {question.map((question, index) => (
            <div 
              key={index} 
              onClick={() => handleMessageClick(question)} 
              className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-black hover:shadow-sm transition-all cursor-pointer"
            >
              <p className="text-sm sm:text-base text-gray-800">{question}</p>
            </div>
          ))}
        </div>
      </section>
    )}
  </main>

  {/* Footer */}
  <footer className="py-6 sm:py-8 border-t border-gray-100 mt-8 sm:mt-12">
    <div className="max-w-4xl mx-auto px-4 text-center text-gray-600">
      <p className="text-sm sm:text-base">Send anonymous messages securely and privately</p>
    </div>
  </footer>
</div>
  )
}

export default sendMessage
