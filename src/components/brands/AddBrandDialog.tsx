import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useBrands } from "@/hooks/useBrands";
import { useNavigate } from "react-router-dom";

interface AddBrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBrandDialog({ open, onOpenChange }: AddBrandDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    website_url: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createBrand } = useBrands();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      const brand = await createBrand({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        industry: formData.industry.trim() || undefined,
        website_url: formData.website_url.trim() || undefined,
      });

      if (brand) {
        setFormData({ name: "", description: "", industry: "", website_url: "" });
        onOpenChange(false);
        // Navigate to brand strategy setup
        navigate(`/dashboard/brands/${brand.brand_id}/setup`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "", industry: "", website_url: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Brand</DialogTitle>
          <DialogDescription>
            Create a new brand profile to start building their content strategy.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Brand Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Nike, Apple, Coca-Cola"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the brand..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              placeholder="e.g., Technology, Fashion, Food & Beverage"
              value={formData.industry}
              onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              type="url"
              placeholder="https://example.com"
              value={formData.website_url}
              onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name.trim() || isSubmitting} className="flex-1">
              {isSubmitting ? "Creating..." : "Create Brand"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}