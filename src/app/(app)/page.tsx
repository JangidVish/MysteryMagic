'use client'
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from '@/messages.json'

export default function Home() {
  return (
    <>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12 ">
        <h1 className="text-3xl md:text-5xl font-semibold">Dive into the World of Anonymus Conversations</h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">Explore a Mystery Message - Where your identity remains a secret</p>
      </section>
      <Carousel className="w-full max-w-xs" plugins={[Autoplay({delay:3000})]}>
      <CarouselContent>
       {
        messages.map((message, index)=>(
          <CarouselItem key={index}>
          <div className="p-1">
            <Card>
              <CardHeader>{message.title}</CardHeader>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-lg font-semibold">{message.content}</span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        ))
       }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </main>
    <footer className="text-center text-sm mb-4">
    © 2023 Mystery Message. All rights reserved.
    </footer>
    </>
  );
}
