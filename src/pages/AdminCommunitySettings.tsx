
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Upload, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Form validation schemas
const locationFormSchema = z.object({
  name: z.string().min(2, { message: "Location name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Please enter a valid address." }),
});

type LocationFormValues = z.infer<typeof locationFormSchema>;

// Mock data for community locations - would be fetched from API in real implementation
const MOCK_LOCATIONS = [
  { id: '1', name: 'Main Building', address: '123 Community Ave, City' },
  { id: '2', name: 'East Wing', address: '125 Community Ave, City' },
];

const AdminCommunitySettings = () => {
  const { user, adminProfile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [locations, setLocations] = useState(MOCK_LOCATIONS);
  const [isAddingLocation, setIsAddingLocation] = useState(false);

  // Location form
  const locationForm = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  // Redirect if not admin
  React.useEffect(() => {
    if (!authLoading && (!user || !adminProfile)) {
      navigate("/admin/auth");
    }
  }, [user, adminProfile, authLoading, navigate]);

  if (authLoading) {
    return <div className="container mx-auto mt-12 p-4">Loading...</div>;
  }

  if (!user || !adminProfile) {
    return null;
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
  const onAddLocation = (data: LocationFormValues) => {
    const newLocation = {
      id: Date.now().toString(),
      name: data.name,
      address: data.address,
    };
    
    setLocations([...locations, newLocation]);
    locationForm.reset();
    setIsAddingLocation(false);
    toast.success("Location added successfully");
  };

  // Delete location
  const handleDeleteLocation = (id: string) => {
    setLocations(locations.filter(location => location.id !== id));
    toast.success("Location removed successfully");
  };

  return (
    <div className="container mx-auto pt-8 pb-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Community Settings</h1>
      
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
          {locations.length > 0 ? (
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
    </div>
  );
};

export default AdminCommunitySettings;
