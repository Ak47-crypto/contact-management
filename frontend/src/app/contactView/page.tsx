"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
interface IContact {
  _id?: string;
  name: string;
  phone: string;
  email: string;
}
const ContactView = () => {
  const [contacts, setContacts] = useState<IContact>({
    _id: "",
    name: "",
    phone: "",
    email: "",
  });
  const [isFetching,setIsFetching]=useState<boolean>(true)
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    
    const contactId = searchParams.get("contactId");
    if (!contactId) {
      toast({
        title: "Message",
        description: "Contact id not provided",
        variant: "destructive",
      });
      return;
    }
    if (!localStorage.getItem("token")) {
      router.replace('/log-in')
      // toast({
      //   title: "Message",
      //   description: "User not logged in",
      //   variant: "destructive",
      // });
      return;
    }

    const handleFetchOne = async () => {
      try {
        const response = await fetch(
          "https://contact-management-gold-nine.vercel.app/api/fetchOne",
          {
            method: "POST",
            headers: {
              "CONTENT-TYPE": "application/json",
            },
            body: JSON.stringify({
              data: {
                contactData: {
                  _id: contactId,
                },
              },
              token: localStorage.getItem("token"),
            }),
          }
        );
        const data2 = await response.json();
        if (data2.statusCode === 200) {
          setContacts({
            name: data2.data.name,
            phone: data2.data.phone,
            email: data2.data.email,
          });

          console.log(contacts);

          toast({
            title: "Message",
            description: "Contact Fetched",
          });
        } else if (data2.message === "jwt expired") {
          localStorage.removeItem("token");
        } else {
          throw new Error(JSON.stringify(data2));
          toast({
            title: "Message",
            description: data2.message,
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.log(error);
      }finally{
        setIsFetching(false)
      }
    };
    handleFetchOne();
  }, []);

  return (
    <div className="min-h-screen bg-gray-5 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between mb-3">
          <h1 className=" text-3xl font-bold">Contact Details</h1>
          <Button onClick={() => router.replace("/dashboard")}>
            Dashboard
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="order-1">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 md:justify-end md:items-center">
                  <div className="relative w-20 h-20 md:w-60 md:h-60 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-colors ">
                    <Image
                      src={"/user.svg"}
                      alt={`user icon`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          {isFetching?(
            <div className="order-1 md:order-2">
            <Card className="border-0 shadow-none">
              <CardHeader>
                <div className="space-y-2">
                  {/* Email Badge Skeleton */}
                  <div className="w-32 h-6 bg-gray-200 rounded-md animate-pulse"></div>
                  
                  {/* Name Skeleton */}
                  <div className="w-48 h-8 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description Skeleton */}
                <div>
                  <div className="w-32 h-4 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                  <div className="w-64 h-6 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          ):
          (<div className="order-1 md:order-2">
            <Card className="border-0 shadow-none">
              <CardHeader>
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-fit mr-2">
                    {contacts.email}
                  </Badge>

                  <CardTitle className="text-3xl">{contacts.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Phone number</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {contacts.phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default function Searchbar() {
  return (
    <Suspense>
      <ContactView />
    </Suspense>
  );
}
