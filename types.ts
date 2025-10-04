
export enum Category {
  ELEKTRONIK = "Elektronik",
  FURNITUR = "Furnitur",
  ATK = "Alat Tulis Kantor",
  KEBERSIHAN = "Alat Kebersihan",
}

export enum ItemStatus {
  BAIK = "Baik",
  RUSAK_RINGAN = "Rusak Ringan",
  PERLU_PERBAIKAN = "Perlu Perbaikan",
  DIPINJAM = "Dipinjam",
  DIHAPUS = "Dihapus/Dijual",
}

export interface InventoryItem {
  id: string;
  name: string;
  serialNumber: string;
  category: Category;
  purchaseDate: string;
  price: number;
  location: string;
  assignedTo: string;
  status: ItemStatus;
  description: string;
  imageUrl?: string;
}

export enum View {
  DASHBOARD = "Dashboard",
  ITEMS = "Daftar Barang",
  REPORTS = "Laporan",
}
