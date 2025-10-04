
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { InventoryItem } from '../types';
import { getItems, addItem as apiAddItem, updateItem as apiUpdateItem, deleteItem as apiDeleteItem } from '../services/inventoryService';

interface InventoryContextType {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
  addItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  updateItem: (item: InventoryItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getItemById: (id: string) => InventoryItem | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedItems = await getItems();
      setItems(fetchedItems);
    } catch (err) {
      setError("Gagal memuat data inventaris.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (item: Omit<InventoryItem, 'id'>) => {
    const newItem = await apiAddItem(item);
    setItems(prevItems => [...prevItems, newItem]);
  };

  const updateItem = async (itemToUpdate: InventoryItem) => {
    const updatedItem = await apiUpdateItem(itemToUpdate);
    setItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteItem = async (id: string) => {
    await apiDeleteItem(id);
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  const getItemById = (id: string) => {
    return items.find(item => item.id === id);
  };

  return (
    <InventoryContext.Provider value={{ items, loading, error, addItem, updateItem, deleteItem, getItemById }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
