import { Building2, ExternalLink, Globe, Calendar, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BrandStrategyModal } from "./BrandStrategyModal";
import { useBrands } from "@/hooks/useBrands";

interface Brand {
  brand_id: string;
  user_id: string;
  name: string;
  description: string | null;
  industry: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

interface BrandCardProps {
  brand: Brand;
}

export function BrandCard({ brand }: BrandCardProps) {
  const navigate = useNavigate();
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  const { deleteBrand } = useBrands();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleManageClick = () => {
    setIsStrategyModalOpen(true);
  };

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (brand.website_url) {
      window.open(brand.website_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDeleteBrand = async () => {
    await deleteBrand(brand.brand_id);
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">{brand.name}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {brand.website_url && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleWebsiteClick}
                className="h-8 w-8 p-0"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Brand</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{brand.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteBrand}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {brand.description && (
          <CardDescription className="line-clamp-2">
            {brand.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {brand.industry && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{brand.industry}</Badge>
            </div>
          )}
          
          {brand.website_url && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span className="truncate">{brand.website_url.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(brand.created_at)}</span>
          </div>
          
          <Button onClick={handleManageClick} className="w-full mt-4">
            Manage Brand
          </Button>
        </div>
      </CardContent>

      <BrandStrategyModal 
        open={isStrategyModalOpen} 
        onOpenChange={setIsStrategyModalOpen}
        brandId={brand.brand_id}
        brandName={brand.name}
      />
    </Card>
  );
}