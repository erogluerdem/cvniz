import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './i18n'
import './index.css'

// Sentry Initialization
if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
        integrations: [
            new Sentry.Replay({
                maskAllText: true,
                blockAllMedia: true,
            }),
        ],
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
    });
}

const SentryApp = Sentry.withProfiler(App);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <SentryApp />
        </ErrorBoundary>
    </React.StrictMode>,
)
