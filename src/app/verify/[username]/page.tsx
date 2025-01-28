'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { verifycodeschema } from '@/Schema/verifySchema';
import { APIResponse } from '@/types/Apiresponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect,useState } from 'react';

const verifyAccount = () => {
  const router=useRouter();
  const params=useParams<{username:string}>()
  const [isMounted, setIsMounted] = useState(false);
  const form = useForm<z.infer<typeof verifycodeschema>>({
    resolver: zodResolver(verifycodeschema)
  })
  const toast=useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until mounted
  if (!isMounted) {
    return null;
  }
  const onSubmit=async(data:z.infer<typeof verifycodeschema>)=>{
      try {
        const response=await axios.post<APIResponse>(`/api/verify-code`,{
            username:params.username,
            verifycode:data.code
        })
        console.log(response);
        if(response.data){
            toast.toast({
                title: "Success",
                description: response.data.message,
              });

              router.replace('/sign-in')
        }
        else{
            toast.toast({
                title: "Failed",
                description: 'Failed to verify code',
                variant:'destructive'
              });
        }
        
      } catch (error) {
        console.log(error);
        toast.toast({
          title: "Failed",
          description: "Something went wrong to verify code",
          variant:'destructive'
        })
      }
  }
return (
  <div>
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white border border-black rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-black">
            Please verify your account
          </h1>
          <p className="mb-4 text-gray-600">
            Please enter the code which has been sent to your mail
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-medium">Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your code" 
                      className="border-black focus:ring-1 focus:ring-black transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-gray-700" />
                </FormItem>
              )}
            />
            <Button 
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Verify
            </Button>
          </form>
        </Form>
      </div>
    </div>
  </div>
)
}

export default verifyAccount