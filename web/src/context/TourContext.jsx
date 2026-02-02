import React, { createContext, useContext, useState, useEffect } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useLocation } from 'react-router-dom';
import CustomTourTooltip from '../components/CustomTourTooltip';

const TourContext = createContext();

export const useTour = () => useContext(TourContext);

export const TourProvider = ({ children }) => {
    const [run, setRun] = useState(false);
    const location = useLocation();
    const [steps, setSteps] = useState([]);

    const editorSteps = [
        {
            target: '#cv-preview-frame',
            title: 'Canlı Önizleme',
            content: 'Yaptığınız her değişikliği saniyesinde görün! Artık "Kaydet" butonuna basıp beklemenize gerek yok. Siz yazın, biz anında gösterelim.',
            placement: 'auto',
            disableBeacon: true,
        },
        {
            target: '#tab-personal',
            title: 'Kişisel Markanız',
            content: 'İsim, unvan ve iletişim bilgileriniz CV\'nizin vitrinidir. Fotoğraf ekleyerek daha profesyonel bir görünüm elde edebilirsiniz.',
            placement: 'bottom',
        },
        {
            target: '#tab-styling',
            title: 'Tasarım Odası',
            content: 'CV\'niz karakterinizi yansıtsın. Renk paletleri, modern yazı tipleri ve farklı düzen seçenekleriyle saniyeler içinde benzersiz bir tasarım yaratın.',
            placement: 'bottom',
        },
        {
            target: '#premium-panel-trigger',
            title: 'AI Kariyer Asistanı',
            content: 'Takıldınız mı? Yapay zeka asistanımız size profesyonel içerik önerileri sunar, yazım hatalarını düzeltir ve sektörünüze uygun anahtar kelimeler sağlar.',
            placement: 'left',
        },
        {
            target: '#download-btn',
            title: 'İndir ve Başvur',
            content: 'Tasarımınız hazır mı? Yüksek kaliteli PDF olarak indirin veya doğrudan paylaşılabilir link oluşturun. Başarılar dileriz!',
            placement: 'bottom-end',
        }
    ];

    // Auto-start tour on first visit to editor
    useEffect(() => {
        if (location.pathname.includes('/editor')) {
            const hasSeenTour = localStorage.getItem('hasSeenEditorTour');
            if (!hasSeenTour) {
                // Short delay to ensure elements are rendered
                setTimeout(() => {
                    setSteps(editorSteps);
                    setRun(true);
                }, 1000);
            }
        } else {
            setRun(false);
        }
    }, [location.pathname]);

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            if (location.pathname.includes('/editor')) {
                localStorage.setItem('hasSeenEditorTour', 'true');
            }
        }
    };

    return (
        <TourContext.Provider value={{ startTour: () => setRun(true) }}>
            <Joyride
                steps={steps}
                run={run}
                continuous
                showProgress
                showSkipButton
                callback={handleJoyrideCallback}
                tooltipComponent={CustomTourTooltip}
                styles={{
                    options: {
                        arrowColor: 'rgba(255, 255, 255, 0.9)',
                        backgroundColor: '#ffffff',
                        overlayColor: 'rgba(15, 23, 42, 0.6)',
                        primaryColor: '#2563eb',
                        textColor: '#334155',
                        width: 400,
                        zIndex: 10000,
                    }
                }}
            />
            {children}
        </TourContext.Provider>
    );
};
