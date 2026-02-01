/**
 * backend/src/routes/bi.js
 * Advanced Business Intelligence API routes
 * 
 * Endpoints:
 * - Predictive Analytics (churn, engagement, LTV predictions)
 * - Business Intelligence (KPIs, dashboards, reports)
 * - Forecasting (revenue, growth, demand forecasts)
 * - Data Visualization (charts, exports, dashboards)
 */

const express = require('express');
const router = express.Router();
const Sentry = require('@sentry/node');

// Import services
const PredictiveAnalyticsService = require('../services/PredictiveAnalyticsService');
const BusinessIntelligenceService = require('../services/BusinessIntelligenceService');
const ForecastingService = require('../services/ForecastingService');
const DataVisualizationService = require('../services/DataVisualizationService');

// Initialize services
const predictiveAnalytics = new PredictiveAnalyticsService();
const businessIntelligence = new BusinessIntelligenceService();
const forecasting = new ForecastingService();
const visualization = new DataVisualizationService();

// Middleware for authentication
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  req.userId = 'user-' + Math.random().toString(36);
  next();
};

router.use(authMiddleware);

/**
 * ================================
 * PREDICTIVE ANALYTICS ROUTES
 * ================================
 */

/**
 * POST /api/bi/analytics/churn-model
 * Train churn prediction model
 */
router.post('/analytics/churn-model', (req, res) => {
  try {
    const { trainingData } = req.body;
    
    if (!trainingData || !Array.isArray(trainingData)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Training data required as array' 
      });
    }
    
    const model = predictiveAnalytics.trainChurnModel(trainingData);
    
    res.json({
      success: true,
      data: model
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bi/analytics/predict-churn/:userId
 * Predict churn probability for a user
 */
router.post('/analytics/predict-churn/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { userBehavior } = req.body;
    
    if (!userBehavior) {
      return res.status(400).json({ 
        success: false, 
        error: 'User behavior data required' 
      });
    }
    
    const prediction = predictiveAnalytics.predictChurn(userId, userBehavior);
    
    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bi/analytics/predict-engagement/:userId
 * Predict user engagement level
 */
router.post('/analytics/predict-engagement/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { userData } = req.body;
    
    const prediction = predictiveAnalytics.predictEngagement(userId, userData || {});
    
    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bi/analytics/predict-ltv/:userId
 * Predict user lifetime value
 */
router.post('/analytics/predict-ltv/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { userData } = req.body;
    
    const prediction = predictiveAnalytics.predictLTV(userId, userData || {});
    
    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bi/analytics/clustering
 * Perform user segmentation via clustering
 */
router.post('/analytics/clustering', (req, res) => {
  try {
    const { usersData, clusterCount } = req.body;
    
    if (!usersData || !Array.isArray(usersData)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Users data required as array' 
      });
    }
    
    const analysis = predictiveAnalytics.performClustering(
      usersData,
      clusterCount || 5
    );
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/bi/analytics/feature-importance/:modelId
 * Get feature importance analysis
 */
router.get('/analytics/feature-importance/:modelId', (req, res) => {
  try {
    const { modelId } = req.params;
    
    const importance = predictiveAnalytics.analyzeFeatureImportance(modelId);
    
    res.json({
      success: true,
      data: importance
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bi/analytics/detect-anomalies
 * Detect anomalies in user behavior
 */
router.post('/analytics/detect-anomalies', (req, res) => {
  try {
    const { behaviorHistory } = req.body;
    
    if (!behaviorHistory || !Array.isArray(behaviorHistory)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Behavior history required as array' 
      });
    }
    
    const analysis = predictiveAnalytics.detectAnomalies(behaviorHistory);
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * ================================
 * BUSINESS INTELLIGENCE ROUTES
 * ================================
 */

/**
 * POST /api/bi/kpis
 * Create custom KPI
 */
router.post('/kpis', (req, res) => {
  try {
    const kpiData = req.body;
    
    const kpi = businessIntelligence.createKPI(kpiData);
    
    res.json({
      success: true,
      data: kpi
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/bi/kpis/:kpiId
 * Update KPI value
 */
router.put('/kpis/:kpiId', (req, res) => {
  try {
    const { kpiId } = req.params;
    const { value } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Value required' 
      });
    }
    
    const kpi = businessIntelligence.updateKPIValue(kpiId, value);
    
    res.json({
      success: true,
      data: kpi
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/bi/kpis/:kpiId
 * Get KPI details
 */
router.get('/kpis/:kpiId', (req, res) => {
  try {
    const { kpiId } = req.params;
    
    const kpi = businessIntelligence.getKPI(kpiId);
    
    res.json({
      success: true,
      data: kpi
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/bi/kpis
 * Get all KPIs
 */
router.get('/kpis', (req, res) => {
  try {
    const { category } = req.query;
    
    const result = businessIntelligence.getAllKPIs(category);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bi/dashboards
 * Create custom dashboard
 */
router.post('/dashboards', (req, res) => {
  try {
    const dashboardData = req.body;
    
    const dashboard = businessIntelligence.createDashboard(dashboardData);
    
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/bi/dashboards/:dashboardId
 * Get dashboard with KPI data
 */
router.get('/dashboards/:dashboardId', (req, res) => {
  try {
    const { dashboardId } = req.params;
    
    const dashboard = businessIntelligence.getDashboard(dashboardId);
    
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bi/reports
 * Generate comprehensive report
 */
router.post('/reports', (req, res) => {
  try {
    const reportData = req.body;
    
    const report = businessIntelligence.generateReport(reportData);
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/bi/reports/:reportId
 * Get report
 */
router.get('/reports/:reportId', (req, res) => {
  try {
    const { reportId } = req.params;
    
    const report = businessIntelligence.getReport(reportId);
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bi/comparative-analysis
 * Perform comparative analysis
 */
router.post('/comparative-analysis', (req, res) => {
  try {
    const { metric, periods } = req.body;
    
    if (!metric) {
      return res.status(400).json({ 
        success: false, 
        error: 'Metric required' 
      });
    }
    
    const analysis = businessIntelligence.performComparativeAnalysis(
      metric,
      periods || 3
    );
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * ================================
 * FORECASTING ROUTES
 * ================================
 */

/**
 * POST /api/bi/forecast/revenue
 * Forecast revenue
 */
router.post('/forecast/revenue', (req, res) => {
  try {
    const { historicalRevenue, periods } = req.body;
    
    if (!historicalRevenue || !Array.isArray(historicalRevenue)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Historical revenue data required' 
      });
    }
    
    const forecast = forecasting.forecastRevenue(
      historicalRevenue,
      periods || 12
    );
    
    res.json({
      success: true,
      data: forecast
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bi/forecast/growth
 * Forecast user growth
 */
router.post('/forecast/growth', (req, res) => {
  try {
    const { historicalGrowth, periods } = req.body;
    
    if (!historicalGrowth || !Array.isArray(historicalGrowth)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Historical growth data required' 
      });
    }
    
    const forecast = forecasting.forecastUserGrowth(
      historicalGrowth,
      periods || 12
    );
    
    res.json({
      success: true,
      data: forecast
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bi/forecast/demand
 * Forecast demand
 */
router.post('/forecast/demand', (req, res) => {
  try {
    const { historicalDemand, periods } = req.body;
    
    if (!historicalDemand || !Array.isArray(historicalDemand)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Historical demand data required' 
      });
    }
    
    const forecast = forecasting.forecastDemand(
      historicalDemand,
      periods || 6
    );
    
    res.json({
      success: true,
      data: forecast
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bi/forecast/seasonality
 * Detect seasonality patterns
 */
router.post('/forecast/seasonality', (req, res) => {
  try {
    const { timeSeries } = req.body;
    
    if (!timeSeries || !Array.isArray(timeSeries)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Time series data required' 
      });
    }
    
    const pattern = forecasting.detectSeasonality(timeSeries);
    
    res.json({
      success: true,
      data: pattern
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/bi/forecast/:forecastId
 * Get forecast details
 */
router.get('/forecast/:forecastId', (req, res) => {
  try {
    const { forecastId } = req.params;
    
    const forecast = forecasting.getForecast(forecastId);
    
    res.json({
      success: true,
      data: forecast
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bi/scenario-analysis
 * Generate what-if scenario analysis
 */
router.post('/scenario-analysis', (req, res) => {
  try {
    const { baseline, variables, scenarios } = req.body;
    
    if (!baseline || !variables || !scenarios) {
      return res.status(400).json({ 
        success: false, 
        error: 'Baseline, variables, and scenarios required' 
      });
    }
    
    const analysis = forecasting.generateWhatIfScenario(
      baseline,
      variables,
      scenarios
    );
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * ================================
 * DATA VISUALIZATION ROUTES
 * ================================
 */

/**
 * POST /api/bi/charts/line
 * Generate line chart
 */
router.post('/charts/line', (req, res) => {
  try {
    const chartData = req.body;
    
    const chart = visualization.generateLineChart(chartData);
    
    res.json({
      success: true,
      data: chart
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bi/charts/bar
 * Generate bar chart
 */
router.post('/charts/bar', (req, res) => {
  try {
    const chartData = req.body;
    
    const chart = visualization.generateBarChart(chartData);
    
    res.json({
      success: true,
      data: chart
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bi/charts/pie
 * Generate pie chart
 */
router.post('/charts/pie', (req, res) => {
  try {
    const chartData = req.body;
    
    const chart = visualization.generatePieChart(chartData);
    
    res.json({
      success: true,
      data: chart
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bi/charts/scatter
 * Generate scatter plot
 */
router.post('/charts/scatter', (req, res) => {
  try {
    const chartData = req.body;
    
    const chart = visualization.generateScatterPlot(chartData);
    
    res.json({
      success: true,
      data: chart
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/bi/charts/:chartId
 * Get chart configuration
 */
router.get('/charts/:chartId', (req, res) => {
  try {
    const { chartId } = req.params;
    
    const chart = visualization.getChart(chartId);
    
    res.json({
      success: true,
      data: chart
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/bi/charts/:chartId/export
 * Export chart
 */
router.post('/charts/:chartId/export', (req, res) => {
  try {
    const { chartId } = req.params;
    const { format } = req.body;
    
    const exportJob = visualization.exportChart(chartId, format || 'png');
    
    res.json({
      success: true,
      data: exportJob
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/bi/exports/:exportId/status
 * Get export status
 */
router.get('/exports/:exportId/status', (req, res) => {
  try {
    const { exportId } = req.params;
    
    const status = visualization.getExportStatus(exportId);
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
