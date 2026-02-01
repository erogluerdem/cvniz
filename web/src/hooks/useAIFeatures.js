/**
 * Custom Hooks for AI Features
 */

import { useState, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook for managing chatbot conversations
 */
export const useChatbot = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadConversations = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/chatbot/conversations', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setConversations(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const startConversation = useCallback(async (topic) => {
        try {
            setLoading(true);
            const response = await fetch('/api/chatbot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    message: 'Merhaba, bana yardımcı olabilir misin?',
                    topic,
                    isNewConversation: true
                })
            });

            const data = await response.json();
            setCurrentConversation(data.conversationId);
            setMessages([
                { role: 'user', content: 'Merhaba', timestamp: new Date() },
                { role: 'assistant', content: data.message, timestamp: new Date() }
            ]);
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const sendMessage = useCallback(async (content, topic) => {
        try {
            setLoading(true);
            setMessages(prev => [...prev, {
                role: 'user',
                content,
                timestamp: new Date()
            }]);

            const response = await fetch('/api/chatbot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    message: content,
                    conversationId: currentConversation,
                    topic
                })
            });

            const data = await response.json();
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.message,
                confidence: data.confidence,
                timestamp: new Date()
            }]);

            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setLoading(false);
        }
    }, [user.token, currentConversation]);

    const deleteConversation = useCallback(async (conversationId) => {
        try {
            await fetch(`/api/chatbot/conversations/${conversationId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (currentConversation === conversationId) {
                setCurrentConversation(null);
                setMessages([]);
            }

            setConversations(prev => prev.filter(c => c._id !== conversationId));
        } catch (err) {
            setError(err.message);
        }
    }, [user.token, currentConversation]);

    const exportConversation = useCallback(async (conversationId) => {
        try {
            const response = await fetch(
                `/api/chatbot/export/${conversationId}`,
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
        } catch (err) {
            setError(err.message);
        }
    }, [user.token]);

    return {
        conversations,
        currentConversation,
        messages,
        loading,
        error,
        loadConversations,
        startConversation,
        sendMessage,
        deleteConversation,
        exportConversation
    };
};

/**
 * Hook for resume parser
 */
export const useResumeParser = () => {
    const { user } = useAuth();
    const [parsedData, setParsedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    const parseResume = useCallback(async (file) => {
        try {
            setLoading(true);
            setProgress(0);
            setError(null);

            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    setProgress(percentComplete);
                }
            });

            return new Promise((resolve, reject) => {
                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        const data = JSON.parse(xhr.responseText);
                        setParsedData(data);
                        setProgress(100);
                        resolve(data);
                    } else {
                        reject(new Error('Ayrıştırma başarısız'));
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new Error('Dosya yükleme başarısız'));
                });

                xhr.open('POST', '/api/resume-parser/upload');
                xhr.setRequestHeader('Authorization', `Bearer ${user.token}`);
                xhr.send(formData);
            });
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const reset = useCallback(() => {
        setParsedData(null);
        setError(null);
        setProgress(0);
    }, []);

    return {
        parsedData,
        loading,
        error,
        progress,
        parseResume,
        reset
    };
};

/**
 * Hook for interview simulator
 */
export const useInterviewSimulator = () => {
    const { user } = useAuth();
    const [interviews, setInterviews] = useState([]);
    const [currentInterview, setCurrentInterview] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [scores, setScores] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const loadStats = useCallback(async () => {
        try {
            const response = await fetch('/api/interview/stats', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setStats(data);
        } catch (err) {
            console.error('Stats yüklenemedi:', err);
        }
    }, [user.token]);

    const loadInterviews = useCallback(async () => {
        try {
            const response = await fetch('/api/interview/history', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setInterviews(data);
        } catch (err) {
            console.error('Mülakatlar yüklenemedi:', err);
        }
    }, [user.token]);

    const startInterview = useCallback(async (type, difficulty) => {
        try {
            setLoading(true);
            const response = await fetch('/api/interview/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    type,
                    difficulty,
                    questionCount: 5
                })
            });

            const data = await response.json();
            setCurrentInterview(data.interviewId);
            setQuestions([data.firstQuestion]);
            setCurrentQuestionIdx(0);
            setAnswers({});
            setScores({});
            setError(null);

            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const submitAnswer = useCallback(async (answer) => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/interview/${currentInterview}/answer`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({
                        questionIndex: currentQuestionIdx,
                        answer
                    })
                }
            );

            const data = await response.json();

            setAnswers(prev => ({
                ...prev,
                [currentQuestionIdx]: answer
            }));

            setScores(prev => ({
                ...prev,
                [currentQuestionIdx]: data.evaluation
            }));

            if (data.completed) {
                await loadInterviews();
                await loadStats();
                setCurrentInterview(null);
                return { completed: true, summary: data.summary };
            } else if (data.nextQuestion) {
                setQuestions(prev => [...prev, data.nextQuestion]);
                setCurrentQuestionIdx(prev => prev + 1);
            }

            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token, currentInterview, currentQuestionIdx]);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
                // Can send blob to server for transcription
                console.log('Recording finished:', blob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            setError('Mikrofon erişimi başarısız');
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    }, []);

    return {
        interviews,
        currentInterview,
        questions,
        currentQuestionIdx,
        answers,
        scores,
        loading,
        error,
        stats,
        isRecording,
        loadStats,
        loadInterviews,
        startInterview,
        submitAnswer,
        startRecording,
        stopRecording
    };
};

/**
 * Hook for document processing
 */
export const useDocumentProcessing = () => {
    const { user } = useAuth();
    const [processedData, setProcessedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);

    const processDocument = useCallback(async (filePath, documentType) => {
        try {
            setLoading(true);
            const response = await fetch('/api/document/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    filePath,
                    documentType
                })
            });

            const data = await response.json();
            setProcessedData(data);
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const loadHistory = useCallback(async () => {
        try {
            const response = await fetch('/api/document/history', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setHistory(data);
        } catch (err) {
            console.error('History yüklenemedi:', err);
        }
    }, [user.token]);

    return {
        processedData,
        loading,
        error,
        history,
        processDocument,
        loadHistory
    };
};
