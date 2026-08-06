import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service here
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        // Optionally, reset other state in your app or redirect
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen bg-[#0F1115] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md w-full bg-[#1A1D24] border border-red-500/20 rounded-2xl p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Oops! Bir şeyler yanlış gitti.
                        </h2>
                        
                        <p className="text-gray-400 mb-8">
                            Beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin veya daha sonra tekrar dönün.
                        </p>
                        
                        <button 
                            onClick={this.handleReset}
                            className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-6 py-3 rounded-xl font-medium transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>Sayfayı Yenile</span>
                        </button>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-8 text-left bg-black/50 p-4 rounded-xl overflow-auto text-xs text-red-400">
                                <p className="font-bold mb-2">{this.state.error.toString()}</p>
                                <pre>{this.state.errorInfo?.componentStack}</pre>
                            </div>
                        )}
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
