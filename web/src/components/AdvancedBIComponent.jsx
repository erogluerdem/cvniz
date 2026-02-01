import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '@/context/ThemeContext';
import { useBIHooks } from '@/hooks/useBIHooks';

/**
 * AdvancedBIComponent
 * Comprehensive Business Intelligence dashboard
 * 
 * Features:
 * - KPI monitoring with trends
 * - Predictive analytics (churn, engagement, LTV)
 * - Forecasting visualizations
 * - Custom chart generation
 * - Report generation
 */

export const AdvancedBIComponent = ({ userId }) => {
  const { colors, isDark } = useTheme();
  
  // State management
  const [activeTab, setActiveTab] = useState('kpis');
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [forecasts, setForecasts] = useState(null);
  const [dashboards, setDashboards] = useState([]);
  const [selectedKPI, setSelectedKPI] = useState(null);
  
  // Custom hooks
  const {
    fetchKPIs,
    predictChurn,
    predictEngagement,
    forecastRevenue,
    generateChart,
    generateReport,
    error,
    loadingState
  } = useBIHooks();
  
  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, [userId]);
  
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const kpisData = await fetchKPIs();
      setKpis(kpisData);
    } catch (error) {
      console.error('Error loading KPIs:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchKPIs]);
  
  // Handle churn prediction
  const handleChurnPrediction = useCallback(async () => {
    setLoading(true);
    try {
      const prediction = await predictChurn(userId);
      setPredictions(prediction);
    } catch (error) {
      console.error('Error predicting churn:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, predictChurn]);
  
  // Handle engagement prediction
  const handleEngagementPrediction = useCallback(async () => {
    setLoading(true);
    try {
      const prediction = await predictEngagement(userId);
      setPredictions(prediction);
    } catch (error) {
      console.error('Error predicting engagement:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, predictEngagement]);
  
  // Handle forecast generation
  const handleForecast = useCallback(async () => {
    setLoading(true);
    try {
      const forecastData = await forecastRevenue();
      setForecasts(forecastData);
    } catch (error) {
      console.error('Error generating forecast:', error);
    } finally {
      setLoading(false);
    }
  }, [forecastRevenue]);
  
  // Render KPI cards
  const renderKPICard = (kpi) => (
    <TouchableOpacity
      key={kpi.kpiId}
      style={[styles.kpiCard, { backgroundColor: colors.surface }]}
      onPress={() => setSelectedKPI(kpi)}
    >
      <View style={styles.kpiHeader}>
        <Text style={[styles.kpiName, { color: colors.text }]}>
          {kpi.name}
        </Text>
        <View style={[
          styles.statusBadge,
          {
            backgroundColor: kpi.status === 'on_track' 
              ? colors.success 
              : kpi.status === 'at_risk' 
              ? colors.warning 
              : colors.error
          }
        ]}>
          <Text style={styles.statusText}>
            {kpi.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.kpiValues}>
        <Text style={[styles.kpiValue, { color: colors.text }]}>
          {kpi.currentValue}
        </Text>
        <Text style={[styles.kpiTarget, { color: colors.textSecondary }]}>
          Target: {kpi.targetValue}
        </Text>
      </View>
      
      <View style={styles.kpiProgress}>
        <View
          style={[
            styles.progressBar,
            { backgroundColor: colors.primary },
            { width: `${Math.min((kpi.currentValue / kpi.targetValue) * 100, 100)}%` }
          ]}
        />
      </View>
      
      <View style={styles.kpiFooter}>
        <Text style={[styles.trendText, {
          color: kpi.trend === 'increasing' 
            ? colors.success 
            : kpi.trend === 'decreasing' 
            ? colors.error 
            : colors.warning
        }]}>
          {kpi.trend === 'increasing' ? '↑' : kpi.trend === 'decreasing' ? '↓' : '→'} {kpi.trend}
        </Text>
        <Text style={[styles.dateText, { color: colors.textSecondary }]}>
          Last updated: {new Date(kpi.lastUpdated).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  // Render prediction card
  const renderPredictionCard = (prediction) => {
    if (prediction.type === 'churn') {
      return (
        <View style={[styles.predictionCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Churn Risk Prediction
          </Text>
          
          <View style={styles.predictionContent}>
            <Text style={[styles.predictionScore, { color: colors.text }]}>
              {(prediction.churnProbability * 100).toFixed(1)}%
            </Text>
            <Text style={[styles.riskLevel, {
              color: prediction.riskLevel === 'high' 
                ? colors.error 
                : prediction.riskLevel === 'medium' 
                ? colors.warning 
                : colors.success
            }]}>
              {prediction.riskLevel.toUpperCase()}
            </Text>
          </View>
          
          <Text style={[styles.sectionLabel, { color: colors.text }]}>
            Risk Factors:
          </Text>
          {prediction.riskFactors?.map((factor, idx) => (
            <Text key={idx} style={[styles.riskFactor, { color: colors.textSecondary }]}>
              • {factor}
            </Text>
          ))}
          
          <Text style={[styles.sectionLabel, { color: colors.text, marginTop: 12 }]}>
            Recommended Actions:
          </Text>
          {prediction.recommendedActions?.map((action, idx) => (
            <Text key={idx} style={[styles.action, { color: colors.primary }]}>
              • {action}
            </Text>
          ))}
        </View>
      );
    }
    
    if (prediction.type === 'engagement') {
      return (
        <View style={[styles.predictionCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Engagement Forecast
          </Text>
          
          <View style={styles.engagementMetrics}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Current
              </Text>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {prediction.currentEngagementScore}
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Projected (30d)
              </Text>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {prediction.projectedEngagementScore}
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Trend
              </Text>
              <Text style={[styles.metricValue, {
                color: prediction.trend === 'declining' 
                  ? colors.error 
                  : colors.success
              }]}>
                {prediction.trend}
              </Text>
            </View>
          </View>
        </View>
      );
    }
    
    return null;
  };
  
  // Render forecast visualization
  const renderForecast = (forecast) => {
    if (!forecast || !forecast.forecast) return null;
    
    const forecastData = {
      labels: forecast.forecast.slice(0, 6).map((f, i) => `M${i + 1}`),
      datasets: [
        {
          data: forecast.forecast.slice(0, 6).map(f => f.forecastValue),
          strokeWidth: 2
        }
      ]
    };
    
    return (
      <View style={[styles.forecastCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {forecast.type === 'revenue' ? 'Revenue Forecast' : 'Growth Forecast'}
        </Text>
        
        <Text style={[styles.forecastMetric, { color: colors.textSecondary }]}>
          Model: {forecast.modelType}
        </Text>
        
        <Text style={[styles.forecastMetric, { color: colors.textSecondary }]}>
          MAPE: {(forecast.mape * 100).toFixed(2)}%
        </Text>
        
        <LineChart
          data={forecastData}
          width={320}
          height={200}
          chartConfig={{
            backgroundColor: colors.surface,
            backgroundGradientFrom: colors.surface,
            backgroundGradientTo: colors.surface,
            color: () => colors.primary,
            labelColor: () => colors.textSecondary,
            style: { borderRadius: 16 }
          }}
          style={styles.chart}
        />
        
        <View style={styles.forecastData}>
          {forecast.forecast.slice(0, 3).map((item, idx) => (
            <View key={idx} style={styles.forecastItem}>
              <Text style={[styles.forecastLabel, { color: colors.textSecondary }]}>
                Period {item.period}
              </Text>
              <Text style={[styles.forecastValue, { color: colors.text }]}>
                {typeof item.forecastValue === 'number' 
                  ? item.forecastValue.toFixed(0) 
                  : item.projectedUsers}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };
  
  // Render tabs
  const renderTabBar = () => (
    <View style={[styles.tabBar, { backgroundColor: colors.background }]}>
      {['kpis', 'predictions', 'forecasts', 'insights'].map(tab => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 3 }
          ]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[
            styles.tabLabel,
            { color: activeTab === tab ? colors.primary : colors.textSecondary }
          ]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'kpis':
        return (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Key Performance Indicators
            </Text>
            {kpis.map(renderKPICard)}
          </View>
        );
      
      case 'predictions':
        return (
          <ScrollView style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Predictive Analytics
            </Text>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={handleChurnPrediction}
            >
              <Text style={styles.actionButtonText}>Predict Churn Risk</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.secondary }]}
              onPress={handleEngagementPrediction}
            >
              <Text style={styles.actionButtonText}>Predict Engagement</Text>
            </TouchableOpacity>
            
            {predictions && renderPredictionCard(predictions)}
          </ScrollView>
        );
      
      case 'forecasts':
        return (
          <ScrollView style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Forecasting
            </Text>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={handleForecast}
            >
              <Text style={styles.actionButtonText}>Generate Revenue Forecast</Text>
            </TouchableOpacity>
            
            {forecasts && renderForecast(forecasts)}
          </ScrollView>
        );
      
      case 'insights':
        return (
          <ScrollView style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Business Insights
            </Text>
            
            <View style={[styles.insightCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.insightTitle, { color: colors.primary }]}>
                📊 Key Metrics Summary
              </Text>
              <Text style={[styles.insightText, { color: colors.text }]}>
                • Total KPIs Tracked: {kpis.length}
              </Text>
              <Text style={[styles.insightText, { color: colors.text }]}>
                • On Track: {kpis.filter(k => k.status === 'on_track').length}
              </Text>
              <Text style={[styles.insightText, { color: colors.text }]}>
                • At Risk: {kpis.filter(k => k.status === 'at_risk').length}
              </Text>
              <Text style={[styles.insightText, { color: colors.text }]}>
                • Critical: {kpis.filter(k => k.status === 'critical').length}
              </Text>
            </View>
            
            <View style={[styles.insightCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.insightTitle, { color: colors.primary }]}>
                🎯 Recommendations
              </Text>
              <Text style={[styles.insightText, { color: colors.text }]}>
                • Focus on critical KPIs
              </Text>
              <Text style={[styles.insightText, { color: colors.text }]}>
                • Monitor at-risk metrics weekly
              </Text>
              <Text style={[styles.insightText, { color: colors.text }]}>
                • Celebrate on-track achievements
              </Text>
            </View>
          </ScrollView>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderTabBar()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginRight: 16
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600'
  },
  content: {
    flex: 1,
    padding: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  kpiCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  kpiName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  kpiValues: {
    marginBottom: 12
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  kpiTarget: {
    fontSize: 12,
    marginTop: 4
  },
  kpiProgress: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    borderRadius: 3
  },
  kpiFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600'
  },
  dateText: {
    fontSize: 10
  },
  predictionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12
  },
  predictionContent: {
    alignItems: 'center',
    marginBottom: 16
  },
  predictionScore: {
    fontSize: 36,
    fontWeight: 'bold'
  },
  riskLevel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12
  },
  riskFactor: {
    fontSize: 12,
    marginBottom: 4
  },
  action: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center'
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  },
  forecastCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  forecastMetric: {
    fontSize: 12,
    marginBottom: 4
  },
  chart: {
    borderRadius: 8,
    marginVertical: 12
  },
  forecastData: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  forecastItem: {
    alignItems: 'center'
  },
  forecastLabel: {
    fontSize: 10,
    marginBottom: 4
  },
  forecastValue: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  engagementMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  metricItem: {
    alignItems: 'center',
    flex: 1
  },
  metricLabel: {
    fontSize: 10,
    marginBottom: 4
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  insightCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8
  },
  insightText: {
    fontSize: 12,
    marginBottom: 4,
    lineHeight: 18
  }
});

export default AdvancedBIComponent;
