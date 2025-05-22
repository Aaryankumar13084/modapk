import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  onChange?: (file: File | undefined) => void;
  icon?: React.ReactNode;
  helpText?: string;
}

export function FileInput({ 
  className, 
  onChange, 
  accept, 
  icon, 
  helpText, 
  placeholder = "Upload file", 
  ...props 
}: FileInputProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onChange?.(file);
    } else {
      setFileName(null);
      onChange?.(undefined);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && inputRef.current) {
      // Check if the file type matches the accept attribute
      if (accept) {
        const acceptTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type;
        const fileExt = `.${file.name.split('.').pop()}`;
        
        const isAccepted = acceptTypes.some(type => {
          if (type.startsWith('.')) {
            return fileExt.toLowerCase() === type.toLowerCase();
          } else if (type.includes('*')) {
            const [mainType] = type.split('/');
            return fileType.startsWith(`${mainType}/`);
          }
          return fileType === type;
        });
        
        if (!isAccepted) {
          return;
        }
      }
      
      // Create a DataTransfer object to set the file to the input
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      inputRef.current.files = dataTransfer.files;
      
      // Trigger the onChange event manually
      setFileName(file.name);
      onChange?.(file);
    }
  };
  
  return (
    <div 
      className={cn(
        "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md bg-white",
        isDragging ? "border-primary" : "border-gray-300",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-1 text-center">
        {icon}
        <div className="flex text-sm text-gray-700">
          <label 
            htmlFor={props.id || "file-upload"} 
            className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-indigo-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
          >
            <span>{placeholder}</span>
            <input 
              ref={inputRef}
              id={props.id || "file-upload"} 
              type="file" 
              className="sr-only" 
              onChange={handleFileChange}
              accept={accept}
              {...props}
            />
          </label>
          <p className="pl-1 text-gray-700">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-700">
          {fileName || helpText}
        </p>
      </div>
    </div>
  );
}
