import { useState, useCallback, useEffect } from 'react';

/**
 * useAppStore Hook
 * App Store konfigürasyonu yönetimi
 */
export function useAppStore() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/app-store/config', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Config yüklenemedi');

      const data = await response.json();
      setConfig(data.config);
      return data.config;
    } catch (err) {
      setError(err.message);
      console.error('fetchConfig error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createConfig = useCallback(async (configData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/app-store/config', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(configData)
      });

      if (!response.ok) throw new Error('Config oluşturulamadı');

      const data = await response.json();
      setConfig(data.config);
      return data.config;
    } catch (err) {
      setError(err.message);
      console.error('createConfig error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateConfig = useCallback(async (configId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/app-store/config/${configId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Config güncellenemedi');

      const data = await response.json();
      setConfig(data.config);
      return data.config;
    } catch (err) {
      setError(err.message);
      console.error('updateConfig error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const validateConfig = useCallback(async (configId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/app-store/config/${configId}/validate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      return data.validation;
    } catch (err) {
      setError(err.message);
      console.error('validateConfig error:', err);
      return { isValid: false, errors: ['Doğrulama başarısız'] };
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    config,
    loading,
    error,
    fetchConfig,
    createConfig,
    updateConfig,
    validateConfig
  };
}

/**
 * useBuild Hook
 * Build yönetimi ve tetikleme
 */
export function useBuild() {
  const [builds, setBuilds] = useState([]);
  const [currentBuild, setCurrentBuild] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchBuilds = useCallback(async (page = 1, limit = 20, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters
      });

      const response = await fetch(
        `http://localhost:5000/api/app-store/builds?${params}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error('Builds yüklenemedi');

      const data = await response.json();
      setBuilds(data.builds);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('fetchBuilds error:', err);
      return { builds: [] };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const triggerBuild = useCallback(async (platform, buildType = 'production') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/app-store/builds', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ platform, buildType })
      });

      if (!response.ok) throw new Error('Build tetiklenemedi');

      const data = await response.json();
      setCurrentBuild(data.build);
      setBuilds([data.build, ...builds]);
      return data.build;
    } catch (err) {
      setError(err.message);
      console.error('triggerBuild error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, builds]);

  const getBuildStatus = useCallback(async (buildId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/app-store/builds/${buildId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error('Build yüklenemedi');

      const data = await response.json();
      setCurrentBuild(data.build);
      return data.build;
    } catch (err) {
      setError(err.message);
      console.error('getBuildStatus error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getBuildStats = useCallback(async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/app-store/builds/stats/${userId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error('Stats yüklenemedi');

      const data = await response.json();
      return data.stats;
    } catch (err) {
      setError(err.message);
      console.error('getBuildStats error:', err);
      return null;
    }
  }, [token]);

  return {
    builds,
    currentBuild,
    loading,
    error,
    fetchBuilds,
    triggerBuild,
    getBuildStatus,
    getBuildStats
  };
}

/**
 * usePublishing Hook
 * Release ve yayın yönetimi
 */
export function usePublishing() {
  const [releases, setReleases] = useState([]);
  const [currentRelease, setCurrentRelease] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchReleases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/app-store/releases', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Releases yüklenemedi');

      const data = await response.json();
      setReleases(data.releases);
      return data.releases;
    } catch (err) {
      setError(err.message);
      console.error('fetchReleases error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createRelease = useCallback(async (buildId, releaseData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/app-store/releases', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          buildId,
          ...releaseData
        })
      });

      if (!response.ok) throw new Error('Release oluşturulamadı');

      const data = await response.json();
      setCurrentRelease(data.release);
      setReleases([data.release, ...releases]);
      return data.release;
    } catch (err) {
      setError(err.message);
      console.error('createRelease error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, releases]);

  const publishRelease = useCallback(async (releaseId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/app-store/releases/${releaseId}/publish`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Release yayınlanamadı');

      const data = await response.json();
      setCurrentRelease(data.release);
      setReleases(releases.map(r => r._id === releaseId ? data.release : r));
      return data.release;
    } catch (err) {
      setError(err.message);
      console.error('publishRelease error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, releases]);

  const getRelease = useCallback(async (releaseId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/app-store/releases/${releaseId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error('Release yüklenemedi');

      const data = await response.json();
      return data.release;
    } catch (err) {
      setError(err.message);
      console.error('getRelease error:', err);
      return null;
    }
  }, [token]);

  const getReleaseStats = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/app-store/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Stats yüklenemedi');

      const data = await response.json();
      return data.stats.releases;
    } catch (err) {
      setError(err.message);
      console.error('getReleaseStats error:', err);
      return null;
    }
  }, [token]);

  return {
    releases,
    currentRelease,
    loading,
    error,
    fetchReleases,
    createRelease,
    publishRelease,
    getRelease,
    getReleaseStats
  };
}

/**
 * useRollout Hook
 * Staged rollout yönetimi
 */
export function useRollout() {
  const [rollouts, setRollouts] = useState([]);
  const [currentRollout, setCurrentRollout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const createRollout = useCallback(async (releaseId, rolloutData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/app-store/rollouts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          releaseId,
          ...rolloutData
        })
      });

      if (!response.ok) throw new Error('Rollout oluşturulamadı');

      const data = await response.json();
      setCurrentRollout(data.rollout);
      setRollouts([data.rollout, ...rollouts]);
      return data.rollout;
    } catch (err) {
      setError(err.message);
      console.error('createRollout error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, rollouts]);

  const startRollout = useCallback(async (rolloutId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/app-store/rollouts/${rolloutId}/start`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Rollout başlatılamadı');

      const data = await response.json();
      setCurrentRollout(data.rollout);
      setRollouts(rollouts.map(r => r._id === rolloutId ? data.rollout : r));
      return data.rollout;
    } catch (err) {
      setError(err.message);
      console.error('startRollout error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, rollouts]);

  const pauseRollout = useCallback(async (rolloutId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/app-store/rollouts/${rolloutId}/pause`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Rollout duraklatılamadı');

      const data = await response.json();
      setCurrentRollout(data.rollout);
      setRollouts(rollouts.map(r => r._id === rolloutId ? data.rollout : r));
      return data.rollout;
    } catch (err) {
      setError(err.message);
      console.error('pauseRollout error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, rollouts]);

  const resumeRollout = useCallback(async (rolloutId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/app-store/rollouts/${rolloutId}/resume`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Rollout devam ettirilemedi');

      const data = await response.json();
      setCurrentRollout(data.rollout);
      setRollouts(rollouts.map(r => r._id === rolloutId ? data.rollout : r));
      return data.rollout;
    } catch (err) {
      setError(err.message);
      console.error('resumeRollout error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, rollouts]);

  return {
    rollouts,
    currentRollout,
    loading,
    error,
    createRollout,
    startRollout,
    pauseRollout,
    resumeRollout
  };
}

export default {
  useAppStore,
  useBuild,
  usePublishing,
  useRollout
};
