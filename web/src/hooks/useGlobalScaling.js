import { useState, useCallback } from 'react';

// Hook 1: useRegional - Bölge yönetimi
export function useRegional() {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('EU');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllRegions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/regions', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setRegions(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const selectRegion = useCallback(async (regionCode) => {
    setLoading(true);
    setError(null);
    try {
      await fetch('http://localhost:5000/api/user/region', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ primaryRegion: regionCode })
      });
      setSelectedRegion(regionCode);
      return regionCode;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOptimalRegion = useCallback(async (userCountry) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/regions/optimal?country=${userCountry}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkRegionHealth = useCallback(async (regionCode) => {
    try {
      const response = await fetch(`http://localhost:5000/api/regions/${regionCode}/health`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    regions,
    selectedRegion,
    loading,
    error,
    getAllRegions,
    selectRegion,
    getOptimalRegion,
    checkRegionHealth
  };
}

// Hook 2: useLocalization - Çeviri ve dil yönetimi
export function useLocalization() {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('tr');
  const [translations, setTranslations] = useState({});
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllLanguages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/languages', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setLanguages(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const selectLanguage = useCallback(async (langCode) => {
    setLoading(true);
    setError(null);
    try {
      await fetch('http://localhost:5000/api/user/language', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ preferredLanguage: langCode })
      });
      setSelectedLanguage(langCode);
      return langCode;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTranslations = useCallback(async (namespace) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/translations/${namespace}/${selectedLanguage}`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      const data = await response.json();
      setTranslations(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedLanguage]);

  const getTranslationProgress = useCallback(async (namespace) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/translations/progress/${namespace}`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      const data = await response.json();
      setProgress(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const detectLanguage = useCallback(async (text) => {
    try {
      const response = await fetch('http://localhost:5000/api/languages/detect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    languages,
    selectedLanguage,
    translations,
    progress,
    loading,
    error,
    getAllLanguages,
    selectLanguage,
    getTranslations,
    getTranslationProgress,
    detectLanguage
  };
}

// Hook 3: useCDN - CDN ve asset optimizasyonu
export function useCDN() {
  const [assets, setAssets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/cdn/assets', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setAssets(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadAsset = useCallback(async (file, options) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(options));

      const response = await fetch('http://localhost:5000/api/cdn/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      const data = await response.json();
      setAssets([...assets, data]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [assets]);

  const optimizeAsset = useCallback(async (assetId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/cdn/assets/${assetId}/optimize`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setAssets(assets.map(a => a.assetId === assetId ? data : a));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [assets]);

  const purgeCache = useCallback(async (pattern) => {
    setLoading(true);
    setError(null);
    try {
      await fetch('http://localhost:5000/api/cdn/cache/purge', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pattern })
      });
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/cdn/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setStats(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    assets,
    stats,
    loading,
    error,
    getAssets,
    uploadAsset,
    optimizeAsset,
    purgeCache,
    getStats
  };
}

// Hook 4: useGeolocation - Coğrafi konum tabanlı işlemler
export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [server, setServer] = useState(null);
  const [cdnNode, setCDNNode] = useState(null);
  const [contentLocalization, setContentLocalization] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const detectLocation = useCallback(async (ipAddress) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/geo/lookup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ipAddress })
      });
      const data = await response.json();
      setLocation(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOptimalServer = useCallback(async (userIP) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/geo/optimal-server`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userIP })
      });
      const data = await response.json();
      setServer(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const selectCDNNode = useCallback(async (userIP) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/geo/cdn-node`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userIP })
      });
      const data = await response.json();
      setCDNNode(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLocalizedContent = useCallback(async (userIP) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/geo/localized-content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userIP })
      });
      const data = await response.json();
      setContentLocalization(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    location,
    server,
    cdnNode,
    contentLocalization,
    loading,
    error,
    detectLocation,
    getOptimalServer,
    selectCDNNode,
    getLocalizedContent
  };
}
