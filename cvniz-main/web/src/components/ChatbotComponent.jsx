/**
 * Chatbot Component
 * AI-powered career coaching interface
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Send, RotateCcw, Download, Menu } from 'lucide-react';

export const ChatbotComponent = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState('resume');
    const messagesEndRef = useRef(null);

    const topics = [
        { value: 'resume', label: 'Özgeçmiş Danışmanlığı' },
        { value: 'interview', label: 'Mülakat Hazırlığı' },
        { value: 'career', label: 'Kariyer Planlama' },
        { value: 'job_search', label: 'İş Arama Stratejisi' },
        { value: 'ai_general', label: 'Genel Sorular' }
    ];

    // Load conversations on mount
    useEffect(() => {
        loadConversations();
    }, []);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadConversations = async () => {
        try {
            const response = await fetch('/api/chatbot/conversations', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setConversations(data);
        } catch (error) {
            console.error('Konuşmalar yüklenemedi:', error);
        }
    };

    const startNewConversation = async () => {
        try {
            const response = await fetch('/api/chatbot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    message: 'Merhaba, bana yardımcı olabilir misin?',
                    topic: selectedTopic,
                    isNewConversation: true
                })
            });
            
            const data = await response.json();
            setCurrentConversation(data.conversationId);
            setMessages([
                {
                    role: 'user',
                    content: 'Merhaba, bana yardımcı olabilir misin?',
                    timestamp: new Date()
                },
                {
                    role: 'assistant',
                    content: data.message,
                    timestamp: new Date()
                }
            ]);
            
            await loadConversations();
        } catch (error) {
            console.error('Konuşma başlatılamadı:', error);
        }
    };

    const sendMessage = async () => {
        if (!inputValue.trim()) return;

        setLoading(true);
        const userMessage = inputValue;
        setInputValue('');

        // Add user message to UI
        setMessages(prev => [...prev, {
            role: 'user',
            content: userMessage,
            timestamp: new Date()
        }]);

        try {
            const response = await fetch('/api/chatbot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    message: userMessage,
                    conversationId: currentConversation,
                    topic: selectedTopic
                })
            });

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.message,
                confidence: data.confidence,
                timestamp: new Date()
            }]);

        } catch (error) {
            console.error('Mesaj gönderilemedi:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
                timestamp: new Date(),
                isError: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    const deleteConversation = async (conversationId) => {
        try {
            await fetch(`/api/chatbot/conversations/${conversationId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            
            if (currentConversation === conversationId) {
                setCurrentConversation(null);
                setMessages([]);
            }
            
            await loadConversations();
        } catch (error) {
            console.error('Konuşma silinemedi:', error);
        }
    };

    const exportConversation = async () => {
        try {
            const response = await fetch(
                `/api/chatbot/export/${currentConversation}`,
                {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                }
            );
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'conversation.pdf';
            a.click();
        } catch (error) {
            console.error('Dışa aktarılamadı:', error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto hidden md:flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900 mb-3">Konuşmalar</h2>
                    <button
                        onClick={startNewConversation}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                        + Yeni Konuşma
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => (
                        <div
                            key={conv._id}
                            onClick={() => {
                                setCurrentConversation(conv._id);
                                setMessages(conv.messages || []);
                                setSelectedTopic(conv.topic);
                            }}
                            className={`p-3 m-2 rounded-lg cursor-pointer transition ${
                                currentConversation === conv._id
                                    ? 'bg-blue-100 text-blue-900'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <p className="text-sm font-medium truncate">{conv.topic}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(conv.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteConversation(conv._id);
                                }}
                                className="mt-2 text-xs text-red-600 hover:text-red-800"
                            >
                                Sil
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Menu className="md:hidden w-5 h-5" />
                        <h1 className="text-lg font-semibold text-gray-900">
                            {topics.find(t => t.value === selectedTopic)?.label || 'Sohbet'}
                        </h1>
                    </div>

                    {currentConversation && (
                        <div className="flex gap-2">
                            <button
                                onClick={exportConversation}
                                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                            >
                                <Download className="w-4 h-4" />
                                Dışa Aktar
                            </button>
                            <button
                                onClick={startNewConversation}
                                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Yeni
                            </button>
                        </div>
                    )}
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-gray-500 mb-4">
                                    Konuşma başlamadı. Yeni bir konuşma başlayalım.
                                </p>
                                <button
                                    onClick={startNewConversation}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Başlat
                                </button>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                        msg.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-900'
                                    }`}
                                >
                                    <p className="text-sm">{msg.content}</p>
                                    {msg.confidence && (
                                        <p className="text-xs mt-1 opacity-70">
                                            Güven: %{Math.round(msg.confidence * 100)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Topic Selector */}
                {!currentConversation && (
                    <div className="border-t border-gray-200 p-4 bg-white">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Danışmanlık Alanı
                        </label>
                        <select
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                            {topics.map(topic => (
                                <option key={topic.value} value={topic.value}>
                                    {topic.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Input Area */}
                <div className="bg-white border-t border-gray-200 p-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Sorunuz nedir?"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !inputValue.trim()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Gönder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotComponent;
