'use client';

import React, { useState } from 'react';

export function LearningUserMVP() {
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

export function LearningAdminMVP() {
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