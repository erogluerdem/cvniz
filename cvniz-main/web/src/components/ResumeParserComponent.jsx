/**
 * Resume Parser Component
 * File upload and CV parsing interface
 */

import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export const ResumeParserComponent = () => {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [parsing, setParsing] = useState(false);
    const [parsedData, setParsedData] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validate file type
        const validTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (!validTypes.includes(selectedFile.type)) {
            setError('Sadece PDF ve Word dosyaları kabul edilir.');
            return;
        }

        setFile(selectedFile);
        setError(null);
        await parseResume(selectedFile);
    };

    const parseResume = async (resumeFile) => {
        setParsing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', resumeFile);

            const response = await fetch('/api/resume-parser/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Dosya ayrıştırılamadı');
            }

            const data = await response.json();
            setParsedData(data);
        } catch (err) {
            setError(err.message || 'Bir hata oluştu');
            setParsedData(null);
        } finally {
            setParsing(false);
        }
    };

    const handleDragDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            handleFileSelect({ target: { files: [droppedFile] } });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Özgeçmiş Ayrıştırıcı
            </h1>

            {/* Upload Area */}
            {!parsedData && (
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDragDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-blue-300 rounded-lg p-12 text-center cursor-pointer hover:bg-blue-50 transition"
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                    />

                    {parsing ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader className="w-10 h-10 text-blue-600 animate-spin" />
                            <p className="text-gray-600 font-medium">
                                Dosya ayrıştırılıyor...
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <Upload className="w-12 h-12 text-blue-600" />
                            <div>
                                <p className="text-lg font-semibold text-gray-900">
                                    Özgeçmiş Dosyası Yükle
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    PDF veya Word dosyası seçin
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {/* Parsed Data */}
            {parsedData && (
                <div className="mt-8 space-y-6">
                    {/* Confidence Score */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    Ayrıştırma Güveni
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    %{Math.round((parsedData.confidence || 0.8) * 100)}
                                </p>
                            </div>
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                    </div>

                    {/* Personal Info */}
                    {parsedData.personalInfo && (
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Kişisel Bilgiler
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {parsedData.personalInfo.email && (
                                    <div>
                                        <p className="text-sm text-gray-500">E-posta</p>
                                        <p className="font-medium text-gray-900">
                                            {parsedData.personalInfo.email}
                                        </p>
                                    </div>
                                )}
                                {parsedData.personalInfo.phone && (
                                    <div>
                                        <p className="text-sm text-gray-500">Telefon</p>
                                        <p className="font-medium text-gray-900">
                                            {parsedData.personalInfo.phone}
                                        </p>
                                    </div>
                                )}
                                {parsedData.personalInfo.linkedin && (
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-500">LinkedIn</p>
                                        <a
                                            href={parsedData.personalInfo.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {parsedData.personalInfo.linkedin}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Experience */}
                    {parsedData.experience?.length > 0 && (
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Deneyim
                            </h2>
                            <div className="space-y-4">
                                {parsedData.experience.map((exp, idx) => (
                                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                                        <p className="font-semibold text-gray-900">
                                            {exp.title}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {exp.company} · {exp.startDate} - {exp.endDate}
                                        </p>
                                        {exp.description && (
                                            <p className="text-sm text-gray-700 mt-2">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {parsedData.education?.length > 0 && (
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Eğitim
                            </h2>
                            <div className="space-y-3">
                                {parsedData.education.map((edu, idx) => (
                                    <div key={idx}>
                                        <p className="font-semibold text-gray-900">
                                            {edu.degree}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {edu.school} · {edu.year}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {parsedData.skills?.length > 0 && (
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Beceriler
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {parsedData.skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {parsedData.languages?.length > 0 && (
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Diller
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {parsedData.languages.map((lang, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(lang.proficiency || 0.7) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {lang.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reset Button */}
                    <button
                        onClick={() => {
                            setFile(null);
                            setParsedData(null);
                            setError(null);
                        }}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Başka Dosya Yükle
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResumeParserComponent;
