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
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { signInSchema } from "@/Schema/signInSchema"
import { signIn } from "next-auth/react"
import Link from "next/link"

export default  function SignInPage() {
  const toast=useToast()
  const router=useRouter()
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier:"",
      password:""
    },
  })



  const onSubmit = async (data:z.infer<typeof signInSchema>) => {
    console.log(data)
    try {
      const result=await signIn('credentials',{
        redirect:false,
        identifier:data.identifier,
        password:data.password
      })
    console.log(result);
      if(result?.error){
        toast.toast({
          title:'Login failed',
          description:'Incorrect email or password',
          variant:'destructive'
        })
      }
      if(result?.url){
        router.replace('/dashboard')
      }
    } catch (error:any) {
      toast.toast({
        title:'Login failed',
        description:error.message,
        variant:'destructive'
      }) 
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
        Sign In to start your anonymous adventure
      </p>
    </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-medium">Username/Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Username/Email" 
                  {...field} 
                  className="border-black focus:ring-1 focus:ring-black transition-all"
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                Enter your username or email
              </FormDescription>
              <FormMessage className="text-gray-700" />
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
                  placeholder="Password" 
                  {...field}
                  className="border-black focus:ring-1 focus:ring-black transition-all"
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                Enter your password
              </FormDescription>
              <FormMessage className="text-gray-700" />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Sign In
        </Button>
      </form>
    </Form>
    
    <div className="text-center mt-4">
      <p className="text-gray-600">
        Don't have an account?{' '}
        <Link 
          href="/sign-up" 
          className="text-black hover:underline transition-all"
        >
          Sign Up
        </Link>
      </p>
    </div>
  </div>
</div>
  )
}

