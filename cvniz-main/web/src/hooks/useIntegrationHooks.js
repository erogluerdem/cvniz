import { useState, useCallback } from 'react';

export function useIntegrations() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listIntegrations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/integrations', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      setIntegrations(data.integrations || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const enableIntegration = useCallback(async (integrationName, credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/integrations/enable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ integrationName, credentials })
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

  const disableIntegration = useCallback(async (integrationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/integrations/${integrationId}/disable`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      setIntegrations(integrations.filter(i => i.integrationId !== integrationId));
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [integrations]);

  const testIntegration = useCallback(async (integrationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/integrations/${integrationId}/test`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const getStats = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/integrations/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    integrations,
    loading,
    error,
    listIntegrations,
    enableIntegration,
    disableIntegration,
    testIntegration,
    getStats
  };
}

export function useWebhooks(integrationId) {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listWebhooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/integrations/${integrationId}/webhooks`,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );

      const data = await response.json();
      setWebhooks(data.webhooks || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [integrationId]);

  const createWebhook = useCallback(async (event, webhookUrl) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/integrations/${integrationId}/webhooks`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ event, webhookUrl })
        }
      );

      const data = await response.json();
      setWebhooks([...webhooks, data]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [integrationId, webhooks]);

  const deleteWebhook = useCallback(async (webhookId) => {
    setLoading(true);
    setError(null);
    try {
      await fetch(
        `http://localhost:5000/api/integrations/${integrationId}/webhooks/${webhookId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setWebhooks(webhooks.filter(w => w.webhookId !== webhookId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [integrationId, webhooks]);

  return {
    webhooks,
    loading,
    error,
    listWebhooks,
    createWebhook,
    deleteWebhook
  };
}

export function useZapier() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerWebhook = useCallback(async (event, webhookUrl) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/zapier/webhooks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ event, webhookUrl })
      });

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const listWebhooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/zapier/webhooks', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    registerWebhook,
    listWebhooks
  };
}

export function useSlack() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async (botToken, teamId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/slack/connect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ botToken, teamId })
      });

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const configureNotifications = useCallback(async (connectionId, notifications) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/slack/${connectionId}/notifications`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notifications)
        }
      );

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    connect,
    configureNotifications
  };
}

export function useGoogleCalendar() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async (accessToken, refreshToken, calendarId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/google-calendar/connect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accessToken, refreshToken, calendarId })
      });

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (connectionId, eventData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/google-calendar/${connectionId}/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventData)
        }
      );

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUpcomingEvents = useCallback(async (connectionId, days = 30) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/google-calendar/${connectionId}/events?days=${days}`,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    connect,
    createEvent,
    getUpcomingEvents
  };
}
