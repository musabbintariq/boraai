import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

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

interface CreateBrandData {
  name: string;
  description?: string;
  industry?: string;
  website_url?: string;
}

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBrands();
    } else {
      setBrands([]);
      setLoading(false);
    }
  }, [user]);

  // Real-time subscription for brands
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('brands-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'brands',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time brands update:', payload);
          fetchBrands(); // Refresh data when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  const createBrand = async (brandData: CreateBrandData): Promise<Brand | null> => {
    if (!user) {
      toast.error('You must be logged in to create a brand');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('brands')
        .insert({
          user_id: user.id,
          ...brandData
        })
        .select()
        .single();

      if (error) throw error;

      setBrands(prev => [data, ...prev]);
      toast.success('Brand created successfully');
      return data;
    } catch (error) {
      console.error('Error creating brand:', error);
      toast.error('Failed to create brand');
      return null;
    }
  };

  const updateBrand = async (id: string, updates: Partial<CreateBrandData>): Promise<Brand | null> => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .update(updates)
        .eq('brand_id', id)
        .select()
        .single();

      if (error) throw error;

      setBrands(prev => prev.map(brand => 
        brand.brand_id === id ? data : brand
      ));
      toast.success('Brand updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating brand:', error);
      toast.error('Failed to update brand');
      return null;
    }
  };

  const deleteBrand = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('brand_id', id);

      if (error) throw error;

      setBrands(prev => prev.filter(brand => brand.brand_id !== id));
      toast.success('Brand deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error('Failed to delete brand');
      return false;
    }
  };

  return {
    brands,
    loading,
    createBrand,
    updateBrand,
    deleteBrand,
    refetch: fetchBrands
  };
};