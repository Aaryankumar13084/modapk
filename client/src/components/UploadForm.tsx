import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file-input";
import { RiUploadCloud2Line, RiImageLine } from "@/lib/icons";

const uploadFormSchema = z.object({
  name: z.string().min(3, { message: "App name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  version: z.string().min(1, { message: "Version is required" }),
  category: z.string({ required_error: "Please select a category" }),
  size: z.string().min(1, { message: "Size is required" }),
  features: z.array(z.string()).optional(),
  apkFile: z.instanceof(File, { message: "APK file is required" }),
  iconImage: z.instanceof(File).optional(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms" }),
  }),
});

type UploadFormValues = z.infer<typeof uploadFormSchema>;

export function UploadForm() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      name: "",
      description: "",
      version: "",
      category: "",
      size: "",
      features: [],
      terms: false,
    },
  });
  
  const features = [
    { id: "no-ads", label: "Ad-Free" },
    { id: "premium", label: "Premium Unlocked" },
    { id: "unlimited-resources", label: "Unlimited Resources" },
    { id: "pro-features", label: "Pro Features" },
  ];
  
  const onSubmit = async (data: UploadFormValues) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("version", data.version);
      formData.append("category", data.category);
      formData.append("size", data.size);
      
      if (data.features && data.features.length > 0) {
        formData.append("features", data.features.join(","));
      }
      
      formData.append("apkFile", data.apkFile);
      
      if (data.iconImage) {
        formData.append("iconImage", data.iconImage);
      }
      
      const response = await fetch("/api/apks", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload APK");
      }
      
      const result = await response.json();
      
      toast({
        title: "Upload Successful",
        description: `${data.name} has been uploaded successfully.`,
      });
      
      navigate(`/app/${result.id}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload APK file",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>App Name</FormLabel>
              <FormControl>
                <Input placeholder="Application Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="games">Games</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="music-audio">Music & Audio</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the features and modifications in this APK" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 1.5.2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 150MB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="apkFile"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>APK File</FormLabel>
              <FormControl>
                <FileInput
                  placeholder="Upload APK file"
                  accept=".apk"
                  icon={<RiUploadCloud2Line className="h-6 w-6 text-gray-400" />}
                  helpText="APK file up to 1GB"
                  onChange={(file) => onChange(file)}
                  {...fieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="iconImage"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>App Icon (Optional)</FormLabel>
              <FormControl>
                <FileInput
                  placeholder="Upload icon"
                  accept="image/*"
                  icon={<RiImageLine className="h-6 w-6 text-gray-400" />}
                  helpText="PNG, JPG, GIF up to 5MB"
                  onChange={(file) => onChange(file)}
                  {...fieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>Mod Features</FormLabel>
          <div className="mt-1">
            <div className="flex flex-wrap items-center">
              {features.map((feature) => (
                <FormField
                  key={feature.id}
                  control={form.control}
                  name="features"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={feature.id}
                        className="flex flex-row items-start space-x-2 space-y-0 mr-4 mb-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(feature.id)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              return checked
                                ? field.onChange([...current, feature.id])
                                : field.onChange(current.filter((value) => value !== feature.id));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-sm cursor-pointer">
                          {feature.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal text-sm">
                I confirm this APK does not contain malware and I have the right to distribute it
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Uploading..." : "Submit APK"}
        </Button>
      </form>
    </Form>
  );
}
