
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Building2, Plus, Trash2, Upload, Save, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

interface CommunitySettingsTabProps {
  locations: Location[];
  isLoadingLocations: boolean;
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
}

const CommunitySettingsTab: React.FC<CommunitySettingsTabProps> = ({ 
  locations, 
  isLoadingLocations, 
  setLocations 
}) => {
  const navigate = useNavigate();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [editableLocations, setEditableLocations] = useState<Record<string, boolean>>({});
  const [locationEdits, setLocationEdits] = useState<Record<string, Location>>({});
  const [locationHasChanges, setLocationHasChanges] = useState(false);

  // Location form
  const locationForm = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

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

  // Make a location editable
  const handleEditLocation = (location: Location) => {
    setEditableLocations(prev => ({ ...prev, [location.id]: true }));
    setLocationEdits(prev => ({ 
      ...prev, 
      [location.id]: { ...location }
    }));
  };

  // Update location field
  const handleUpdateLocationField = (id: string, field: 'name' | 'address', value: string) => {
    setLocationEdits(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
    setLocationHasChanges(true);
  };

  // Save location changes
  const handleSaveLocationChanges = async (id: string) => {
    try {
      const updatedLocation = locationEdits[id];
      
      const { error } = await supabase
        .from('community_locations')
        .update({
          name: updatedLocation.name,
          address: updatedLocation.address
        })
        .eq('id', id);
      
      if (error) {
        toast.error("Failed to update location: " + error.message);
        return;
      }
      
      // Update locations list with edited values
      setLocations(locations.map(loc => 
        loc.id === id ? updatedLocation : loc
      ));
      
      // Exit edit mode
      setEditableLocations(prev => ({ ...prev, [id]: false }));
      setLocationHasChanges(false);
      toast.success("Location updated successfully");
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("An unexpected error occurred");
    }
  };

  // Cancel location editing
  const handleCancelEdit = (id: string) => {
    setEditableLocations(prev => ({ ...prev, [id]: false }));
  };

  return (
    <div className="grid gap-6">
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
      <Card>
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
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="w-[180px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {editableLocations[location.id] ? (
                          <Input 
                            value={locationEdits[location.id]?.name || location.name} 
                            onChange={(e) => handleUpdateLocationField(location.id, 'name', e.target.value)}
                            className="h-8 w-full"
                          />
                        ) : (
                          location.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editableLocations[location.id] ? (
                          <Input 
                            value={locationEdits[location.id]?.address || location.address} 
                            onChange={(e) => handleUpdateLocationField(location.id, 'address', e.target.value)}
                            className="h-8 w-full"
                          />
                        ) : (
                          location.address
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {editableLocations[location.id] ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCancelEdit(location.id)}
                              className="h-8"
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleSaveLocationChanges(location.id)}
                              className="h-8"
                            >
                              <Save className="h-4 w-4 mr-1" /> Save
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditLocation(location)}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteLocation(location.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {locationHasChanges && (
                <div className="flex justify-end">
                  <p className="text-sm text-muted-foreground italic mr-2 self-center">
                    Save changes to update locations
                  </p>
                </div>
              )}
            </div>
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

export default CommunitySettingsTab;
