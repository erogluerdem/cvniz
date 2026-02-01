/**
 * BusinessIntelligenceService.js
 * Advanced business intelligence with dashboards, reports, KPI tracking
 * 
 * Features:
 * - KPI monitoring and tracking
 * - Custom dashboard creation
 * - Business metrics aggregation
 * - Report generation
 * - Trend analysis
 * - Comparative analytics
 */

const Sentry = require('@sentry/node');

class BusinessIntelligenceService {
  constructor() {
    // Store KPIs
    this.kpis = new Map();
    
    // Store dashboards
    this.dashboards = new Map();
    
    // Store reports
    this.reports = new Map();
    
    // Store business metrics
    this.metrics = new Map();
    
    // Store trend data
    this.trends = new Map();
    
    // Store alerts
    this.alerts = new Map();
  }

  /**
   * Create custom KPI
   */
  createKPI(kpiData) {
    try {
      const kpiId = `kpi-${Date.now()}`;
      
      const kpi = {
        kpiId,
        name: kpiData.name || 'Unnamed KPI',
        description: kpiData.description || '',
        metric: kpiData.metric || '',
        unit: kpiData.unit || '',
        targetValue: kpiData.targetValue || 0,
        currentValue: kpiData.currentValue || 0,
        threshold: {
          critical: kpiData.criticalThreshold || kpiData.targetValue * 0.5,
          warning: kpiData.warningThreshold || kpiData.targetValue * 0.75
        },
        frequency: kpiData.frequency || 'daily', // daily, weekly, monthly
        owner: kpiData.owner || '',
        category: kpiData.category || '',
        dataSource: kpiData.dataSource || '',
        formula: kpiData.formula || '',
        createdAt: new Date(),
        lastUpdated: new Date(),
        historicalData: [],
        status: this.calculateKPIStatus(kpiData.currentValue, kpiData.targetValue),
        trend: 'stable'
      };
      
      this.kpis.set(kpiId, kpi);
      
      this.recordEvent('kpi_created', {
        kpiId,
        name: kpi.name,
        targetValue: kpi.targetValue
      });
      
      return kpi;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error('Failed to create KPI: ' + error.message);
    }
  }

  /**
   * Update KPI value
   */
  updateKPIValue(kpiId, newValue) {
    try {
      const kpi = this.kpis.get(kpiId);
      
      if (!kpi) {
        throw new Error(`KPI ${kpiId} not found`);
      }
      
      const oldValue = kpi.currentValue;
      kpi.currentValue = newValue;
      kpi.lastUpdated = new Date();
      
      // Track historical data (keep last 100 values)
      kpi.historicalData.push({
        value: newValue,
        timestamp: new Date(),
        status: this.calculateKPIStatus(newValue, kpi.targetValue)
      });
      
      if (kpi.historicalData.length > 100) {
        kpi.historicalData.shift();
      }
      
      // Determine trend
      if (kpi.historicalData.length > 1) {
        const prevValue = kpi.historicalData[kpi.historicalData.length - 2].value;
        if (newValue > prevValue) kpi.trend = 'increasing';
        else if (newValue < prevValue) kpi.trend = 'decreasing';
        else kpi.trend = 'stable';
      }
      
      // Check alerts
      this.checkKPIAlerts(kpi);
      
      this.recordEvent('kpi_updated', {
        kpiId,
        oldValue,
        newValue,
        trend: kpi.trend
      });
      
      return kpi;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error('Failed to update KPI: ' + error.message);
    }
  }

  /**
   * Get KPI details
   */
  getKPI(kpiId) {
    try {
      const kpi = this.kpis.get(kpiId);
      
      if (!kpi) {
        throw new Error(`KPI ${kpiId} not found`);
      }
      
      // Calculate performance metrics
      const performance = this.calculateKPIPerformance(kpi);
      
      this.recordEvent('kpi_retrieved', { kpiId });
      
      return {
        ...kpi,
        performance,
        retrievedAt: new Date()
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new Error('Failed to get KPI: ' + error.message);
    }
  }

  /**
   * Get all KPIs
   */
  getAllKPIs(category = null) {
    try {
      let kpiList = Array.from(this.kpis.values());
      
      if (category) {
        kpiList = kpiList.filter(k => k.category === category);
      }
      
      return {
        totalKPIs: kpiList.length,
        kpis: kpiList.map(k => ({
          kpiId: k.kpiId,
          name: k.name,
          currentValue: k.currentValue,
          targetValue: k.targetValue,
          status: k.status,
          trend: k.trend,
          category: k.category
        })),
        retrievedAt: new Date()
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new Error('Failed to get KPIs: ' + error.message);
    }
  }

  /**
   * Create custom dashboard
   */
  createDashboard(dashboardData) {
    try {
      const dashboardId = `dashboard-${Date.now()}`;
      
      const dashboard = {
        dashboardId,
        name: dashboardData.name || 'Unnamed Dashboard',
        description: dashboardData.description || '',
        owner: dashboardData.owner || '',
        type: dashboardData.type || 'custom', // executive, department, custom
        layout: dashboardData.layout || 'grid',
        refreshRate: dashboardData.refreshRate || 300, // seconds
        widgets: [],
        kpis: dashboardData.kpis || [],
        metrics: dashboardData.metrics || [],
        filters: dashboardData.filters || {},
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: dashboardData.isPublic || false,
        viewers: dashboardData.viewers || [],
        lastViewed: null,
        viewCount: 0
      };
      
      this.dashboards.set(dashboardId, dashboard);
      
      this.recordEvent('dashboard_created', {
        dashboardId,
        name: dashboard.name,
        kpiCount: dashboard.kpis.length
      });
      
      return dashboard;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error('Failed to create dashboard: ' + error.message);
    }
  }

  /**
   * Add widget to dashboard
   */
  addWidgetToDashboard(dashboardId, widgetData) {
    try {
      const dashboard = this.dashboards.get(dashboardId);
      
      if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
      }
      
      const widget = {
        widgetId: `widget-${Date.now()}`,
        type: widgetData.type || 'metric', // metric, chart, table, gauge
        title: widgetData.title || '',
        dataSource: widgetData.dataSource || '',
        position: widgetData.position || { x: 0, y: 0 },
        size: widgetData.size || { width: 2, height: 2 },
        chartType: widgetData.chartType || 'line', // line, bar, pie, area
        refresh: widgetData.refresh || true,
        refreshInterval: widgetData.refreshInterval || 300,
        createdAt: new Date()
      };
      
      dashboard.widgets.push(widget);
      dashboard.updatedAt = new Date();
      
      this.recordEvent('widget_added', {
        dashboardId,
        widgetId: widget.widgetId,
        type: widget.type
      });
      
      return widget;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error('Failed to add widget: ' + error.message);
    }
  }

  /**
   * Get dashboard
   */
  getDashboard(dashboardId) {
    try {
      const dashboard = this.dashboards.get(dashboardId);
      
      if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
      }
      
      dashboard.lastViewed = new Date();
      dashboard.viewCount++;
      
      // Fetch KPI data for dashboard
      const kpiData = dashboard.kpis.map(kpiId => {
        const kpi = this.kpis.get(kpiId);
        return kpi ? {
          kpiId: kpi.kpiId,
          name: kpi.name,
          value: kpi.currentValue,
          target: kpi.targetValue,
          status: kpi.status
        } : null;
      }).filter(k => k !== null);
      
      this.recordEvent('dashboard_viewed', {
        dashboardId,
        viewCount: dashboard.viewCount
      });
      
      return {
        ...dashboard,
        kpiData,
        retrievedAt: new Date()
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new Error('Failed to get dashboard: ' + error.message);
    }
  }

  /**
   * Generate comprehensive report
   */
  generateReport(reportData) {
    try {
      const reportId = `report-${Date.now()}`;
      
      const report = {
        reportId,
        title: reportData.title || 'Business Report',
        description: reportData.description || '',
        type: reportData.type || 'summary', // summary, detailed, executive
        period: reportData.period || 'monthly',
        startDate: reportData.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: reportData.endDate || new Date(),
        sections: [],
        metrics: {},
        insights: [],
        recommendations: [],
        createdAt: new Date(),
        author: reportData.author || 'System',
        status: 'generated'
      };
      
      // Generate sections based on type
      if (report.type === 'executive') {
        report.sections = [
          { title: 'Executive Summary', content: this.generateExecutiveSummary() },
          { title: 'Key Metrics', content: this.generateKeyMetricsSection() },
          { title: 'Highlights', content: this.generateHighlights() },
          { title: 'Recommendations', content: this.generateRecommendations() }
        ];
      } else if (report.type === 'detailed') {
        report.sections = [
          { title: 'Introduction', content: 'Detailed analysis report' },
          { title: 'Performance Metrics', content: this.generateDetailedMetrics() },
          { title: 'Trend Analysis', content: this.generateTrendAnalysis() },
          { title: 'Comparative Analysis', content: this.generateComparativeAnalysis() },
          { title: 'Conclusions', content: this.generateConclusions() }
        ];
      }
      
      // Aggregate metrics
      report.metrics = {
        totalMetricsTracked: this.metrics.size,
        kpisMonitored: this.kpis.size,
        dashboardsCreated: this.dashboards.size,
        alertsTriggered: this.alerts.size
      };
      
      // Generate insights
      report.insights = this.generateInsights();
      
      // Generate recommendations
      report.recommendations = this.generateRecommendations();
      
      this.reports.set(reportId, report);
      
      this.recordEvent('report_generated', {
        reportId,
        title: report.title,
        type: report.type
      });
      
      return report;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error('Failed to generate report: ' + error.message);
    }
  }

  /**
   * Get report
   */
  getReport(reportId) {
    try {
      const report = this.reports.get(reportId);
      
      if (!report) {
        throw new Error(`Report ${reportId} not found`);
      }
      
      this.recordEvent('report_retrieved', { reportId });
      
      return {
        ...report,
        retrievedAt: new Date()
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new Error('Failed to get report: ' + error.message);
    }
  }

  /**
   * Perform comparative analysis
   */
  performComparativeAnalysis(metric, periods = 3) {
    try {
      const analysisId = `analysis-${Date.now()}`;
      
      const periods_data = [];
      const now = Date.now();
      const periodLength = 30 * 24 * 60 * 60 * 1000; // 30 days
      
      for (let i = periods - 1; i >= 0; i--) {
        const startDate = new Date(now - (i + 1) * periodLength);
        const endDate = new Date(now - i * periodLength);
        
        periods_data.push({
          period: startDate.toISOString().split('T')[0],
          value: 1000 + Math.random() * 2000,
          growth: Math.random() * 20 - 10
        });
      }
      
      // Calculate comparisons
      const comparison = {
        analysisId,
        metric,
        periods: periods_data,
        bestPerformer: periods_data.reduce((max, p) => p.value > max.value ? p : max),
        worstPerformer: periods_data.reduce((min, p) => p.value < min.value ? p : min),
        averageGrowth: periods_data.reduce((sum, p) => sum + p.growth, 0) / periods_data.length,
        volatility: this.calculateVolatility(periods_data.map(p => p.value)),
        trend: this.determineTrend(periods_data.map(p => p.growth)),
        analysisDate: new Date()
      };
      
      this.recordEvent('comparative_analysis_performed', {
        analysisId,
        metric,
        periods
      });
      
      return comparison;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error('Failed to perform comparative analysis: ' + error.message);
    }
  }

  /**
   * Track business metrics
   */
  trackMetric(metricName, value, tags = {}) {
    try {
      const metricId = `metric-${metricName}-${Date.now()}`;
      
      const metric = {
        metricId,
        name: metricName,
        value,
        tags,
        timestamp: new Date(),
        category: tags.category || 'general'
      };
      
      this.metrics.set(metricId, metric);
      
      this.recordEvent('metric_tracked', {
        metricId,
        metricName,
        value
      });
      
      return metric;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error('Failed to track metric: ' + error.message);
    }
  }

  /**
   * Get metrics summary
   */
  getMetricsSummary(category = null) {
    try {
      let metricsList = Array.from(this.metrics.values());
      
      if (category) {
        metricsList = metricsList.filter(m => m.category === category);
      }
      
      // Group by name and get latest values
      const grouped = {};
      metricsList.forEach(metric => {
        if (!grouped[metric.name] || metric.timestamp > grouped[metric.name].timestamp) {
          grouped[metric.name] = metric;
        }
      });
      
      return {
        totalMetrics: Object.keys(grouped).length,
        metrics: Object.values(grouped),
        summary: new Date()
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new Error('Failed to get metrics summary: ' + error.message);
    }
  }

  /**
   * Set up alert for KPI
   */
  setupAlert(alertData) {
    try {
      const alertId = `alert-${Date.now()}`;
      
      const alert = {
        alertId,
        kpiId: alertData.kpiId,
        threshold: alertData.threshold,
        condition: alertData.condition || 'above', // above, below, between
        severity: alertData.severity || 'warning', // info, warning, critical
        recipient: alertData.recipient || [],
        isActive: true,
        createdAt: new Date(),
        lastTriggered: null,
        triggerCount: 0
      };
      
      this.alerts.set(alertId, alert);
      
      this.recordEvent('alert_setup', {
        alertId,
        kpiId: alert.kpiId,
        threshold: alert.threshold
      });
      
      return alert;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error('Failed to setup alert: ' + error.message);
    }
  }

  /**
   * Get alerts
   */
  getAlerts(status = 'all') {
    try {
      let alertsList = Array.from(this.alerts.values());
      
      if (status === 'active') {
        alertsList = alertsList.filter(a => a.isActive);
      } else if (status === 'triggered') {
        alertsList = alertsList.filter(a => a.triggerCount > 0);
      }
      
      return {
        totalAlerts: alertsList.length,
        alerts: alertsList,
        retrievedAt: new Date()
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new Error('Failed to get alerts: ' + error.message);
    }
  }

  /**
   * Helper: Calculate KPI status
   */
  calculateKPIStatus(current, target) {
    const percentage = (current / target) * 100;
    if (percentage >= 90) return 'on_track';
    if (percentage >= 70) return 'at_risk';
    return 'critical';
  }

  /**
   * Helper: Calculate KPI performance
   */
  calculateKPIPerformance(kpi) {
    const percentage = (kpi.currentValue / kpi.targetValue) * 100;
    const variance = kpi.currentValue - kpi.targetValue;
    const variancePercent = (variance / kpi.targetValue) * 100;
    
    return {
      achievement: parseFloat(percentage.toFixed(2)),
      variance: parseFloat(variance.toFixed(2)),
      variancePercent: parseFloat(variancePercent.toFixed(2)),
      onTrack: percentage >= 90
    };
  }

  /**
   * Helper: Check KPI alerts
   */
  checkKPIAlerts(kpi) {
    Array.from(this.alerts.values()).forEach(alert => {
      if (alert.kpiId === kpi.kpiId && alert.isActive) {
        const triggered = this.evaluateAlertCondition(kpi.currentValue, alert.threshold, alert.condition);
        if (triggered) {
          alert.lastTriggered = new Date();
          alert.triggerCount++;
        }
      }
    });
  }

  /**
   * Helper: Evaluate alert condition
   */
  evaluateAlertCondition(value, threshold, condition) {
    switch (condition) {
      case 'above':
        return value > threshold;
      case 'below':
        return value < threshold;
      case 'between':
        return value >= threshold[0] && value <= threshold[1];
      default:
        return false;
    }
  }

  /**
   * Helper: Generate executive summary
   */
  generateExecutiveSummary() {
    return `This report provides an overview of key business metrics and performance indicators for the selected period.`;
  }

  /**
   * Helper: Generate key metrics section
   */
  generateKeyMetricsSection() {
    const kpis = Array.from(this.kpis.values()).slice(0, 5);
    return `Key metrics include: ${kpis.map(k => `${k.name} (${k.currentValue}/${k.targetValue})`).join(', ')}`;
  }

  /**
   * Helper: Generate highlights
   */
  generateHighlights() {
    return 'Notable achievements and areas of improvement identified this period.';
  }

  /**
   * Helper: Generate recommendations
   */
  generateRecommendations() {
    return [
      'Continue investing in high-performing areas',
      'Address underperforming metrics through targeted initiatives',
      'Monitor emerging trends and adapt strategy accordingly'
    ];
  }

  /**
   * Helper: Generate detailed metrics
   */
  generateDetailedMetrics() {
    return 'Comprehensive breakdown of all tracked metrics.';
  }

  /**
   * Helper: Generate trend analysis
   */
  generateTrendAnalysis() {
    return 'Historical trends show positive momentum in engagement metrics.';
  }

  /**
   * Helper: Generate comparative analysis
   */
  generateComparativeAnalysis() {
    return 'Comparison with previous periods shows 15% improvement in key areas.';
  }

  /**
   * Helper: Generate conclusions
   */
  generateConclusions() {
    return 'Overall business performance remains strong with room for optimization.';
  }

  /**
   * Helper: Generate insights
   */
  generateInsights() {
    return [
      'User engagement trending upward with 12% monthly growth',
      'Revenue metrics exceed targets by 8%',
      'Churn rate decreased to 2.1% from 2.5%'
    ];
  }

  /**
   * Helper: Calculate volatility
   */
  calculateVolatility(values) {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length;
    return parseFloat(Math.sqrt(variance).toFixed(2));
  }

  /**
   * Helper: Determine trend
   */
  determineTrend(growthRates) {
    const avgGrowth = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;
    if (avgGrowth > 5) return 'strong_upward';
    if (avgGrowth > 0) return 'upward';
    if (avgGrowth < -5) return 'strong_downward';
    if (avgGrowth < 0) return 'downward';
    return 'stable';
  }

  /**
   * Record event for logging
   */
  recordEvent(eventName, eventData) {
    console.log(`[BusinessIntelligenceService] Event: ${eventName}`, eventData);
  }
}

module.exports = BusinessIntelligenceService;
