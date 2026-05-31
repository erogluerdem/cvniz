import { useState, useCallback } from 'react';

export function usePayment() {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPaymentIntent = useCallback(async (amount, currency = 'USD', metadata = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/payments/intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, currency, metadata })
      });

      const data = await response.json();
      setPayment(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmPayment = useCallback(async (paymentId, paymentDetails) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/payments/${paymentId}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentDetails)
      });

      const data = await response.json();
      setPayment(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPayment = useCallback(async (paymentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      setPayment(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/payments/stats', {
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
    payment,
    loading,
    error,
    createPaymentIntent,
    confirmPayment,
    getPayment,
    getPaymentStats
  };
}

export function useInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createInvoice = useCallback(async (invoiceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/invoices', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      });

      const data = await response.json();
      setInvoice(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getInvoices = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`http://localhost:5000/api/invoices?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      setInvoices(data.invoices || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getInvoice = useCallback(async (invoiceId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${invoiceId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      setInvoice(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generatePDF = useCallback(async (invoiceId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${invoiceId}/pdf`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const blob = await response.blob();
      return blob;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const sendInvoice = useCallback(async (invoiceId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${invoiceId}/send`, {
        method: 'POST',
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

  const markAsPaid = useCallback(async (invoiceId, paymentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${invoiceId}/paid`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      setInvoice(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    invoices,
    invoice,
    loading,
    error,
    createInvoice,
    getInvoices,
    getInvoice,
    generatePDF,
    sendInvoice,
    markAsPaid
  };
}

export function useTaxes() {
  const [calculation, setCalculation] = useState(null);
  const [compliance, setCompliance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateTax = useCallback(async (country, items) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/tax/calculate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ country, items })
      });

      const data = await response.json();
      setCalculation(data.calculation);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserTaxSummary = useCallback(async (year) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/tax/summary?year=${year}`, {
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

  const checkCompliance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/tax/compliance', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      setCompliance(data.compliance);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUpcomingDeadlines = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tax/deadlines', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    calculation,
    compliance,
    loading,
    error,
    calculateTax,
    getUserTaxSummary,
    checkCompliance,
    getUpcomingDeadlines
  };
}

export function useSubscriptions() {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPlans = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`http://localhost:5000/api/subscriptions/plans?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      setPlans(data.plans || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSubscription = useCallback(async (planId, billingCycle = 'monthly') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planId, billingCycle })
      });

      const data = await response.json();
      setSubscription(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserSubscription = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/subscriptions/user', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      setSubscription(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSubscription = useCallback(async (planId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/subscriptions/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPlanId: planId })
      });

      const data = await response.json();
      setSubscription(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelSubscription = useCallback(async (immediately = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/subscriptions/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ immediately })
      });

      const data = await response.json();
      setSubscription(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkUsageLimit = useCallback(async (feature) => {
    try {
      const response = await fetch(`http://localhost:5000/api/subscriptions/usage/${feature}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    plans,
    subscription,
    loading,
    error,
    getPlans,
    createSubscription,
    getUserSubscription,
    updateSubscription,
    cancelSubscription,
    checkUsageLimit
  };
}
