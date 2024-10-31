import React, { createContext, useContext, useState, ReactNode } from 'react';

// Créer le contexte
const StorageContext = createContext<{
  storageUsageNeedsRefresh: boolean;
  setStorageUsageNeedsRefresh: React.Dispatch<React.SetStateAction<boolean>>;
} | undefined>(undefined);

// Créer un provider pour le contexte
export const StorageProvider = ({ children }: { children: ReactNode }) => {
  const [storageUsageNeedsRefresh, setStorageUsageNeedsRefresh] = useState(false);

  return (
    <StorageContext.Provider value={{ storageUsageNeedsRefresh, setStorageUsageNeedsRefresh }}>
      {children}
    </StorageContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};
