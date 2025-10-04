
import { InventoryItem } from '../types';
import { MOCK_INVENTORY_ITEMS } from './mockData';

let items: InventoryItem[] = MOCK_INVENTORY_ITEMS;

const simulateNetworkDelay = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), 500));
};

export const getItems = async (): Promise<InventoryItem[]> => {
  console.log("Fetching items...");
  return simulateNetworkDelay([...items]);
};

export const addItem = async (itemData: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
  const newItem: InventoryItem = {
    id: `item-${Date.now()}-${Math.random()}`,
    ...itemData,
    imageUrl: itemData.imageUrl || `https://picsum.photos/seed/${Date.now()}/400/300`,
  };
  items.push(newItem);
  console.log("Added item:", newItem);
  return simulateNetworkDelay(newItem);
};

export const updateItem = async (updatedItem: InventoryItem): Promise<InventoryItem> => {
  items = items.map(item => item.id === updatedItem.id ? updatedItem : item);
  console.log("Updated item:", updatedItem);
  return simulateNetworkDelay(updatedItem);
};

export const deleteItem = async (id: string): Promise<{ success: boolean }> => {
  items = items.filter(item => item.id !== id);
  console.log("Deleted item with id:", id);
  return simulateNetworkDelay({ success: true });
};
