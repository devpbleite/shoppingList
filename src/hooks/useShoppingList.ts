import { useState, useEffect } from 'react';
import { ShoppingItem } from '@/types';

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('shoppingList');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<ShoppingItem, 'id' | 'checked'>) => {
    setItems(prev => [...prev, {
      ...item,
      id: crypto.randomUUID(),
      checked: false
    }]);
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<ShoppingItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  return { items, addItem, toggleItem, removeItem, updateItem };
}