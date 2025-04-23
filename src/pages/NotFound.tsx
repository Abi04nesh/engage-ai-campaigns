
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center">
          <div className="text-8xl font-bold text-gradient">404</div>
        </div>
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved. Please check the URL or go back to the homepage.
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
