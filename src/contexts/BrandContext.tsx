import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BrandContextType {
  selectedBrandId: string | null;
  setSelectedBrandId: (brandId: string | null) => void;
  autoSelectBrand: (brands: any[]) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider = ({ children }: { children: ReactNode }) => {
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  const handleSetSelectedBrandId = (brandId: string | null) => {
    setSelectedBrandId(brandId);
    if (brandId) {
      localStorage.setItem('lastSelectedBrandId', brandId);
    } else {
      localStorage.removeItem('lastSelectedBrandId');
    }
  };

  const autoSelectBrand = (brands: any[]) => {
    if (!selectedBrandId && brands.length > 0) {
      const lastUsedBrandId = localStorage.getItem('lastSelectedBrandId');
      const brandToSelect = lastUsedBrandId && brands.find(b => b.brand_id === lastUsedBrandId) 
        ? lastUsedBrandId 
        : brands[0].brand_id;
      setSelectedBrandId(brandToSelect);
    }
  };

  return (
    <BrandContext.Provider value={{ 
      selectedBrandId, 
      setSelectedBrandId: handleSetSelectedBrandId,
      autoSelectBrand 
    }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrandContext = () => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrandContext must be used within a BrandProvider');
  }
  return context;
};