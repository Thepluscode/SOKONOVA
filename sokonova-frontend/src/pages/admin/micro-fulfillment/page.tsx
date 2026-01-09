import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

export default function MicroFulfillmentPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const warehouses = [
    { id: 'lagos', name: 'Lagos Hub', location: 'Lagos, Nigeria', capacity: 85, orders: 234 },
    { id: 'nairobi', name: 'Nairobi Hub', location: 'Nairobi, Kenya', capacity: 72, orders: 189 },
    { id: 'accra', name: 'Accra Hub', location: 'Accra, Ghana', capacity: 68, orders: 156 },
    { id: 'johannesburg', name: 'Johannesburg Hub', location: 'Johannesburg, SA', capacity: 91, orders: 312 }
  ];

  const fulfillmentQueue = [
    {
      id: 'FF-2024-001',
      orderId: 'ORD-2024-8901',
      warehouse: 'Lagos Hub',
      items: 3,
      priority: 'high',
      status: 'picking',
      customer: 'Amara Okafor',
      location: 'Lagos',
      deadline: '2 hours',
      assignedTo: 'John Mensah'
    },
    {
      id: 'FF-2024-002',
      orderId: 'ORD-2024-8902',
      warehouse: 'Nairobi Hub',
      items: 1,
      priority: 'urgent',
      status: 'packing',
      customer: 'Wanjiku Kimani',
      location: 'Nairobi',
      deadline: '30 mins',
      assignedTo: 'Sarah Mwangi'
    },
    {
      id: 'FF-2024-003',
      orderId: 'ORD-2024-8903',
      warehouse: 'Accra Hub',
      items: 5,
      priority: 'normal',
      status: 'ready',
      customer: 'Kwame Asante',
      location: 'Accra',
      deadline: '4 hours',
      assignedTo: 'Emmanuel Boateng'
    },
    {
      id: 'FF-2024-004',
      orderId: 'ORD-2024-8904',
      warehouse: 'Lagos Hub',
      items: 2,
      priority: 'high',
      status: 'picking',
      customer: 'Chioma Nwosu',
      location: 'Lagos',
      deadline: '1 hour',
      assignedTo: 'John Mensah'
    },
    {
      id: 'FF-2024-005',
      orderId: 'ORD-2024-8905',
      warehouse: 'Johannesburg Hub',
      items: 4,
      priority: 'normal',
      status: 'shipped',
      customer: 'Thabo Mbeki',
      location: 'Johannesburg',
      deadline: 'Completed',
      assignedTo: 'Sipho Ndlovu'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'picking': return 'bg-blue-100 text-blue-700';
      case 'packing': return 'bg-yellow-100 text-yellow-700';
      case 'ready': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'normal': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link to="/admin/ops" className="hover:text-emerald-600">Admin</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-gray-900 font-medium">Micro-Fulfillment</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Micro-Fulfillment Dashboard</h1>
              <p className="text-gray-600 mt-2">Real-time warehouse operations and order fulfillment</p>
            </div>
            <Button className="whitespace-nowrap">
              <i className="ri-download-line mr-2"></i>
              Export Report
            </Button>
          </div>
        </div>

        {/* Warehouse Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {warehouses.map((warehouse) => (
            <div key={warehouse.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{warehouse.name}</h3>
                  <p className="text-sm text-gray-600">{warehouse.location}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <i className="ri-store-3-line text-emerald-600 text-xl"></i>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-semibold text-gray-900">{warehouse.capacity}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        warehouse.capacity > 80 ? 'bg-red-600' : 
                        warehouse.capacity > 60 ? 'bg-yellow-600' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${warehouse.capacity}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Active Orders</span>
                  <span className="text-lg font-bold text-gray-900">{warehouse.orders}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse</label>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Warehouses</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Statuses</option>
                <option value="picking">Picking</option>
                <option value="packing">Packing</option>
                <option value="ready">Ready to Ship</option>
                <option value="shipped">Shipped</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Order ID or customer..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Fulfillment Queue */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Fulfillment Queue</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Fulfillment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Warehouse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fulfillmentQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm font-medium text-gray-900">{item.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{item.orderId}</div>
                        <div className="text-gray-600">{item.customer}</div>
                        <div className="text-xs text-gray-500">{item.items} items</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.warehouse}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                        {item.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        item.deadline.includes('mins') ? 'text-red-600' :
                        item.deadline.includes('hour') && parseInt(item.deadline) <= 2 ? 'text-orange-600' :
                        'text-gray-900'
                      }`}>
                        {item.deadline}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                          <i className="ri-eye-line text-lg"></i>
                        </button>
                        <button className="text-blue-600 hover:text-blue-700 cursor-pointer">
                          <i className="ri-edit-line text-lg"></i>
                        </button>
                      </div>
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
