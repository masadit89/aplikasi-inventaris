
import React from 'react';
import { useInventory } from '../context/InventoryContext';

export const Reports: React.FC = () => {
    const { items, loading } = useInventory();

    const handlePrint = () => {
        window.print();
    };
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center print:hidden">
                <h1 className="text-3xl font-bold text-slate-800">Laporan Inventaris</h1>
                <button
                    onClick={handlePrint}
                    className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 flex items-center shadow-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v3a2 2 0 002 2h6a2 2 0 002-2v-3h1a2 2 0 002-2v-3a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                    Cetak Laporan
                </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md" id="report-content">
                <div className="text-center mb-8 hidden print:block">
                    <h2 className="text-2xl font-bold">Laporan Lengkap Inventaris Barang Kantor</h2>
                    <p>Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</p>
                </div>
                {loading ? (
                    <p>Memuat laporan...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Nama Barang</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Kategori</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Tgl Beli</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Harga</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Lokasi</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {items.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{item.name}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{item.category}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{new Date(item.purchaseDate).toLocaleDateString('id-ID')}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right">{item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{item.location}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{item.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-100">
                                <tr>
                                    <td colSpan={3} className="px-4 py-2 text-right font-bold text-sm">Total Nilai Aset</td>
                                    <td className="px-4 py-2 text-right font-bold text-sm">
                                        {items.reduce((sum, item) => sum + item.price, 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                    </td>
                                    <td colSpan={2}></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
            <style>
            {`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #report-content, #report-content * {
                        visibility: visible;
                    }
                    #report-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}
            </style>
        </div>
    );
};
