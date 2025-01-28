'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import axios from 'axios'
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { signUpSchmea } from "@/Schema/signUpSchema"
import { Loader2 } from "lucide-react"
import { APIResponse } from "@/types/Apiresponse"
import Link from "next/link"

export default  function page() {
  const [username, setusername] = useState('')
  const [usernamemessage, setusernamemessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitted, setisSubmitted] = useState(false)
  const toast=useToast()
  const router=useRouter()

  const form = useForm<z.infer<typeof signUpSchmea>>({
    resolver: zodResolver(signUpSchmea),
    defaultValues: {
      username: "",
      email:"",
      password:""
    },
  })
  const debounced = useDebounceCallback(setusername, 300)

  useEffect(() => {
   const checkingusername=async()=>{
    if(username.length!=0){
      setisCheckingUsername(true)
      setusernamemessage('')
      try {
      const response=await axios.get<APIResponse>(`/api/check-valid-username?username=${username}`)
      console.log(response)
       setusernamemessage(response.data.message) 
       setisCheckingUsername(false)
      } catch (error:any) {
        console.log(error.message)
        setisCheckingUsername(false)
        setusernamemessage('something went wrong')
      }
      
     } 
   }
   checkingusername()
  }, [username])

  const onSubmit = async (data:z.infer<typeof signUpSchmea>) => {
    setisSubmitted(true);
    console.log(data)
    try {
      const response = await axios.post<APIResponse>('/api/sign-up', data);
      if (response.data) {
        toast.toast({
          title: "Success",
          description: response.data.message,
        });
      router.replace(`/verify/${username}`)
      } else {
        toast.toast({
          title: "Failed",
          description: 'Failed to get the data',
          variant:'destructive'
        });
      }
    } catch (error) {
      console.error(error);
      toast.toast({
        title: "Failed",
        description: "Something went wrong Please try again later",
        variant:'destructive'
      })
    }
    finally{
      setisSubmitted(false)
    }
  };

  
  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-black p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-black mb-4">
          True Feedback
        </h1>
        <p className="text-gray-600 mb-6">
          Sign up for your anonymous adventure
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-medium">Username</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Username" 
                    {...field} 
                    onChange={(e)=>{
                      field.onChange(e)
                      setusername(e.target.value)
                    }}
                     className="border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </FormControl>
                <FormDescription>
                  {isCheckingUsername && <Loader2 className="animate-spin text-[#0ff]"/>}
                  {!isCheckingUsername && usernamemessage &&(
                    <p className={`text-sm ${
                      usernamemessage==='Username available'
                        ? 'text-[#0f0]'
                        : 'text-[#f00]'
                    }`}>
                      {usernamemessage}
                    </p>
                  )}
                </FormDescription>
                <FormMessage className="text-[#f00]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-medium">Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="email" 
                    {...field}
                     className="border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </FormControl>
                <FormDescription className="text-[#e0e0e0] opacity-70">
                  Your public display email
                </FormDescription>
                <FormMessage className="text-[#f00]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-medium">Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password"
                    placeholder="password" 
                    {...field}
                     className="border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </FormControl>
                <FormDescription className="text-[#e0e0e0] opacity-70">
                  Create a strong password
                </FormDescription>
                <FormMessage className="text-[#f00]" />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            disabled={isSubmitted}
            className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
          >
            {isSubmitted ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        <Link 
          href="/sign-in" 
          className="text-black hover:underline transition-all"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  </div>
  )
}
