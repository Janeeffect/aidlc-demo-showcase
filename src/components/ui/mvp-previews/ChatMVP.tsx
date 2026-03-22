'use client';

import React, { useState } from 'react';

export function ChatUserMVP() {
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

export function ChatAdminMVP() {
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