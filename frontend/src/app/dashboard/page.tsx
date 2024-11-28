"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Description } from "@radix-ui/react-dialog";
interface IContact {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  
}
const Dashboard = () => {
  const [host,setHost]=useState<string>("http://localhost:3001")
  const [contacts, setContacts] = useState<IContact[]>([
    {
      _id: "temp",
      name: "Lorem, ipsum dolor",
      phone: "Start adding your contact, it will show up here",
      email: "john@doe.com",
      
    },
  ]);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const [isSearchTermCleared, setIsSearchTermCleared] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[] | null>(null);
  const [selectedContact, setSelectedContact] = useState<IContact>({
    _id: "",
    name: "",
    phone: "",
    email: "",
    
  });
  const [file, setFile] = useState([]);
  const [newContact, setNewContact] = useState<IContact>({
    name: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setToken(localStorage.getItem("token"));

      try {
        const response = await fetch(
          `${host}/api/fetch`,
          {
            method: "POST",
            headers: {
              "CONTENT-TYPE": "application/json",
            },
            body: JSON.stringify({ token: localStorage.getItem("token") }),
          }
        );
        const data2 = await response.json();
        if (data2.statusCode === 200) {
          setContacts(data2.data.contact);

          console.log(contacts);

          toast({
            title: "Message",
            description: "Product Fetched",
          });
          //   window.location.reload();
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
      }
    };
    const tokenLocalStorage = localStorage.getItem("token");
    if (tokenLocalStorage) fetchProduct();
    else router.replace("/");
  }, [isSearchTermCleared]);

  const handleImageChange = (e: any) => {
    if (e.target.files) {
      setFile(e.target.files);
      console.log(e.target.files[0]);
      const filesArray = Array.from(e.target.files).map(
        (file: any) => file.name
      );
      setSelectedFiles(filesArray);
    }
  };

  const handleAddProduct = async () => {
    
    
    try {
      setIsUploading(true);
      const response = await fetch(
        `${host}/api/upload`,
        {
          method: "POST",
          headers:{
              "CONTENT-TYPE":"application/json"
          },
          body: JSON.stringify({
            data:{
              contactData:{
                name:newContact.name,
                phone:newContact.phone,
                email:newContact.email
              }
            },
            token
          }),
        }
      );
      const data2 = await response.json();
      if (data2.statusCode === 201) {
        setContacts((prev) => [...(prev || []), data2.data.contactData]);

        

        console.log(contacts);

        setNewContact({ name: "", phone: "", email: ""});
        setIsAddDialogOpen(false);
        toast({
          title: "Message",
          description: "Contact Created",
        });
      } else {
        toast({
          title: "Message",
          description: data2.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditProduct = async () => {
    try {
      setIsEditing(true);
      const response = await fetch(
        `${host}/api/update`,
        {
          method: "POST",
          headers: {
            "CONTENT-TYPE": "application/json",
          },
          body: JSON.stringify({
            data: {
              contactData: {
                ...selectedContact,
              },
            },
            token,
          }),
        }
      );
      const data2 = await response.json();
      if (data2.statusCode === 200) {
        setContacts((prev) => {
          if (!prev) return [];
          return prev.map((product) =>
            product._id === selectedContact?._id ? selectedContact : product
          );
        });

        toast({
          title: "Message",
          description: "Edit Successfully",
        });
      } else {
        toast({
          title: "Message",
          description: data2.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditing(false);
      setIsEditDialogOpen(false);
      setSelectedContact({
        _id: "",
        name: "",
        phone: "",
        email: ""
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(
        `${host}/api/delete`,
        {
          method: "POST",
          headers: {
            "CONTENT-TYPE": "application/json",
          },
          body: JSON.stringify({
            data: {
              contactData: {
                _id: id,
              },
            },
            token,
          }),
        }
      );
      const data2 = await response.json();
      if (data2.statusCode === 200) {
        setContacts((prev) => prev.filter((product) => product._id !== id));

        toast({
          title: "Message",
          description: data2.message,
        });
      } else {
        toast({
          title: "Message",
          description: data2.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };
  const handleSearch = () => {
    const filteredProducts = contacts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setContacts(filteredProducts);

    console.log(filteredProducts, searchTerm);
  };
  const handleSearchClear = () => {};

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Contacts</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogDescription>
                  Fill in the details of your new contact
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone number</Label>
                  <Textarea
                    id="phone"
                    value={newContact.phone}
                    onChange={(e) =>
                      setNewContact((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Tag</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                
              </div>
              <DialogFooter>
                {isUploading ? (
                  <Button onClick={handleAddProduct} disabled>
                    <Loader2 className=" animate-spin" /> Adding
                  </Button>
                ) : (
                  <Button onClick={handleAddProduct}>Add Contact</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6  sm:flex gap-4">
          <Input
            className=" sm:w-full"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="border rounded px-3 py-2 mt-2 md:mt-0"
          >
            <option value="">All Filter</option>
            
          </select>
          <Button onClick={handleSearch} className=" mt-2 ml-4 md:m-0 md:ml-0">
            Apply
          </Button>
          <Button
          className="mt-2 ml-4 md:mt-0 md:ml-0"
            onClick={() => {
              setIsSearchTermCleared((prev) => !prev);
              setSearchTerm("");
            }}
            disabled={searchTerm.length ? false : true}
          >
            Clear
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {}
          {contacts?.map((product) => (
            <Card key={product._id}>
              <div
                className="relative h-48 w-full hover:cursor-pointer"
                onClick={() =>
                  router.push(`/contactView?contactId=${product._id}`)
                }
              >
                <Image
                  src={"/user.svg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>
                      {product.email}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedContact(product);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDeleteProduct(product._id ? product._id : "")
                      }
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{product.phone}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the details of your product
              </DialogDescription>
            </DialogHeader>
            {selectedContact && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedContact.name}
                    onChange={(e) =>
                      setSelectedContact((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone number</Label>
                  <Textarea
                    id="edit-phone"
                    value={selectedContact.phone}
                    onChange={(e) =>
                      setSelectedContact((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    value={selectedContact.email}
                    onChange={(e) =>
                      setSelectedContact((prev) => ({
                        ...prev,
                        email: e.target.value
                      }))
                    }
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              {isEditing ? (
                <Button onClick={handleAddProduct} disabled>
                  <Loader2 className=" animate-spin" /> Saving
                </Button>
              ) : (
                <Button onClick={handleEditProduct}>Save Changes</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
