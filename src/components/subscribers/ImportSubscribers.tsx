
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function ImportSubscribers() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const lines = text.split("\n");
        const headers = lines[0].split(",");
        const subscribers = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",");
          if (values.length === headers.length) {
            const subscriber = {
              email: values[0],
              name: values[1] || "",
              status: "active",
              source: "CSV Import",
              joinedAt: new Date().toISOString(),
            };
            subscribers.push(subscriber);
          }
        }

        // Here we'll implement the Supabase bulk insert
        // This is just a placeholder until we set up the backend
        console.log("Subscribers to import:", subscribers);
        
        toast({
          title: "Import successful",
          description: `${subscribers.length} subscribers imported`,
        });
      };

      reader.readAsText(file);
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error importing subscribers",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".csv"
        className="hidden"
        id="csv-upload"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
      <Button
        variant="outline"
        className="gap-2"
        disabled={isUploading}
        onClick={() => document.getElementById("csv-upload")?.click()}
      >
        <Upload className="h-4 w-4" />
        Import CSV
      </Button>
    </div>
  );
}
