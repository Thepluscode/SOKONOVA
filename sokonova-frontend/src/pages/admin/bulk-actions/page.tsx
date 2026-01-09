import { useState } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'pending';
  seller: string;
}

export default function BulkActionsPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const products: Product[] = [
    { id: '1', name: 'African Print Dress', sku: 'APD-001', price: 89.99, stock: 45, status: 'active', seller: 'Fashion Hub' },
    { id: '2', name: 'Handwoven Basket', sku: 'HWB-002', price: 34.99, stock: 12, status: 'active', seller: 'Craft Masters' },
    { id: '3', name: 'Leather Sandals', sku: 'LS-003', price: 54.99, stock: 0, status: 'inactive', seller: 'Shoe Palace' },
    { id: '4', name: 'Beaded Necklace', sku: 'BN-004', price: 29.99, stock: 67, status: 'pending', seller: 'Jewelry Co' },
    { id: '5', name: 'Wooden Sculpture', sku: 'WS-005', price: 124.99, stock: 8, status: 'active', seller: 'Art Gallery' },
  ];

  const toggleSelectAll = () => {
    if (selectedItems.length === products.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(products.map(p => p.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const executeBulkAction = async () => {
    if (!bulkAction || selectedItems.length === 0) return;

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert(`Bulk action "${bulkAction}" executed on ${selectedItems.length} items`);
    setIsProcessing(false);
    setSelectedItems([]);
    setBulkAction('');
  };

  const exportSelected = () => {
    const selectedProducts = products.filter(p => selectedItems.includes(p.id));
    const csv = [
      ['ID', 'Name', 'SKU', 'Price', 'Stock', 'Status', 'Seller'],
      ...selectedProducts.map(p => [p.id, p.name, p.sku, p.price, p.stock, p.status, p.seller])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-export.csv';
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Actions</h1>
          <p className="text-gray-600">Manage multiple items at once</p>
        </div>

        {/* Bulk Action Bar */}
        {selectedItems.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-gray-900">
                  {selectedItems.length} items selected
                </span>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select action...</option>
                  <option value="activate">Activate</option>
                  <option value="deactivate">Deactivate</option>
                  <option value="delete">Delete</option>
                  <option value="update_price">Update Price</option>
                  <option value="update_stock">Update Stock</option>
                  <option value="assign_category">Assign Category</option>
                </select>
                <button
                  onClick={executeBulkAction}
                  disabled={!bulkAction || isProcessing}
                  className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportSelected}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-download-line mr-2"></i>
                  Export
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === products.length}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">SKU</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Seller</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr 
                    key={product.id}
                    className={selectedItems.includes(product.id) ? 'bg-emerald-50' : 'hover:bg-gray-50'}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(product.id)}
                        onChange={() => toggleSelectItem(product.id)}
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.seller}</td>
                    <td className="px-6 py-4">
                      <button className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                        <i className="ri-more-2-fill text-xl"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
