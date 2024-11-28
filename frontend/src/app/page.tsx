"use client";

import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
const Home = () => {
  const carImages = [
    "/user1.png",
    "/user2.png",  
    "/user.svg",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Manage Your Contacts with Ease
            </h1>
            <p className="text-lg text-gray-600">
              Experience seamless contact management with our powerful platform. 
              Track count, view, and pertionalize your contact operations.
            </p>
            <div className="flex gap-4">
              <Link href={localStorage.getItem('token')?"/dashboard":"/sign-up"}>
              <Button size="lg">Get Started</Button>
              </Link>
              <Link href={"#feature"}>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div>
                <h3 className="text-3xl font-bold">100000+</h3>
                <p className="text-gray-600">Contacts Managed</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold">500+</h3>
                <p className="text-gray-600">Happy Clients</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold">24/7</h3>
                <p className="text-gray-600">Support</p>
                
              </div>
            </div>
          </div>

          {/* Right side - Carousel */}
          <div className="relative">
            <Carousel className="w-full"
             plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            >
              <CarouselContent>
                {carImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`Car ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* <CarouselPrevious /> */}
              {/* <CarouselNext /> */}
            </Carousel>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16" id="feature">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">
      Why Choose Our Contact Manager?
    </h2>
    <div className="grid md:grid-cols-3 gap-8">
      {/* Feature 1 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-3">Effortless Contact Storage</h3>
        <p className="text-gray-600">
          Save and manage all your contacts in one secure and easily accessible location.
        </p>
      </div>
      
      {/* Feature 2 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-3">Quick Access to Details</h3>
        <p className="text-gray-600">
          Find names, phone numbers, and emails instantly with our intuitive search.
        </p>
      </div>
      
      {/* Feature 3 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-3">Seamless Integration</h3>
        <p className="text-gray-600">
          Sync your contact list with email and messaging platforms effortlessly.
        </p>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default Home;