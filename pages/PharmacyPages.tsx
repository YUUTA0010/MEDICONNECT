import React, { useState } from 'react';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { INVENTORY, MEDICINES } from '../constants';
import { StockStatus } from '../types';

export const PharmacyDashboard = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  // Mock state for orders
  const [orders, setOrders] = useState([
    { id: 'o1', customer: 'John Doe', items: 'Dolo 650 x2', total: 60, status: 'PENDING', time: '10 min ago' },
    { id: 'o2', customer: 'Sarah Smith', items: 'Augmentin 625 x1', total: 200, status: 'READY', time: '1 hour ago' }
  ]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Pharmacy Dashboard</h1>
          <p className="text-slate-500">Apollo Pharmacy (ID: ph1)</p>
        </div>
        <div className="flex gap-2">
          <Button variant={activeTab === 'inventory' ? 'primary' : 'outline'} onClick={() => setActiveTab('inventory')}>
            Inventory
          </Button>
          <Button variant={activeTab === 'orders' ? 'primary' : 'outline'} onClick={() => setActiveTab('orders')}>
            Orders
          </Button>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-slate-600">Medicine Name</th>
                <th className="p-4 font-semibold text-slate-600">Stock Qty</th>
                <th className="p-4 font-semibold text-slate-600">Status</th>
                <th className="p-4 font-semibold text-slate-600">Price</th>
                <th className="p-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {INVENTORY.filter(i => i.pharmacyId === 'ph1').map((item, idx) => {
                const med = MEDICINES.find(m => m.id === item.medicineId);
                return (
                  <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="p-4 font-medium">{med?.name}</td>
                    <td className="p-4">{item.stockQty}</td>
                    <td className="p-4">
                      <Badge color={item.stockStatus === StockStatus.IN_STOCK ? 'green' : item.stockStatus === StockStatus.LOW_STOCK ? 'yellow' : 'red'}>
                        {item.stockStatus}
                      </Badge>
                    </td>
                    <td className="p-4">₹{item.price}</td>
                    <td className="p-4">
                        <button className="text-primary hover:underline">Update</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="p-4 bg-slate-50 border-t text-center">
            <Button variant="outline" className="text-sm">+ Add New Medicine</Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">Order #{order.id}</h3>
                    <Badge color={order.status === 'PENDING' ? 'yellow' : 'green'}>{order.status}</Badge>
                </div>
                <p className="text-slate-500 text-sm flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {order.time} • {order.customer}
                </p>
                <p className="font-medium mt-1">{order.items}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <span className="font-bold text-lg">₹{order.total}</span>
                 <div className="flex gap-2">
                    {order.status === 'PENDING' && (
                        <>
                            <Button className="h-8 text-xs" variant="primary" onClick={() => {
                                setOrders(orders.map(o => o.id === order.id ? {...o, status: 'ACCEPTED'} : o));
                            }}>Accept</Button>
                            <Button className="h-8 text-xs" variant="danger">Reject</Button>
                        </>
                    )}
                    {order.status === 'ACCEPTED' && (
                         <Button className="h-8 text-xs" variant="secondary" onClick={() => {
                            setOrders(orders.map(o => o.id === order.id ? {...o, status: 'READY'} : o));
                        }}>Mark Ready</Button>
                    )}
                     {order.status === 'READY' && (
                         <Button className="h-8 text-xs" variant="primary">Deliver</Button>
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
