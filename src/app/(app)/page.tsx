'use client';
import * as React from "react"
import Autoplay from "embla-carousel-autoplay";
import messages from '@/message.json';
 
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
  <div className="text-center mb-8">
    <h1 className="text-4xl font-bold text-white mb-4 animate-pulse">
      Dive Into the World of Anonymouse Message
    </h1>
    <h3 className="text-xl text-gray-300 mb-8">
      True Feedback - Where Your Identity Remains Secret
    </h3>
  </div>

  <Carousel
    plugins={[plugin.current]}
    className="w-full max-w-2xl"
    onMouseEnter={plugin.current.stop}
    onMouseLeave={plugin.current.reset}
  >
    <CarouselContent>
      {messages.map((message, index) => (
        <CarouselItem key={index}>
          <Card className="bg-gray-900 text-white border-gray-700">
            <CardHeader className="text-xl font-semibold text-gray-200">
              {message.title}
            </CardHeader>
            <CardContent className="text-center p-6">
              <span className="text-2xl font-medium text-white">
                {message.content}
              </span>
            </CardContent>
            <CardDescription className="text-right p-4 text-gray-400">
              <p>{message.received}</p>
            </CardDescription>
          </Card>
        </CarouselItem>
      ))}
    </CarouselContent>
    <div className="flex justify-center mt-4">
      <CarouselPrevious className="mr-4 text-white border-white" />
      <CarouselNext className="text-white border-white" />
    </div>
  </Carousel>

  <footer className="mt-8 text-center text-gray-500">
    <p>Copyright 2023 Anonymouse</p>
  </footer>
</div>
  );
}
