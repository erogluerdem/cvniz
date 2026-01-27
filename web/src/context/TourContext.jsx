import React, { createContext, useContext, useState, useEffect } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useLocation } from 'react-router-dom';

const TourContext = createContext();

export const useTour = () => useContext(TourContext);

export const TourProvider = ({ children }) => {
    const [run, setRun] = useState(false);
    const location = useLocation();
    const [steps, setSteps] = useState([]);

    const editorSteps = [
        {
            target: '#cv-preview-frame',
            content: 'Önizleme: Yaptığınız değişiklikleri burada anlık olarak görebilirsiniz.',
            placement: 'left',
            disableBeacon: true,
        },
        {
            target: '#tab-personal',
            content: 'Kişisel Bilgiler: Ad, soyad, iletişim bilgilerinizi buradan düzenleyin.',
            placement: 'right',
        },
        {
            target: '#tab-styling',
            content: 'Tasarım: CV\'nizin renk, yazı tipi ve düzenini buradan özelleştirebilirsiniz.',
            placement: 'right',
        },
        {
            target: '#premium-panel-trigger',
            content: 'AI Asistan: Yapay zeka ile CV\'nizi güçlendirin ve eksikleri tamamlayın.',
            placement: 'bottom',
        },
        {
            target: '#download-btn',
            content: 'İndir: Hazır olduğunda CV\'nizi PDF veya diğer formatlarda indirin.',
            placement: 'bottom',
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
                styles={{
                    options: {
                        arrowColor: '#1e293b',
                        backgroundColor: '#1e293b',
                        overlayColor: 'rgba(0, 0, 0, 0.5)',
                        primaryColor: '#06b6d4',
                        textColor: '#fff',
                        zIndex: 10000,
                    },
                    tooltipContainer: {
                        textAlign: 'left'
                    },
                    buttonNext: {
                        backgroundColor: '#06b6d4'
                    },
                    buttonBack: {
                        color: '#fff'
                    }
                }}
                locale={{
                    back: 'Geri',
                    close: 'Kapat',
                    last: 'Bitir',
                    next: 'İleri',
                    skip: 'Atla'
                }}
            />
            {children}
        </TourContext.Provider>
    );
};
