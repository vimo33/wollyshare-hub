
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Building2, Trash2, Upload } from "lucide-react";
import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

// Form validation schema
const locationFormSchema = z.object({
  name: z.string().min(2, { message: "Location name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Please enter a valid address." }),
});

type LocationFormValues = z.infer<typeof locationFormSchema>;

interface Location {
  id: string;
  name: string;
  address: string;
}

const Admin = () => {
  const { user, adminProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  // Location form
  const locationForm = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  useEffect(() => {
    // Redirect if not an admin
    if (!isLoading && (!user || !adminProfile)) {
      navigate("/admin/auth");
    }
  }, [user, adminProfile, isLoading, navigate]);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const { data, error } = await supabase
          .from('community_locations')
          .select('*');

        if (error) {
          console.error('Error fetching locations:', error);
          toast.error('Failed to load community locations');
        } else if (data) {
          setLocations(data as Location[]);
        }
      } catch (err) {
        console.error('Error in fetchLocations:', err);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoadingLocations(false);
      }
    };

    if (user && adminProfile) {
      fetchLocations();
    }
  }, [user, adminProfile]);

  if (isLoading) {
    return <div className="container mx-auto mt-12 p-4">Loading...</div>;
  }

  if (!user || !adminProfile) {
    return null; // Will redirect in useEffect
  }

  // Handle logo upload
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Save logo changes
  const handleSaveLogo = () => {
    if (logoFile) {
      toast.success("Logo updated successfully");
      // In a real implementation, this would upload the file to Supabase or another storage service
    } else {
      toast.error("Please select a logo file first");
    }
  };

  // Add new location
  const onAddLocation = async (data: LocationFormValues) => {
    try {
      const { data: newLocation, error } = await supabase
        .from('community_locations')
        .insert([
          { name: data.name, address: data.address }
        ])
        .select()
        .single();
      
      if (error) {
        toast.error("Failed to add location: " + error.message);
        return;
      }
      
      setLocations(prev => [...prev, newLocation as Location]);
      locationForm.reset();
      setIsAddingLocation(false);
      toast.success("Location added successfully");
    } catch (error) {
      console.error("Error adding location:", error);
      toast.error("An unexpected error occurred");
    }
  };

  // Delete location
  const handleDeleteLocation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('community_locations')
        .delete()
        .eq('id', id);
      
      if (error) {
        toast.error("Failed to delete location: " + error.message);
        return;
      }
      
      setLocations(locations.filter(location => location.id !== id));
      toast.success("Location removed successfully");
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="container mx-auto pt-8 pb-12 px-4">
      <AdminBreadcrumb items={[]} /> {/* Empty items for the main dashboard */}
      
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="community" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Community Settings</span>
          </TabsTrigger>
          <TabsTrigger value="invitations" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Member Invitations</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="community">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Community Logo Section */}
            <Card>
              <CardHeader>
                <CardTitle>Community Logo</CardTitle>
                <CardDescription>
                  Update your community's logo that appears throughout the application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-4xl font-bold text-muted-foreground">W</div>
                    )}
                  </div>
                  
                  <div className="w-full space-y-2">
                    <Label htmlFor="logo-upload">Upload New Logo</Label>
                    <Input 
                      id="logo-upload" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoChange}
                    />
                    <Button 
                      className="w-full mt-2" 
                      onClick={handleSaveLogo}
                      disabled={!logoFile}
                    >
                      Save Logo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Community Name Section */}
            <Card>
              <CardHeader>
                <CardTitle>Community Name</CardTitle>
                <CardDescription>
                  Update your community's name that appears throughout the application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="community-name">Community Name</Label>
                    <Input id="community-name" defaultValue="WollyShare" />
                  </div>
                  <Button className="w-full">
                    Save Name
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Locations/Buildings Section */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Community Locations</CardTitle>
                <Dialog open={isAddingLocation} onOpenChange={setIsAddingLocation}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Location</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Location</DialogTitle>
                    </DialogHeader>
                    <Form {...locationForm}>
                      <form onSubmit={locationForm.handleSubmit(onAddLocation)} className="space-y-4">
                        <FormField
                          control={locationForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Building or Area Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={locationForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Street, City, State" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="submit" className="w-full">
                            Add Location
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                Manage the buildings or locations in your community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingLocations ? (
                <div className="py-8 text-center text-muted-foreground">
                  Loading locations...
                </div>
              ) : locations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.map((location) => (
                      <TableRow key={location.id}>
                        <TableCell className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {location.name}
                        </TableCell>
                        <TableCell>{location.address}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteLocation(location.id)}
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No locations have been added yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invitations">
          <Card>
            <CardHeader>
              <CardTitle>Manage Members</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/admin/members")}
              >
                Manage Members
              </Button>
              <p className="text-muted-foreground text-sm mt-2">
                Invite new members and manage existing member accounts.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
