import { useState, useEffect } from 'react';
import { abTestAPI } from '../services/api';

export function useABTest(testKey, defaultVariant = null) {
    const [variant, setVariant] = useState(defaultVariant);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVariant = async () => {
            try {
                // Get permanent visitor ID
                let visitorId = localStorage.getItem('cv_visitor_id');
                if (!visitorId) {
                    visitorId = Math.random().toString(36).substring(2) + Date.now().toString(36);
                    localStorage.setItem('cv_visitor_id', visitorId);
                }

                const response = await abTestAPI.getActive(testKey, visitorId);

                if (response.success && response.variant) {
                    setVariant(response.variant.value); // We return the value directly
                    // Also store full variant info if needed in future
                    sessionStorage.setItem(`ab_${testKey}_name`, response.variant.name);
                }
            } catch (error) {
                console.error('ABTest Error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (testKey) {
            fetchVariant();
        } else {
            setLoading(false);
        }
    }, [testKey]);

    const trackConversion = async () => {
        const variantName = sessionStorage.getItem(`ab_${testKey}_name`);
        if (variantName) {
            try {
                await abTestAPI.track(testKey, variantName);
                console.log(`Conversion tracked for ${testKey}:${variantName}`);
            } catch (error) {
                console.error('Conversion Track Error:', error);
            }
        }
    };

    return { variant, loading, trackConversion };
}
