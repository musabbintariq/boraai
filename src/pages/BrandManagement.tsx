import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, ExternalLink, Globe, Edit3, Target, MessageSquare } from "lucide-react";
import { useBrands } from "@/hooks/useBrands";
import { BrandStrategyModal } from "@/components/brands/BrandStrategyModal";

export default function BrandManagement() {
  const { brandId } = useParams<{ brandId: string }>();
  const navigate = useNavigate();
  const { brands, loading } = useBrands();
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  
  const brand = brands.find(b => b.brand_id === brandId);

  useEffect(() => {
    if (!loading && !brand && brandId) {
      navigate('/dashboard');
    }
  }, [brand, loading, brandId, navigate]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!brand) {
    return null;
  }

  const handleWebsiteClick = () => {
    if (brand.website_url) {
      window.open(brand.website_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Brands
        </Button>
      </div>

      {/* Brand Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{brand.name}</h1>
            {brand.description && (
              <p className="text-muted-foreground mt-1">{brand.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2">
              {brand.industry && <Badge variant="secondary">{brand.industry}</Badge>}
              {brand.website_url && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleWebsiteClick}
                  className="gap-2 text-muted-foreground"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsStrategyModalOpen(true)}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Brand Voice</CardTitle>
                <CardDescription>Define tone and communication style</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Edit3 className="h-4 w-4 mr-2" />
              Manage Voice Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsStrategyModalOpen(true)}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Target Audience</CardTitle>
                <CardDescription>Create and manage audience personas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Edit3 className="h-4 w-4 mr-2" />
              Manage Audience Persona
            </Button>
          </CardContent>
        </Card>
      </div>

      <BrandStrategyModal 
        open={isStrategyModalOpen} 
        onOpenChange={setIsStrategyModalOpen}
        brandId={brand.brand_id}
        brandName={brand.name}
      />
    </div>
  );
}