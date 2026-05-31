import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function IFramePreview({ children, style, className, id, onHeightChange, isProtected }) {
    const iframeRef = useRef(null);
    const [mountNode, setMountNode] = useState(null);
    const [iframeHeight, setIframeHeight] = useState(1684);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;
        const doc = iframe.contentWindow?.document;
        if (!doc) return;

        // Clean up previously cloned styles to avoid duplicates if re-rendered
        const existingStyles = doc.head.querySelectorAll('style, link[rel="stylesheet"]');
        existingStyles.forEach(s => s.remove());

        // Copy styles from parent
        const styles = document.head.querySelectorAll('style, link[rel="stylesheet"]');
        styles.forEach(style => {
            doc.head.appendChild(style.cloneNode(true));
        });
        
        // Setup base styles for body
        doc.documentElement.style.fontSize = '24px'; // 1.5x scale (16px * 1.5) to match 1190px vs 794px ratio
        doc.body.style.margin = '0';
        doc.body.style.padding = '0';
        doc.body.style.backgroundColor = 'transparent';
        doc.body.style.overflow = 'hidden'; // Prevent internal scrollbars in iframe if scale is exact

        // Apply protection styles if needed
        if (isProtected) {
            doc.body.style.userSelect = 'none';
            doc.body.style.webkitUserSelect = 'none';
            
            // Block right click
            doc.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                // We could optionally dispatch an event to the parent window here to show the premium modal
                window.dispatchEvent(new MouseEvent('contextmenu', {
                    clientX: e.clientX,
                    clientY: e.clientY,
                    bubbles: true
                }));
            });

            // Block copy
            doc.addEventListener('copy', (e) => {
                e.preventDefault();
            });

            // Block keyboard shortcuts (Ctrl+C, Ctrl+S, Ctrl+P)
            doc.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 's' || e.key === 'p')) {
                    e.preventDefault();
                }
            });
        }

        // Add an observer to keep styles synced if new styles are added dynamically by Vite (HMR)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'STYLE' || (node.tagName === 'LINK' && node.rel === 'stylesheet')) {
                        doc.head.appendChild(node.cloneNode(true));
                    }
                });
            });
        });
        observer.observe(document.head, { childList: true });

        setMountNode(doc.body);

        // Observer to dynamically adjust iframe height based on content
        const resizeObserver = new ResizeObserver(() => {
            if (doc.body) {
                // Determine the true height of the content. Minimum 1 A4 page (1684px).
                const height = Math.max(1684, doc.documentElement.scrollHeight, doc.body.scrollHeight);
                setIframeHeight(height);
                if (onHeightChange) {
                    onHeightChange(height);
                }
            }
        });

        // We need to wait for children to mount, but body is good for now.
        // We also observe body changes since content changes height
        const contentObserver = new MutationObserver(() => {
            if (doc.body) {
                const height = Math.max(1684, doc.documentElement.scrollHeight, doc.body.scrollHeight);
                setIframeHeight(height);
                if (onHeightChange) {
                    onHeightChange(height);
                }
            }
        });

        resizeObserver.observe(doc.body);
        contentObserver.observe(doc.body, { childList: true, subtree: true, attributes: true });

        return () => {
            observer.disconnect();
            resizeObserver.disconnect();
            contentObserver.disconnect();
        };
    }, [onHeightChange]);

    return (
        <iframe
            id={id}
            ref={iframeRef}
            style={{ border: 'none', height: `${iframeHeight}px`, ...style }}
            className={className}
            title="CV Preview"
            scrolling="no"
        >
            {mountNode && createPortal(children, mountNode)}
        </iframe>
    );
}
