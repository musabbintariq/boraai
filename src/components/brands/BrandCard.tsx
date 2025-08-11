import { Building2, ExternalLink, Globe, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Brand {
  id: string;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleManageClick = () => {
    navigate(`/dashboard/brands/${brand.id}`);
  };

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (brand.website_url) {
      window.open(brand.website_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">{brand.name}</CardTitle>
          </div>
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
    </Card>
  );
}