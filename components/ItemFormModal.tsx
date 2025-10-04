
import React, { useState, useEffect } from 'react';
import { InventoryItem, Category, ItemStatus } from '../types';
import { useInventory } from '../context/InventoryContext';
import { generateDescription } from '../services/geminiService';

interface ItemFormModalProps {
  item?: InventoryItem;
  onClose: () => void;
}

const initialFormState: Omit<InventoryItem, 'id'> = {
  name: '',
  serialNumber: '',
  category: Category.ELEKTRONIK,
  purchaseDate: '',
  price: 0,
  location: '',
  assignedTo: '',
  status: ItemStatus.BAIK,
  description: '',
  imageUrl: '',
};

export const ItemFormModal: React.FC<ItemFormModalProps> = ({ item, onClose }) => {
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>(initialFormState);
  const { addItem, updateItem } = useInventory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        purchaseDate: item.purchaseDate.split('T')[0] // Format for date input
      });
    } else {
      setFormData(initialFormState);
    }
  }, [item]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) {
      alert("Masukkan nama barang terlebih dahulu.");
      return;
    }
    setIsGenerating(true);
    try {
      const description = await generateDescription(formData.name);
      setFormData(prev => ({ ...prev, description }));
    } catch(error) {
      console.error("Failed to generate description:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (item) {
        await updateItem({ ...formData, id: item.id });
      } else {
        await addItem(formData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">{item ? 'Edit Barang' : 'Tambah Barang Baru'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Nama Barang</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Nomor Seri</label>
              <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm" required />
            </div>
          </div>
           <div>
            <label className="block text-sm font-medium text-slate-700">Deskripsi</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"></textarea>
            <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="mt-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-slate-400 disabled:cursor-wait flex items-center">
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Membuat...
                </>
              ) : 'Buat deskripsi dengan AI ✨'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Kategori</label>
              <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm">
                {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm">
                {Object.values(ItemStatus).map(stat => <option key={stat} value={stat}>{stat}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Tanggal Pembelian</label>
              <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Harga (IDR)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Lokasi</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Penanggung Jawab</label>
              <input type="text" name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition mr-2">Batal</button>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
