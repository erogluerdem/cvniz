/**
 * DataVisualizationService.js
 * Advanced data visualization for charts, graphs, and visual analytics
 *
 * Features:
 * - Chart generation (line, bar, pie, area, scatter)
 * - Custom visualization creation
 * - Data transformation for visualization
 * - Export capabilities (PNG, PDF, SVG)
 * - Interactive visualization generation
 */

const Sentry = require('@sentry/node');

class DataVisualizationService {
    constructor() {
    // Store generated visualizations
        this.visualizations = new Map();

        // Store chart configurations
        this.chartConfigs = new Map();

        // Store visualization presets
        this.presets = new Map();

        // Store export jobs
        this.exportJobs = new Map();

        // Store visualization analytics
        this.visualizationStats = new Map();
    }

    /**
   * Generate line chart
   */
    generateLineChart(chartData) {
        try {
            const chartId = `chart-line-${Date.now()}`;

            const chart = {
                chartId,
                type: 'line',
                title: chartData.title || 'Line Chart',
                description: chartData.description || '',
                dataPoints: chartData.dataPoints || [],
                series: [],
                xAxis: {
                    label: chartData.xAxisLabel || 'Time',
                    dataType: 'category'
                },
                yAxis: {
                    label: chartData.yAxisLabel || 'Value',
                    dataType: 'numeric',
                    min: this.getMinValue(chartData.dataPoints),
                    max: this.getMaxValue(chartData.dataPoints)
                },
                configuration: {
                    chartType: 'line',
                    showGrid: true,
                    showLegend: true,
                    showTooltip: true,
                    smooth: true,
                    markers: 'circle',
                    markerSize: 6,
                    lineWidth: 2
                },
                colors: this.generateColorPalette(chartData.seriesCount || 1),
                dimensions: { width: 800, height: 500 },
                responsive: true,
                createdAt: new Date(),
                viewCount: 0,
                embedCode: `<div id="chart-${chartId}"></div>`,
                downloadFormats: ['png', 'svg', 'pdf', 'json']
            };

            // Process data into series
            if (Array.isArray(chartData.data)) {
                chart.series = this.transformDataToSeries(chartData.data);
            }

            this.chartConfigs.set(chartId, chart);

            this.recordEvent('line_chart_generated', {
                chartId,
                dataPoints: chartData.dataPoints?.length || 0
            });

            return chart;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error('Failed to generate line chart: ' + error.message);
        }
    }

    /**
   * Generate bar chart
   */
    generateBarChart(chartData) {
        try {
            const chartId = `chart-bar-${Date.now()}`;

            const chart = {
                chartId,
                type: 'bar',
                title: chartData.title || 'Bar Chart',
                description: chartData.description || '',
                dataPoints: chartData.dataPoints || [],
                series: [],
                xAxis: {
                    label: chartData.xAxisLabel || 'Categories',
                    dataType: 'category',
                    categories: chartData.categories || []
                },
                yAxis: {
                    label: chartData.yAxisLabel || 'Value',
                    dataType: 'numeric',
                    min: 0,
                    max: this.getMaxValue(chartData.dataPoints)
                },
                configuration: {
                    chartType: 'bar',
                    orientation: chartData.orientation || 'vertical', // vertical, horizontal
                    barWidth: 0.7,
                    spacing: 0.2,
                    showValue: true,
                    showGrid: true,
                    showLegend: true
                },
                colors: this.generateColorPalette(chartData.seriesCount || 1),
                dimensions: { width: 800, height: 500 },
                responsive: true,
                createdAt: new Date(),
                viewCount: 0,
                downloadFormats: ['png', 'svg', 'pdf', 'json']
            };

            // Process data
            if (Array.isArray(chartData.data)) {
                chart.series = this.transformDataToSeries(chartData.data);
            }

            this.chartConfigs.set(chartId, chart);

            this.recordEvent('bar_chart_generated', {
                chartId,
                orientation: chart.configuration.orientation
            });

            return chart;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error('Failed to generate bar chart: ' + error.message);
        }
    }

    /**
   * Generate pie chart
   */
    generatePieChart(chartData) {
        try {
            const chartId = `chart-pie-${Date.now()}`;

            // Prepare pie data
            const pieData = chartData.data || [];
            const total = pieData.reduce((sum, item) => sum + (item.value || 0), 0);

            const chart = {
                chartId,
                type: 'pie',
                title: chartData.title || 'Pie Chart',
                description: chartData.description || '',
                data: pieData.map(item => ({
                    label: item.label || '',
                    value: item.value || 0,
                    percentage: parseFloat(((item.value / total) * 100).toFixed(2))
                })),
                totalValue: total,
                configuration: {
                    chartType: 'pie',
                    showLegend: true,
                    showPercentage: true,
                    showValues: true,
                    innerRadius: chartData.donut ? 60 : 0, // 0 for pie, >0 for donut
                    startAngle: 0,
                    labelPosition: 'outer'
                },
                colors: this.generateColorPalette(pieData.length),
                dimensions: { width: 600, height: 500 },
                responsive: true,
                createdAt: new Date(),
                viewCount: 0,
                downloadFormats: ['png', 'svg', 'pdf', 'json'],
                interactivity: {
                    hover: true,
                    click: true,
                    hoverOpacity: 0.8
                }
            };

            this.chartConfigs.set(chartId, chart);

            this.recordEvent('pie_chart_generated', {
                chartId,
                segments: pieData.length,
                total
            });

            return chart;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error('Failed to generate pie chart: ' + error.message);
        }
    }

    /**
   * Generate area chart
   */
    generateAreaChart(chartData) {
        try {
            const chartId = `chart-area-${Date.now()}`;

            const chart = {
                chartId,
                type: 'area',
                title: chartData.title || 'Area Chart',
                description: chartData.description || '',
                dataPoints: chartData.dataPoints || [],
                series: [],
                xAxis: {
                    label: chartData.xAxisLabel || 'Time',
                    dataType: 'category'
                },
                yAxis: {
                    label: chartData.yAxisLabel || 'Value',
                    dataType: 'numeric',
                    stacked: chartData.stacked || false,
                    min: 0,
                    max: this.getMaxValue(chartData.dataPoints)
                },
                configuration: {
                    chartType: 'area',
                    fill: true,
                    opacity: 0.7,
                    stacked: chartData.stacked || false,
                    showGrid: true,
                    showLegend: true,
                    showTooltip: true,
                    lineWidth: 2,
                    smooth: true
                },
                colors: this.generateColorPalette(chartData.seriesCount || 1),
                dimensions: { width: 800, height: 500 },
                responsive: true,
                createdAt: new Date(),
                viewCount: 0,
                downloadFormats: ['png', 'svg', 'pdf', 'json']
            };

            if (Array.isArray(chartData.data)) {
                chart.series = this.transformDataToSeries(chartData.data);
            }

            this.chartConfigs.set(chartId, chart);

            this.recordEvent('area_chart_generated', {
                chartId,
                stacked: chart.configuration.stacked
            });

            return chart;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error('Failed to generate area chart: ' + error.message);
        }
    }

    /**
   * Generate scatter plot
   */
    generateScatterPlot(chartData) {
        try {
            const chartId = `chart-scatter-${Date.now()}`;

            const chart = {
                chartId,
                type: 'scatter',
                title: chartData.title || 'Scatter Plot',
                description: chartData.description || '',
                data: chartData.data || [],
                xAxis: {
                    label: chartData.xAxisLabel || 'X Axis',
                    dataType: 'numeric',
                    min: this.getMinValue(chartData.data?.map(d => d.x) || []),
                    max: this.getMaxValue(chartData.data?.map(d => d.x) || [])
                },
                yAxis: {
                    label: chartData.yAxisLabel || 'Y Axis',
                    dataType: 'numeric',
                    min: this.getMinValue(chartData.data?.map(d => d.y) || []),
                    max: this.getMaxValue(chartData.data?.map(d => d.y) || [])
                },
                configuration: {
                    chartType: 'scatter',
                    pointSize: 8,
                    pointShape: 'circle',
                    showTrendline: chartData.showTrendline || false,
                    showRegressionLine: false,
                    showGrid: true,
                    showLegend: true,
                    showTooltip: true
                },
                colors: this.generateColorPalette(1),
                dimensions: { width: 800, height: 600 },
                responsive: true,
                createdAt: new Date(),
                viewCount: 0,
                downloadFormats: ['png', 'svg', 'pdf', 'json'],
                statistics: this.calculateScatterStatistics(chartData.data || [])
            };

            this.chartConfigs.set(chartId, chart);

            this.recordEvent('scatter_plot_generated', {
                chartId,
                dataPoints: chartData.data?.length || 0
            });

            return chart;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error('Failed to generate scatter plot: ' + error.message);
        }
    }

    /**
   * Get chart configuration
   */
    getChart(chartId) {
        try {
            const chart = this.chartConfigs.get(chartId);

            if (!chart) {
                throw new Error(`Chart ${chartId} not found`);
            }

            chart.viewCount++;

            this.recordEvent('chart_retrieved', { chartId });

            return {
                ...chart,
                retrievedAt: new Date()
            };
        } catch (error) {
            Sentry.captureException(error);
            throw new Error('Failed to get chart: ' + error.message);
        }
    }

    /**
   * Create visualization preset
   */
    createPreset(presetData) {
        try {
            const presetId = `preset-${Date.now()}`;

            const preset = {
                presetId,
                name: presetData.name || 'Unnamed Preset',
                description: presetData.description || '',
                category: presetData.category || 'custom',
                chartType: presetData.chartType,
                defaultConfig: presetData.defaultConfig || {},
                colorScheme: presetData.colorScheme || 'default',
                templates: presetData.templates || [],
                isPublic: presetData.isPublic || false,
                createdAt: new Date(),
                usageCount: 0,
                tags: presetData.tags || []
            };

            this.presets.set(presetId, preset);

            this.recordEvent('preset_created', {
                presetId,
                name: preset.name,
                chartType: preset.chartType
            });

            return preset;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error('Failed to create preset: ' + error.message);
        }
    }

    /**
   * Export chart
   */
    exportChart(chartId, format = 'png') {
        try {
            const chart = this.chartConfigs.get(chartId);

            if (!chart) {
                throw new Error(`Chart ${chartId} not found`);
            }

            if (!chart.downloadFormats.includes(format)) {
                throw new Error(`Format ${format} not supported`);
            }

            const exportId = `export-${chartId}-${Date.now()}`;

            // Simulate export processing
            const exportJob = {
                exportId,
                chartId,
                format,
                status: 'processing',
                progress: 0,
                fileSize: null,
                downloadUrl: null,
                createdAt: new Date(),
                completedAt: null,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            };

            this.exportJobs.set(exportId, exportJob);

            // Simulate completion after small delay
            setTimeout(() => {
                const job = this.exportJobs.get(exportId);
                if (job) {
                    job.status = 'completed';
                    job.progress = 100;
                    job.fileSize = Math.round(100 + Math.random() * 900); // KB
                    job.downloadUrl = `https://api.cvniz.com/exports/${exportId}.${format}`;
                    job.completedAt = new Date();
                }
            }, 1000);

            this.recordEvent('chart_export_started', {
                exportId,
                chartId,
                format
            });

            return exportJob;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error('Failed to export chart: ' + error.message);
        }
    }

    /**
   * Get export status
   */
    getExportStatus(exportId) {
        try {
            const exportJob = this.exportJobs.get(exportId);

            if (!exportJob) {
                throw new Error(`Export ${exportId} not found`);
            }

            return {
                ...exportJob,
                retrievedAt: new Date()
            };
        } catch (error) {
            Sentry.captureException(error);
            throw new Error('Failed to get export status: ' + error.message);
        }
    }

    /**
   * Generate dashboard visualization
   */
    generateDashboardVisuals(dashboardConfig) {
        try {
            const visualizationId = `vis-${Date.now()}`;

            const visualization = {
                visualizationId,
                dashboardId: dashboardConfig.dashboardId,
                title: dashboardConfig.title || 'Dashboard',
                layout: dashboardConfig.layout || 'grid',
                charts: [],
                gridConfig: {
                    columns: dashboardConfig.columns || 12,
                    rowHeight: dashboardConfig.rowHeight || 300,
                    gap: dashboardConfig.gap || 20
                },
                refreshRate: dashboardConfig.refreshRate || 300,
                createdAt: new Date(),
                lastUpdated: new Date(),
                statistics: {
                    totalCharts: 0,
                    chartTypes: {},
                    totalDataPoints: 0
                }
            };

            // Add charts from dashboard configuration
            if (dashboardConfig.charts && Array.isArray(dashboardConfig.charts)) {
                dashboardConfig.charts.forEach(chartConfig => {
                    const chartId = `chart-${Date.now()}-${Math.random()}`;
                    visualization.charts.push({
                        chartId,
                        type: chartConfig.type,
                        title: chartConfig.title,
                        size: chartConfig.size || { width: 4, height: 3 },
                        position: chartConfig.position
                    });

                    visualization.statistics.chartTypes[chartConfig.type] =
            (visualization.statistics.chartTypes[chartConfig.type] || 0) + 1;
                });
            }

            visualization.statistics.totalCharts = visualization.charts.length;

            this.visualizations.set(visualizationId, visualization);

            this.recordEvent('dashboard_visualization_generated', {
                visualizationId,
                chartCount: visualization.charts.length
            });

            return visualization;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error('Failed to generate dashboard visualization: ' + error.message);
        }
    }

    /**
   * Helper: Get minimum value
   */
    getMinValue(values) {
        if (!values || values.length === 0) {return 0;}
        return Math.min(...values.filter(v => typeof v === 'number'));
    }

    /**
   * Helper: Get maximum value
   */
    getMaxValue(values) {
        if (!values || values.length === 0) {return 100;}
        return Math.max(...values.filter(v => typeof v === 'number'));
    }

    /**
   * Helper: Generate color palette
   */
    generateColorPalette(count) {
        const palettes = {
            default: [
                '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
                '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
            ],
            vibrant: [
                '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
                '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52C4A1'
            ],
            pastel: [
                '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
                '#D4BAFF', '#FFB3E6', '#D4D4FF', '#FFE4B5', '#C9FFF0'
            ]
        };

        const colorSet = palettes.default;
        const colors = [];

        for (let i = 0; i < count; i++) {
            colors.push(colorSet[i % colorSet.length]);
        }

        return colors;
    }

    /**
   * Helper: Transform data to series
   */
    transformDataToSeries(data) {
        if (!Array.isArray(data)) {return [];}

        return data.map((item, index) => ({
            name: item.name || `Series ${index + 1}`,
            data: item.data || item.values || [],
            type: item.type || 'line'
        }));
    }

    /**
   * Helper: Calculate scatter statistics
   */
    calculateScatterStatistics(data) {
        if (!data || data.length === 0) {
            return { correlation: 0, rSquared: 0 };
        }

        const xValues = data.map(d => d.x);
        const yValues = data.map(d => d.y);

        const n = data.length;
        const xMean = xValues.reduce((a, b) => a + b, 0) / n;
        const yMean = yValues.reduce((a, b) => a + b, 0) / n;

        let numerator = 0, denomX = 0, denomY = 0;

        for (let i = 0; i < n; i++) {
            const dx = xValues[i] - xMean;
            const dy = yValues[i] - yMean;
            numerator += dx * dy;
            denomX += dx * dx;
            denomY += dy * dy;
        }

        const correlation = numerator / Math.sqrt(denomX * denomY);
        const rSquared = correlation * correlation;

        return {
            correlation: parseFloat(correlation.toFixed(4)),
            rSquared: parseFloat(rSquared.toFixed(4)),
            dataPoints: n,
            trendStrength: Math.abs(correlation) > 0.7 ? 'strong' : 'weak'
        };
    }

    /**
   * Record event for logging
   */
    recordEvent(eventName, eventData) {
        console.log(`[DataVisualizationService] Event: ${eventName}`, eventData);
    }
}

module.exports = DataVisualizationService;
