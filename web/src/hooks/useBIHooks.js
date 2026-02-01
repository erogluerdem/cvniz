import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * useBIHooks
 * Custom React hooks for Advanced BI functionality
 * 
 * Hooks:
 * - useKPI: KPI management
 * - usePredictiveAnalytics: Churn, engagement, LTV predictions
 * - useForecast: Revenue, growth, demand forecasting
 * - useVisualization: Chart generation and export
 * - useReport: Report generation
 */

/**
 * useKPI Hook
 * Manage KPIs and business metrics
 */
export const useKPI = () => {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all KPIs
  const fetchKPIs = useCallback(async (category = null) => {
    try {
      setLoading(true);
      const params = category ? { category } : {};
      const response = await axios.get(`${API_BASE}/bi/kpis`, { params });
      setKpis(response.data.data.kpis);
      return response.data.data.kpis;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create KPI
  const createKPI = useCallback(async (kpiData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/kpis`, kpiData);
      const newKPI = response.data.data;
      setKpis([...kpis, newKPI]);
      return newKPI;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [kpis]);

  // Update KPI value
  const updateKPI = useCallback(async (kpiId, value) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE}/bi/kpis/${kpiId}`, { value });
      const updatedKPI = response.data.data;
      setKpis(kpis.map(k => k.kpiId === kpiId ? updatedKPI : k));
      return updatedKPI;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [kpis]);

  // Get specific KPI
  const getKPI = useCallback(async (kpiId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/bi/kpis/${kpiId}`);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    kpis,
    loading,
    error,
    fetchKPIs,
    createKPI,
    updateKPI,
    getKPI
  };
};

/**
 * usePredictiveAnalytics Hook
 * Churn prediction, engagement forecasting, LTV estimation
 */
export const usePredictiveAnalytics = () => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Predict churn
  const predictChurn = useCallback(async (userId, userBehavior) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/analytics/predict-churn/${userId}`, {
        userBehavior: userBehavior || {}
      });
      const prediction = response.data.data;
      setPredictions(prediction);
      return prediction;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Predict engagement
  const predictEngagement = useCallback(async (userId, userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/analytics/predict-engagement/${userId}`, {
        userData: userData || {}
      });
      const prediction = response.data.data;
      setPredictions(prediction);
      return prediction;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Predict LTV
  const predictLTV = useCallback(async (userId, userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/analytics/predict-ltv/${userId}`, {
        userData: userData || {}
      });
      const prediction = response.data.data;
      setPredictions(prediction);
      return prediction;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Perform clustering
  const performClustering = useCallback(async (usersData, clusterCount = 5) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/analytics/clustering`, {
        usersData,
        clusterCount
      });
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Detect anomalies
  const detectAnomalies = useCallback(async (behaviorHistory) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/analytics/detect-anomalies`, {
        behaviorHistory
      });
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    predictions,
    loading,
    error,
    predictChurn,
    predictEngagement,
    predictLTV,
    performClustering,
    detectAnomalies
  };
};

/**
 * useForecast Hook
 * Revenue, growth, and demand forecasting
 */
export const useForecast = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Forecast revenue
  const forecastRevenue = useCallback(async (historicalRevenue, periods = 12) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/forecast/revenue`, {
        historicalRevenue,
        periods
      });
      const forecastData = response.data.data;
      setForecast(forecastData);
      return forecastData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Forecast user growth
  const forecastGrowth = useCallback(async (historicalGrowth, periods = 12) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/forecast/growth`, {
        historicalGrowth,
        periods
      });
      const forecastData = response.data.data;
      setForecast(forecastData);
      return forecastData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Forecast demand
  const forecastDemand = useCallback(async (historicalDemand, periods = 6) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/forecast/demand`, {
        historicalDemand,
        periods
      });
      const forecastData = response.data.data;
      setForecast(forecastData);
      return forecastData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Detect seasonality
  const detectSeasonality = useCallback(async (timeSeries) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/forecast/seasonality`, {
        timeSeries
      });
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate what-if scenario
  const generateScenario = useCallback(async (baseline, variables, scenarios) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/scenario-analysis`, {
        baseline,
        variables,
        scenarios
      });
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    forecast,
    loading,
    error,
    forecastRevenue,
    forecastGrowth,
    forecastDemand,
    detectSeasonality,
    generateScenario
  };
};

/**
 * useVisualization Hook
 * Chart generation and export
 */
export const useVisualization = () => {
  const [chart, setChart] = useState(null);
  const [exportJob, setExportJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate line chart
  const generateLineChart = useCallback(async (chartData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/charts/line`, chartData);
      setChart(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate bar chart
  const generateBarChart = useCallback(async (chartData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/charts/bar`, chartData);
      setChart(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate pie chart
  const generatePieChart = useCallback(async (chartData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/charts/pie`, chartData);
      setChart(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate scatter plot
  const generateScatterPlot = useCallback(async (chartData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/charts/scatter`, chartData);
      setChart(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Export chart
  const exportChart = useCallback(async (chartId, format = 'png') => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/charts/${chartId}/export`, {
        format
      });
      setExportJob(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check export status
  const checkExportStatus = useCallback(async (exportId) => {
    try {
      const response = await axios.get(`${API_BASE}/bi/exports/${exportId}/status`);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    chart,
    exportJob,
    loading,
    error,
    generateLineChart,
    generateBarChart,
    generatePieChart,
    generateScatterPlot,
    exportChart,
    checkExportStatus
  };
};

/**
 * useReport Hook
 * Report generation and management
 */
export const useReport = () => {
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate report
  const generateReport = useCallback(async (reportData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/reports`, reportData);
      const newReport = response.data.data;
      setReport(newReport);
      setReports([...reports, newReport]);
      return newReport;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [reports]);

  // Get report
  const getReport = useCallback(async (reportId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/bi/reports/${reportId}`);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Perform comparative analysis
  const performComparativeAnalysis = useCallback(async (metric, periods = 3) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/bi/comparative-analysis`, {
        metric,
        periods
      });
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    report,
    reports,
    loading,
    error,
    generateReport,
    getReport,
    performComparativeAnalysis
  };
};

/**
 * useBIHooks
 * Unified hook combining all BI functionality
 */
export const useBIHooks = () => {
  const kpiHook = useKPI();
  const analyticsHook = usePredictiveAnalytics();
  const forecastHook = useForecast();
  const vizHook = useVisualization();
  const reportHook = useReport();

  return {
    // KPI
    fetchKPIs: kpiHook.fetchKPIs,
    createKPI: kpiHook.createKPI,
    updateKPI: kpiHook.updateKPI,
    getKPI: kpiHook.getKPI,
    kpis: kpiHook.kpis,

    // Predictive Analytics
    predictChurn: analyticsHook.predictChurn,
    predictEngagement: analyticsHook.predictEngagement,
    predictLTV: analyticsHook.predictLTV,
    performClustering: analyticsHook.performClustering,
    detectAnomalies: analyticsHook.detectAnomalies,
    predictions: analyticsHook.predictions,

    // Forecasting
    forecastRevenue: forecastHook.forecastRevenue,
    forecastGrowth: forecastHook.forecastGrowth,
    forecastDemand: forecastHook.forecastDemand,
    detectSeasonality: forecastHook.detectSeasonality,
    generateScenario: forecastHook.generateScenario,
    forecast: forecastHook.forecast,

    // Visualization
    generateLineChart: vizHook.generateLineChart,
    generateBarChart: vizHook.generateBarChart,
    generatePieChart: vizHook.generatePieChart,
    generateScatterPlot: vizHook.generateScatterPlot,
    exportChart: vizHook.exportChart,
    checkExportStatus: vizHook.checkExportStatus,
    chart: vizHook.chart,

    // Reports
    generateReport: reportHook.generateReport,
    getReport: reportHook.getReport,
    performComparativeAnalysis: reportHook.performComparativeAnalysis,
    report: reportHook.report,

    // Loading and error
    loading: kpiHook.loading || analyticsHook.loading || forecastHook.loading || vizHook.loading || reportHook.loading,
    error: kpiHook.error || analyticsHook.error || forecastHook.error || vizHook.error || reportHook.error,
    loadingState: {
      kpi: kpiHook.loading,
      analytics: analyticsHook.loading,
      forecast: forecastHook.loading,
      visualization: vizHook.loading,
      report: reportHook.loading
    }
  };
};

export default useBIHooks;
