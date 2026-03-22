'use client';

import React, { useState } from 'react';

export function BookingUserMVP() {
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

export function BookingAdminMVP() {
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