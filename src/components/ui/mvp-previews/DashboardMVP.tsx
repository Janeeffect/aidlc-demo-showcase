'use client';

import React, { useState } from 'react';

export function DashboardUserMVP({ title }: { title: string }) {
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

export function DashboardAdminMVP({ title }: { title: string }) {
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