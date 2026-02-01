# Phase 2 Step 3: Advanced Monitoring & Analytics

## Overview
Real-time system monitoring, performance tracking, and user behavior analytics. Provides comprehensive visibility into application health, user engagement, and system performance.

## Architecture

### Backend Services

#### MonitoringService.js
Central monitoring and metrics collection service.

**Key Methods:**

1. **recordEndpointMetric(endpoint, method, responseTime, statusCode, userId)**
   - Records API endpoint performance
   - Calculates aggregated statistics
   - Triggers alerts on performance degradation
   - Stores metrics in Redis time-series

2. **trackUserEngagement(userId, action, metadata)**
   - Logs user actions and interactions
   - Updates engagement counters
   - Calculates user activity stats
   - 90-day retention

3. **getFeatureAdoptionMetrics()**
   - Calculates feature usage rates
   - Identifies popular features
   - Tracks adoption trends
   - 1-hour cache

4. **getUserRetentionMetrics()**
   - Calculates retention rates
   - Tracks active users (24h, 30d, etc)
   - Measures churn rate
   - 24-hour cache

5. **trackDatabasePerformance(operation, collectionName, executionTime)**
   - Monitors database query performance
   - Identifies slow queries
   - Tracks operation counts
   - Alerts on slow query spikes

6. **trackApiKeyUsage(apiKeyId, userId, endpoint)**
   - Monitors API key usage
   - Rate limit tracking
   - Usage alerts
   - Daily quotas

7. **trackCachePerformance(operation, key, hit, duration)**
   - Cache hit/miss rates
   - Performance metrics
   - Cache effectiveness
   - 24-hour retention

8. **getSystemHealth()**
   - Overall system status
   - Component health (DB, Cache, API)
   - Resource usage (Memory, CPU)
   - Recent alerts

9. **createAlert(alertType, message, severity)**
   - System alert generation
   - Alert storage and history
   - Sentry integration for critical alerts
   - Historical tracking (7 days)

10. **getMetricsReport(startDate, endDate)**
    - Comprehensive metrics report
    - Date range filtering
    - Multi-metric aggregation
    - Export ready

### API Endpoints

```
GET  /api/monitoring/health
     Response: { status, components, metrics, alerts }

GET  /api/monitoring/features
     Response: { features, totalFeatureUsage, timestamp }
     Auth: Admin only

GET  /api/monitoring/retention
     Response: { activeUsers, retentionRate, churnRate, monthlyActiveUsers }
     Auth: Admin only

GET  /api/monitoring/performance
     Query: endpoint (optional)
     Response: { metrics: [], totalMetrics }
     Auth: Admin only

GET  /api/monitoring/database
     Response: { metrics: [], totalOperations }
     Auth: Admin only

GET  /api/monitoring/cache
     Response: { metrics: [], totalOperations }
     Auth: Admin only

GET  /api/monitoring/alerts
     Response: { alerts: [], total }
     Auth: Admin only

GET  /api/monitoring/report
     Query: startDate, endDate
     Response: { period, engagement, retention, health }
     Auth: Admin only
```

### Frontend Components

#### AnalyticsDashboard.jsx
Comprehensive analytics dashboard (2,500+ lines)

**Features:**
- Real-time system status
- Engagement trend charts
- Feature usage pie charts
- API performance bar charts
- Database performance metrics
- Cache hit rate visualization
- System alerts display
- Auto-refresh capability
- Metric export functionality
- Tabbed interface (Overview, Engagement, Performance, Alerts)
- Responsive design with Recharts

#### useAnalytics.js
React custom hook for analytics operations

**Methods:**
- getSystemHealth()
- getFeatureMetrics()
- getRetentionMetrics()
- getPerformanceMetrics(endpoint)
- getDatabaseMetrics()
- getCacheMetrics()
- getAlerts()
- getMetricsReport(startDate, endDate)
- exportMetrics(format)

## Metrics Tracked

### User Engagement
- Feature usage counts
- Action types: view, apply, save, dismiss, click
- User activity timeline
- Daily active users
- Monthly active users

### System Performance
- API response times (per endpoint)
- Database query performance
- Cache hit rates
- Error rates per endpoint
- Request throughput

### Business Metrics
- Feature adoption rates
- User retention rate
- Churn rate
- Recommendation quality
- Job application conversion rates

### Infrastructure
- Memory usage
- CPU usage
- Database connection pool
- Cache size
- Request queue depth

## Alert System

### Alert Types

**Performance Alerts:**
- `PERFORMANCE_DEGRADATION`: Avg response > 5 seconds
- `HIGH_ERROR_RATE`: Error rate > 10%
- `SLOW_DATABASE`: Database slow queries > 10%

**Resource Alerts:**
- `HIGH_MEMORY_USAGE`: Memory > 90%
- `HIGH_CPU_USAGE`: CPU > 85%
- `CACHE_UNAVAILABLE`: Redis connection lost

**User Alerts:**
- `UNUSUAL_SPIKE`: Traffic spike detected
- `RATE_LIMIT_WARNING`: API key approaching limit
- `LOW_CACHE_HIT_RATE`: Cache hit rate < 50%

### Alert Severity Levels
- **Critical:** System down, data loss risk
- **Warning:** Performance degradation, approaching limits
- **Info:** Normal operational notifications

## Integration Points

### With Sentry
- Send critical alerts to Sentry
- Error tracking integration
- Performance monitoring
- Session tracking

### With Redis (CacheService)
- Time-series metric storage
- Metric aggregation
- Alert history
- Real-time updates

### With Database
- Query performance monitoring
- Operation tracking
- Database health checks

### With Analytics Service
- Integration with existing analytics
- Unified metrics dashboard
- Cross-feature analysis

## Performance Optimization

1. **Caching Strategy**
   - Feature metrics cached 1 hour
   - Retention metrics cached 24 hours
   - Health status cached 60 seconds
   - Report caching for common date ranges

2. **Data Aggregation**
   - Real-time stats calculation
   - Batch metric processing
   - Background aggregation jobs

3. **Storage Optimization**
   - Time-series compression
   - Historical data pruning
   - Retention policies (7-90 days)

4. **Query Optimization**
   - Indexed metric keys
   - Pattern-based retrieval
   - Batch operations

## Testing

### Unit Tests
```javascript
// Test recordEndpointMetric
test('should record and aggregate endpoint metrics');
test('should trigger alert on slow response');

// Test trackUserEngagement
test('should track user actions');
test('should update engagement counters');

// Test getFeatureAdoptionMetrics
test('should calculate adoption rates');
test('should handle no data gracefully');
```

### Integration Tests
```javascript
test('Complete monitoring workflow: Record metrics -> Alert -> Report');
test('System health reflects component status');
test('Metrics persist and aggregate correctly');
```

### Load Tests
```javascript
test('Handle 1000s of concurrent metric recordings');
test('Dashboard refresh performance under load');
```

## Usage Examples

### Backend
```javascript
const MonitoringService = require('./services/MonitoringService');

// Record API performance
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        MonitoringService.recordEndpointMetric(
            req.path,
            req.method,
            duration,
            res.statusCode,
            req.user?.id
        );
    });
    next();
});

// Track user action
MonitoringService.trackUserEngagement(userId, 'job_apply', { jobId });

// Check system health
const health = await MonitoringService.getSystemHealth();
```

### Frontend
```javascript
import { useAnalytics } from './hooks/useAnalytics';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function AdminDashboard() {
    const { health, loading } = useAnalytics();

    return <AnalyticsDashboard />;
}
```

## Dashboard Features

### Overview Tab
- System status card
- Active users counter
- Retention rate gauge
- API response time
- Engagement trend chart
- Component health checklist

### Engagement Tab
- Feature usage pie chart
- Top features ranking
- User action timeline
- Adoption trend line
- Feature comparison

### Performance Tab
- API response time chart
- Error rate trends
- Endpoint comparison
- Database performance
- Cache efficiency metrics

### Alerts Tab
- Alert timeline
- Severity filtering
- Alert details
- Historical alert list
- Alert statistics

## Configuration

### Environment Variables
```
MONITORING_ENABLED=true
ALERT_EMAIL=admin@example.com
METRICS_RETENTION_DAYS=90
CRITICAL_ALERT_WEBHOOK=https://hooks.slack.com/...
PERFORMANCE_THRESHOLD_MS=5000
ERROR_RATE_THRESHOLD=10
```

### Feature Flags
- `ENABLE_MONITORING` - Enable metric collection (default: true)
- `ENABLE_ALERTS` - Enable alert system (default: true)
- `ENABLE_SENTRY_INTEGRATION` - Send to Sentry (default: true)
- `ENABLE_DASHBOARD_EXPORT` - Allow metric export (default: true)

## Future Enhancements

### Phase 2 Step 4 (Next)
1. **ML Anomaly Detection**
   - Automatically detect unusual patterns
   - Predictive alerting
   - Anomaly scoring

2. **Custom Reports**
   - Scheduled report generation
   - Email delivery
   - Template customization

3. **Advanced Filtering**
   - Custom date ranges
   - User segmentation
   - Metric drilling

### Phase 2 Step 5+
1. **Webhook Integrations**
   - Slack alerts
   - PagerDuty integration
   - Custom webhooks

2. **Real-time Notifications**
   - WebSocket updates
   - Push notifications
   - Live dashboards

3. **Comparison Analytics**
   - Period-over-period comparisons
   - Benchmark analysis
   - Goal tracking

## Troubleshooting

### Issue: Metrics not recording
- **Solution:** Check Redis connection, verify CacheService operational

### Issue: Dashboard slow to load
- **Solution:** Check cache hit rates, verify database performance

### Issue: Alerts not triggering
- **Solution:** Check threshold values, verify Sentry connection

### Issue: Missing historical data
- **Solution:** Verify retention settings, check data expiration

## Support

For monitoring issues:
1. Check system health endpoint
2. Review alert history
3. Verify Redis connectivity
4. Check Sentry integration
5. Review MonitoringService logs

---

**Created:** Phase 2 Step 3
**Status:** ✅ Complete
**Files:** 3 new files, 1 modified
**LOC:** 1,500+
**Dashboard Lines:** 2,500+
