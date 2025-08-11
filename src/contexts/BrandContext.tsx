import { createContext, useContext, useState, ReactNode } from 'react';

interface BrandContextType {
  selectedBrandId: string | null;
  setSelectedBrandId: (brandId: string | null) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider = ({ children }: { children: ReactNode }) => {
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  return (
    <BrandContext.Provider value={{ selectedBrandId, setSelectedBrandId }}>
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