import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BrandContextType {
  activeBrandId: string | null;
  setActiveBrandId: (brandId: string | null) => void;
  autoSelectBrand: (brands: any[]) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider = ({ children }: { children: ReactNode }) => {
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);

  const handleSetActiveBrandId = (brandId: string | null) => {
    setActiveBrandId(brandId);
    if (brandId) {
      localStorage.setItem('activeBrandId', brandId);
    } else {
      localStorage.removeItem('activeBrandId');
    }
  };

  const autoSelectBrand = (brands: any[]) => {
    if (!activeBrandId && brands.length > 0) {
      const lastUsedBrandId = localStorage.getItem('activeBrandId');
      const brandToSelect = lastUsedBrandId && brands.find(b => b.brand_id === lastUsedBrandId) 
        ? lastUsedBrandId 
        : brands[0].brand_id;
      setActiveBrandId(brandToSelect);
    }
  };

  return (
    <BrandContext.Provider value={{ 
      activeBrandId, 
      setActiveBrandId: handleSetActiveBrandId,
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