'use client';

import React, { useState } from 'react';

export function EcommerceUserMVP() {
  const [products] = useState([
    { id: 1, name: '프리미엄 헤드폰', price: 299000, image: '🎧', rating: 4.8 },
    { id: 2, name: '무선 키보드', price: 89000, image: '⌨️', rating: 4.5 },
    { id: 3, name: '스마트 워치', price: 349000, image: '⌚', rating: 4.7 },
    { id: 4, name: 'USB-C 허브', price: 59000, image: '🔌', rating: 4.3 },
  ]);
  const [cart, setCart] = useState<{id: number; qty: number}[]>([]);
  const [view, setView] = useState<'shop' | 'cart'>('shop');

  const addToCart = (id: number) => {
    const existing = cart.find(c => c.id === id);
    if (existing) setCart(cart.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c));
    else setCart([...cart, { id, qty: 1 }]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (products.find(p => p.id === item.id)?.price || 0) * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (view === 'cart') {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <header className="bg-orange-500 text-white p-4 flex items-center justify-between">
          <button onClick={() => setView('shop')} className="text-sm">← 쇼핑</button>
          <h1 className="font-semibold">장바구니</h1>
          <span>{cartCount}개</span>
        </header>
        <div className="flex-1 p-4 overflow-auto space-y-3">
          {cart.map(item => {
            const product = products.find(p => p.id === item.id)!;
            return (
              <div key={item.id} className="bg-white p-3 rounded-lg flex items-center gap-3">
                <span className="text-3xl">{product.image}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-orange-500 font-semibold">₩{(product.price * item.qty).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCart(cart.map(c => c.id === item.id ? { ...c, qty: Math.max(1, c.qty - 1) } : c))} className="w-6 h-6 bg-gray-200 rounded">-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => addToCart(item.id)} className="w-6 h-6 bg-gray-200 rounded">+</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t bg-white">
          <div className="flex justify-between mb-3"><span>총 금액</span><span className="text-xl font-bold text-orange-500">₩{cartTotal.toLocaleString()}</span></div>
          <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium">결제하기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <header className="bg-orange-500 text-white p-4 flex items-center justify-between">
        <h1 className="font-semibold">쇼핑몰</h1>
        <button onClick={() => setView('cart')} className="relative">🛒{cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}</button>
      </header>
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-2 gap-3">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-4xl text-center mb-2">{product.image}</div>
              <p className="font-medium text-sm truncate">{product.name}</p>
              <div className="text-xs text-yellow-500 my-1">★ {product.rating}</div>
              <p className="text-orange-500 font-semibold text-sm">₩{product.price.toLocaleString()}</p>
              <button onClick={() => addToCart(product.id)} className="w-full mt-2 bg-orange-500 text-white py-1.5 rounded text-sm">담기</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EcommerceAdminMVP() {
  const [orders, setOrders] = useState([
    { id: 1001, customer: '김철수', items: 2, total: 388000, status: 'pending', date: '03-05' },
    { id: 1002, customer: '이영희', items: 1, total: 299000, status: 'shipped', date: '03-04' },
    { id: 1003, customer: '박민수', items: 3, total: 497000, status: 'delivered', date: '03-03' },
  ]);
  const [activeTab, setActiveTab] = useState('orders');

  const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', shipped: 'bg-blue-100 text-blue-700', delivered: 'bg-green-100 text-green-700' };
  const statusLabels: Record<string, string> = { pending: '처리중', shipped: '배송중', delivered: '완료' };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <header className="bg-slate-800 text-white p-4">
        <h1 className="font-semibold">판매자 센터</h1>
        <p className="text-slate-400 text-sm">오늘 주문 3건</p>
      </header>
      <div className="flex border-b bg-white">
        {['orders', 'products', 'stats'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-sm ${activeTab === tab ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-700'}`}>
            {tab === 'orders' ? '주문관리' : tab === 'products' ? '상품관리' : '통계'}
          </button>
        ))}
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">주문 #{order.id}</p>
                    <p className="text-sm text-gray-700">{order.customer} · {order.items}개 상품</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-orange-500">₩{order.total.toLocaleString()}</span>
                  <select value={order.status} onChange={(e) => setOrders(orders.map(o => o.id === order.id ? { ...o, status: e.target.value } : o))} className="text-xs border rounded px-2 py-1">
                    <option value="pending">처리중</option>
                    <option value="shipped">배송중</option>
                    <option value="delivered">완료</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'products' && (
          <div className="space-y-3">
            {[{ name: '프리미엄 헤드폰', stock: 45, sales: 128 }, { name: '무선 키보드', stock: 23, sales: 89 }].map((p, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                <div><p className="font-medium">{p.name}</p><p className="text-sm text-gray-700">재고: {p.stock}개</p></div>
                <div className="text-right"><p className="text-orange-500 font-bold">{p.sales}개</p><p className="text-xs text-gray-700">판매량</p></div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-2 gap-3">
            {[{ label: '총 매출', value: '₩12.3M' }, { label: '주문 수', value: '156건' }, { label: '평균 객단가', value: '₩78,900' }, { label: '반품률', value: '2.1%' }].map((s, i) => (
              <div key={i} className="bg-white p-4 rounded-lg text-center"><p className="text-2xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-gray-700">{s.label}</p></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}