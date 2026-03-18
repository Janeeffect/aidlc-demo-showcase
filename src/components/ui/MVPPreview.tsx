'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MVPPreviewProps {
  projectIdea: string;
}

export default function MVPPreview({ projectIdea }: MVPPreviewProps) {
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'desktop'>('desktop');
  const [activePersona, setActivePersona] = useState<'user' | 'admin'>('user');

  const getPersonaLabels = () => {
    const idea = projectIdea.toLowerCase();
    if (idea.includes('쇼핑') || idea.includes('이커머스') || idea.includes('주문')) {
      return { user: '고객', admin: '판매자' };
    }
    if (idea.includes('예약') || idea.includes('booking') || idea.includes('진료')) {
      return { user: '고객', admin: '서비스 제공자' };
    }
    if (idea.includes('교육') || idea.includes('강의') || idea.includes('학습')) {
      return { user: '학습자', admin: '강사' };
    }
    if (idea.includes('채팅') || idea.includes('협업')) {
      return { user: '팀원', admin: '관리자' };
    }
    return { user: '사용자', admin: '관리자' };
  };

  const labels = getPersonaLabels();

  const renderMVPContent = () => {
    const idea = projectIdea.toLowerCase();
    
    if (idea.includes('쇼핑') || idea.includes('상품') || idea.includes('주문') || idea.includes('이커머스')) {
      return activePersona === 'user' ? <EcommerceUserMVP /> : <EcommerceAdminMVP />;
    }
    if (idea.includes('예약') || idea.includes('booking') || idea.includes('진료')) {
      return activePersona === 'user' ? <BookingUserMVP /> : <BookingAdminMVP />;
    }
    if (idea.includes('교육') || idea.includes('강의') || idea.includes('학습') || idea.includes('lms')) {
      return activePersona === 'user' ? <LearningUserMVP /> : <LearningAdminMVP />;
    }
    if (idea.includes('채팅') || idea.includes('chat') || idea.includes('협업')) {
      return activePersona === 'user' ? <ChatUserMVP /> : <ChatAdminMVP />;
    }
    return activePersona === 'user' ? <DashboardUserMVP title={projectIdea} /> : <DashboardAdminMVP title={projectIdea} />;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Persona & Device Toggle */}
      <div className="flex gap-6 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActivePersona('user')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activePersona === 'user' ? 'bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] text-white' : 'bg-[#2a2a3a] text-[#e4e4ed]'
            }`}
          >
            {labels.user}
          </button>
          <button
            onClick={() => setActivePersona('admin')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activePersona === 'admin' ? 'bg-gradient-to-r from-[#22c55e] to-[#4ade80] text-white' : 'bg-[#2a2a3a] text-[#e4e4ed]'
            }`}
          >
            {labels.admin}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveDevice('mobile')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeDevice === 'mobile' ? 'bg-[#7c5cfc] text-white' : 'bg-[#2a2a3a] text-[#e4e4ed]'
            }`}
          >
            모바일
          </button>
          <button
            onClick={() => setActiveDevice('desktop')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeDevice === 'desktop' ? 'bg-[#7c5cfc] text-white' : 'bg-[#2a2a3a] text-[#e4e4ed]'
            }`}
          >
            데스크톱
          </button>
        </div>
      </div>

      <motion.div layout className={`bg-[#000] rounded-2xl p-1 ${activeDevice === 'mobile' ? 'w-[320px]' : 'w-full max-w-4xl'}`}>
        <div className="bg-[#1a1a1a] rounded-t-xl px-4 py-1.5 flex items-center justify-between">
          {activeDevice === 'mobile' ? (
            <div className="w-full flex justify-center"><div className="w-16 h-1 bg-[#333] rounded-full" /></div>
          ) : (
            <>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className={`text-xs ${activePersona === 'user' ? 'text-blue-400' : 'text-green-400'}`}>
                {activePersona === 'user' ? labels.user : labels.admin} 화면
              </span>
              <div className="w-12" />
            </>
          )}
        </div>
        <div className={`bg-white rounded-b-xl overflow-hidden ${activeDevice === 'mobile' ? 'h-[560px]' : 'h-[480px]'}`}>
          {renderMVPContent()}
        </div>
      </motion.div>
      <p className="mt-4 text-[#b0b0c0] text-sm">실제 작동하는 MVP - 두 페르소나 모두 테스트 가능</p>
    </div>
  );
}


// ========== 이커머스 ==========
function EcommerceUserMVP() {
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

function EcommerceAdminMVP() {
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


// ========== 예약 ==========
function BookingUserMVP() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const services = ['일반 진료', '건강 검진', '예방 접종', '상담'];
  const dates = ['3월 5일 (수)', '3월 6일 (목)', '3월 7일 (금)'];
  const times = ['09:00', '10:00', '14:00', '15:00', '16:00'];

  if (step === 4) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-teal-50 p-6">
        <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white text-2xl mb-4">✓</div>
        <h2 className="text-xl font-semibold mb-2">예약 완료</h2>
        <div className="bg-white rounded-lg p-4 w-full max-w-xs text-center shadow-sm">
          <p className="text-gray-800 text-sm">{selectedService}</p>
          <p className="font-semibold text-lg my-2">{selectedDate}</p>
          <p className="text-teal-600 font-medium">{selectedTime}</p>
        </div>
        <button onClick={() => { setStep(1); setSelectedService(''); setSelectedDate(''); setSelectedTime(''); }} className="mt-6 text-teal-600 text-sm">새 예약</button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <header className="bg-teal-600 text-white p-4">
        <h1 className="font-semibold">예약하기</h1>
        <div className="flex gap-2 mt-2">{[1, 2, 3].map(s => <div key={s} className={`flex-1 h-1 rounded ${step >= s ? 'bg-white' : 'bg-teal-400'}`} />)}</div>
      </header>
      <div className="flex-1 p-4 overflow-auto">
        {step === 1 && <div className="space-y-2">{services.map(s => <button key={s} onClick={() => setSelectedService(s)} className={`w-full p-3 rounded-lg text-left ${selectedService === s ? 'bg-teal-500 text-white' : 'bg-white border'}`}>{s}</button>)}</div>}
        {step === 2 && <div className="grid grid-cols-2 gap-2">{dates.map(d => <button key={d} onClick={() => setSelectedDate(d)} className={`p-3 rounded-lg text-sm ${selectedDate === d ? 'bg-teal-500 text-white' : 'bg-white border'}`}>{d}</button>)}</div>}
        {step === 3 && <div className="grid grid-cols-3 gap-2">{times.map(t => <button key={t} onClick={() => setSelectedTime(t)} className={`p-3 rounded-lg text-sm ${selectedTime === t ? 'bg-teal-500 text-white' : 'bg-white border'}`}>{t}</button>)}</div>}
      </div>
      <div className="p-4 border-t bg-white">
        <button onClick={() => setStep(step + 1)} disabled={(step === 1 && !selectedService) || (step === 2 && !selectedDate) || (step === 3 && !selectedTime)} className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-300">{step === 3 ? '예약 확정' : '다음'}</button>
      </div>
    </div>
  );
}

function BookingAdminMVP() {
  const [bookings, setBookings] = useState([
    { id: 1, customer: '김철수', service: '일반 진료', date: '3월 5일', time: '09:00', status: 'confirmed' },
    { id: 2, customer: '이영희', service: '건강 검진', date: '3월 5일', time: '10:00', status: 'pending' },
    { id: 3, customer: '박민수', service: '상담', date: '3월 6일', time: '14:00', status: 'completed' },
  ]);
  const [view, setView] = useState('today');

  const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700' };
  const statusLabels: Record<string, string> = { pending: '대기', confirmed: '확정', completed: '완료' };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <header className="bg-slate-800 text-white p-4">
        <h1 className="font-semibold">예약 관리</h1>
        <p className="text-slate-400 text-sm">오늘 예약 2건</p>
      </header>
      <div className="flex border-b bg-white">
        {['today', 'all', 'calendar'].map(tab => (
          <button key={tab} onClick={() => setView(tab)} className={`flex-1 py-2 text-sm ${view === tab ? 'border-b-2 border-teal-500 text-teal-500' : 'text-gray-700'}`}>
            {tab === 'today' ? '오늘' : tab === 'all' ? '전체' : '캘린더'}
          </button>
        ))}
      </div>
      <div className="flex-1 p-4 overflow-auto space-y-3">
        {bookings.map(b => (
          <div key={b.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div><p className="font-semibold">{b.customer}</p><p className="text-sm text-gray-700">{b.service}</p></div>
              <span className={`px-2 py-1 rounded text-xs ${statusColors[b.status]}`}>{statusLabels[b.status]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-teal-600 font-medium">{b.date} {b.time}</span>
              <select value={b.status} onChange={(e) => setBookings(bookings.map(x => x.id === b.id ? { ...x, status: e.target.value } : x))} className="text-xs border rounded px-2 py-1">
                <option value="pending">대기</option>
                <option value="confirmed">확정</option>
                <option value="completed">완료</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== 학습 ==========
function LearningUserMVP() {
  const [courses] = useState([
    { id: 1, title: 'React 완벽 가이드', progress: 75, lessons: 24 },
    { id: 2, title: 'TypeScript 마스터', progress: 30, lessons: 18 },
  ]);
  const [activeCourse, setActiveCourse] = useState<number | null>(null);

  if (activeCourse) {
    const course = courses.find(c => c.id === activeCourse)!;
    return (
      <div className="h-full flex flex-col bg-gray-900">
        <div className="bg-black aspect-video flex items-center justify-center relative">
          <div className="text-6xl">▶️</div>
          <div className="absolute bottom-2 left-2 right-2 bg-gray-800 rounded h-1"><div className="bg-purple-500 h-full rounded" style={{ width: '35%' }} /></div>
        </div>
        <div className="flex-1 bg-white p-4 overflow-auto">
          <button onClick={() => setActiveCourse(null)} className="text-purple-600 text-sm mb-2">← 목록</button>
          <h2 className="font-semibold text-lg">{course.title}</h2>
          <div className="space-y-2 mt-4">
            {Array.from({ length: 5 }, (_, i) => (
              <button key={i} className={`w-full p-3 rounded-lg text-left text-sm flex items-center gap-2 ${i === 0 ? 'bg-purple-100 text-purple-700' : 'bg-gray-50'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${i < 3 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>{i < 3 ? '✓' : i + 1}</span>
                강의 {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <header className="bg-purple-600 text-white p-4"><h1 className="font-semibold">내 학습</h1></header>
      <div className="flex-1 p-4 overflow-auto space-y-3">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-lg p-4 shadow-sm cursor-pointer" onClick={() => setActiveCourse(course.id)}>
            <h3 className="font-medium">{course.title}</h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2"><div className="bg-purple-500 h-full rounded-full" style={{ width: `${course.progress}%` }} /></div>
              <span className="text-xs text-purple-600">{course.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LearningAdminMVP() {
  const [courses] = useState([
    { id: 1, title: 'React 완벽 가이드', students: 1234, rating: 4.8, revenue: 12300000 },
    { id: 2, title: 'TypeScript 마스터', students: 856, rating: 4.6, revenue: 8560000 },
  ]);
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <header className="bg-slate-800 text-white p-4"><h1 className="font-semibold">강사 대시보드</h1><p className="text-slate-400 text-sm">총 수강생 2,090명</p></header>
      <div className="flex border-b bg-white">
        {['courses', 'students', 'revenue'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-sm ${activeTab === tab ? 'border-b-2 border-purple-500 text-purple-500' : 'text-gray-700'}`}>
            {tab === 'courses' ? '강좌' : tab === 'students' ? '수강생' : '수익'}
          </button>
        ))}
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {activeTab === 'courses' && (
          <div className="space-y-3">
            {courses.map(c => (
              <div key={c.id} className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold">{c.title}</h3>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-700">수강생 {c.students}명</span>
                  <span className="text-yellow-500">★ {c.rating}</span>
                </div>
              </div>
            ))}
            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-700">+ 새 강좌 만들기</button>
          </div>
        )}
        {activeTab === 'revenue' && (
          <div className="grid grid-cols-2 gap-3">
            {[{ label: '총 수익', value: '₩20.8M' }, { label: '이번 달', value: '₩3.2M' }, { label: '평균 평점', value: '4.7' }, { label: '완강률', value: '68%' }].map((s, i) => (
              <div key={i} className="bg-white p-4 rounded-lg text-center"><p className="text-2xl font-bold text-purple-600">{s.value}</p><p className="text-xs text-gray-700">{s.label}</p></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// ========== 채팅/협업 ==========
function ChatUserMVP() {
  const [messages, setMessages] = useState([
    { id: 1, user: '김개발', text: '오늘 배포 일정 확인해주세요', time: '09:30', isMe: false },
    { id: 2, user: '나', text: '확인했습니다!', time: '10:00', isMe: true },
  ]);
  const [newMsg, setNewMsg] = useState('');

  const sendMessage = () => {
    if (newMsg.trim()) {
      setMessages([...messages, { id: Date.now(), user: '나', text: newMsg, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }), isMe: true }]);
      setNewMsg('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white p-4"><h1 className="font-semibold"># 개발팀</h1></header>
      <div className="flex-1 p-4 overflow-auto space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${msg.isMe ? 'bg-blue-500' : 'bg-gray-400'}`}>{msg.user[0]}</div>
            <div className={`max-w-[70%] ${msg.isMe ? 'text-right' : ''}`}>
              <div className="text-xs text-gray-700 mb-1">{msg.user} · {msg.time}</div>
              <div className={`p-2 rounded-lg text-sm ${msg.isMe ? 'bg-blue-500 text-white' : 'bg-white'}`}>{msg.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t bg-white flex gap-2">
        <input type="text" value={newMsg} onChange={(e) => setNewMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="메시지..." className="flex-1 p-2 border rounded-lg text-sm" />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded-lg text-sm">전송</button>
      </div>
    </div>
  );
}

function ChatAdminMVP() {
  const [members] = useState([
    { id: 1, name: '김개발', role: '개발자', status: 'online' },
    { id: 2, name: '이디자인', role: '디자이너', status: 'online' },
    { id: 3, name: '박기획', role: 'PM', status: 'offline' },
  ]);
  const [activeTab, setActiveTab] = useState('members');

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <header className="bg-slate-800 text-white p-4"><h1 className="font-semibold">워크스페이스 관리</h1><p className="text-slate-400 text-sm">멤버 3명</p></header>
      <div className="flex border-b bg-white">
        {['members', 'channels', 'settings'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-sm ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-700'}`}>
            {tab === 'members' ? '멤버' : tab === 'channels' ? '채널' : '설정'}
          </button>
        ))}
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {activeTab === 'members' && (
          <div className="space-y-3">
            {members.map(m => (
              <div key={m.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-medium">{m.name[0]}</div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${m.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                  <div><p className="font-medium">{m.name}</p><p className="text-sm text-gray-700">{m.role}</p></div>
                </div>
                <button className="text-red-500 text-sm">제거</button>
              </div>
            ))}
            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-700">+ 멤버 초대</button>
          </div>
        )}
        {activeTab === 'channels' && (
          <div className="space-y-2">
            {['일반', '개발팀', '디자인팀'].map((ch, i) => (
              <div key={i} className="bg-white p-3 rounded-lg flex justify-between items-center">
                <span># {ch}</span>
                <button className="text-xs text-gray-700">설정</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ========== 대시보드 (기본) ==========
function DashboardUserMVP({ title }: { title: string }) {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <header className="bg-indigo-600 text-white p-4"><h1 className="font-semibold truncate">{title}</h1></header>
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[{ label: '진행중', value: '12' }, { label: '완료', value: '48' }, { label: '대기', value: '5' }, { label: '알림', value: '3' }].map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm text-center">
              <p className="text-2xl font-bold text-indigo-600">{s.value}</p>
              <p className="text-xs text-gray-700">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium mb-3">최근 활동</h3>
          {['새 프로젝트 생성됨', '문서 업데이트됨', '댓글이 추가됨'].map((a, i) => (
            <div key={i} className="py-2 border-b last:border-0 text-sm text-gray-800">{a}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardAdminMVP({ title }: { title: string }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <header className="bg-slate-800 text-white p-4"><h1 className="font-semibold truncate">{title} - 관리자</h1></header>
      <div className="flex border-b bg-white">
        {['overview', 'users', 'settings'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-sm ${activeTab === tab ? 'border-b-2 border-indigo-500 text-indigo-500' : 'text-gray-700'}`}>
            {tab === 'overview' ? '개요' : tab === 'users' ? '사용자' : '설정'}
          </button>
        ))}
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-3">
            {[{ label: '총 사용자', value: '1,234' }, { label: '활성 세션', value: '567' }, { label: '오늘 가입', value: '+23' }, { label: '시스템 상태', value: '정상' }].map((s, i) => (
              <div key={i} className="bg-white p-4 rounded-lg text-center"><p className="text-2xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-gray-700">{s.label}</p></div>
            ))}
          </div>
        )}
        {activeTab === 'users' && (
          <div className="space-y-2">
            {['김철수', '이영희', '박민수'].map((u, i) => (
              <div key={i} className="bg-white p-3 rounded-lg flex justify-between items-center">
                <span>{u}</span>
                <div className="flex gap-2">
                  <button className="text-xs text-blue-500">수정</button>
                  <button className="text-xs text-red-500">삭제</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="bg-white p-4 rounded-lg space-y-4">
            {['알림 설정', '보안 설정', '백업 설정'].map((s, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                <span>{s}</span>
                <button className="text-indigo-500 text-sm">변경</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
