import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportAPI } from '../services/apiService';
import { Card, Button, Loading, ErrorMessage, SuccessMessage } from '../components/UI';
import '../styles/Reports.css';
import { formatters } from '../utils/helpers';
import jsPDF from 'jspdf';

const ReportsPage = () => {
    const { user } = useAuth();
    const [report, setReport] = useState(null);
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [reportType, setReportType] = useState('daily');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [energyRate, setEnergyRate] = useState(0);
    const [shareMenuOpen, setShareMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const queryDate = params.get('date');
        const queryReportType = params.get('reportType') || params.get('period');

        if (queryDate) {
            setSelectedDate(queryDate);
        }
        if (queryReportType) {
            setReportType(queryReportType);
        }
    }, [location.search]);

    useEffect(() => {
        if (user?.userId) {
            loadReport();
        } else {
            setLoading(false);
            setError('Please sign in to view reports.');
        }
    }, [reportType, selectedDate, user]);

    const loadReport = async () => {
        if (!user?.userId) {
            setError('Please sign in to view reports.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');
        try {
            let reportData;
            if (reportType === 'daily') {
                reportData = await reportAPI.getDailyReport(user.userId, selectedDate);
            } else if (reportType === 'monthly') {
                const [year, month] = selectedDate.split('-');
                reportData = await reportAPI.getMonthlyReport(user.userId, year, month);
            } else if (reportType === 'yearly') {
                const year = selectedDate.split('-')[0];
                reportData = await reportAPI.getYearlyReport(user.userId, year);
            }
            setReport(reportData);

            // Load insights
            const insightsData = await reportAPI.getInsights(user.userId);
            setInsights(insightsData);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load report');
        } finally {
            setLoading(false);
        }
    };

    const getReportFilename = () => {
        const dateStamp = report?.date || selectedDate || new Date().toISOString().split('T')[0];
        return `energy-report-${reportType}-${dateStamp}`.replace(/\s+/g, '-').replace(/[:]/g, '-');
    };

    const getDisplayCost = () => {
        if (!report) return 0;
        const consumption = parseFloat(report.summary?.totalConsumption) || 0;
        const rate = parseFloat(energyRate);
        if (!Number.isNaN(rate) && rate > 0) {
            return consumption * rate;
        }
        return parseFloat(report.summary?.totalCost) || 0;
    };

    const buildReportText = () => {
        if (!report) return '';

        const lines = [];
        lines.push(`${report.summary?.reportType || 'Energy Report'}`);
        lines.push(`Date: ${report.date || selectedDate}`);
        lines.push('');
        lines.push(`Total Consumption: ${formatters.formatEnergy(report.summary?.totalConsumption || 0)}`);
        lines.push(`Rate: ₱${parseFloat(energyRate || 0).toFixed(2)} / kWh`);
        lines.push(`Total Cost: ${formatters.formatCurrency(getDisplayCost(), '₱')}`);
        lines.push(`Average: ${formatters.formatEnergy(report.summary?.averageDailyConsumption || 0)}`);
        lines.push('');

        if (report.dailyBreakdown) {
            lines.push('Daily Breakdown:');
            lines.push('Date,Consumption,Cost');
            Object.entries(report.dailyBreakdown).forEach(([date, data]) => {
                lines.push(`${date},${data.consumption || 0},${data.cost || 0}`);
            });
            lines.push('');
        }

        if (report.monthlyBreakdown) {
            lines.push('Monthly Breakdown:');
            lines.push('Month,Consumption,Cost');
            Object.entries(report.monthlyBreakdown).forEach(([month, data]) => {
                lines.push(`${month},${data.consumption || 0},${data.cost || 0}`);
            });
            lines.push('');
        }

        return lines.join('\n');
    };

    const buildReportCSV = () => {
        if (!report) return '';

        const csvRows = [];
        const addRow = (row) => csvRows.push(row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','));

        addRow(['Report Type', report.summary?.reportType || 'Energy Report']);
        addRow(['Date', report.date || selectedDate]);
        addRow(['Total Consumption', report.summary?.totalConsumption || 0]);
        addRow(['Rate', parseFloat(energyRate || 0).toFixed(2)]);
        addRow(['Total Cost', getDisplayCost()]);
        addRow(['Average', report.summary?.averageDailyConsumption || 0]);
        addRow([]);

        if (report.dailyBreakdown) {
            addRow(['Daily Breakdown']);
            addRow(['Date', 'Consumption', 'Cost']);
            Object.entries(report.dailyBreakdown).forEach(([date, data]) => {
                addRow([date, data.consumption || 0, data.cost || 0]);
            });
            addRow([]);
        }

        if (report.monthlyBreakdown) {
            addRow(['Monthly Breakdown']);
            addRow(['Month', 'Consumption', 'Cost']);
            Object.entries(report.monthlyBreakdown).forEach(([month, data]) => {
                addRow([month, data.consumption || 0, data.cost || 0]);
            });
            addRow([]);
        }

        return csvRows.join('\r\n');
    };

    const downloadBlob = (content, filename, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDownloadPDF = () => {
        if (!report) return;

        const doc = new jsPDF();
        const lines = [];
        lines.push(`${report.summary?.reportType || 'Energy Report'}`);
        lines.push(`Date: ${report.date || selectedDate}`);
        lines.push('');
        lines.push(`Total Consumption: ${formatters.formatEnergy(report.summary?.totalConsumption || 0)}`);
        lines.push(`Energy Rate: ₱${parseFloat(energyRate || 0).toFixed(2)} / kWh`);
        lines.push(`Total Cost: ${formatters.formatCurrency(getDisplayCost(), '₱')}`);
        lines.push(`Average Daily Consumption: ${formatters.formatEnergy(report.summary?.averageDailyConsumption || 0)}`);
        lines.push('');

        if (report.dailyBreakdown) {
            lines.push('Daily Breakdown:');
            Object.entries(report.dailyBreakdown).forEach(([date, data]) => {
                lines.push(`${date}: ${formatters.formatEnergy(data.consumption || 0)} kWh, ₱${data.cost || 0}`);
            });
            lines.push('');
        }

        if (report.monthlyBreakdown) {
            lines.push('Monthly Breakdown:');
            Object.entries(report.monthlyBreakdown).forEach(([month, data]) => {
                lines.push(`${month}: ${formatters.formatEnergy(data.consumption || 0)} kWh, ₱${data.cost || 0}`);
            });
            lines.push('');
        }

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        let y = 20;
        doc.setFontSize(14);
        doc.text(report.summary?.reportType || 'Energy Report', margin, y);
        doc.setFontSize(10);
        y += 10;

        lines.forEach((line) => {
            if (y > doc.internal.pageSize.getHeight() - 20) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, margin, y);
            y += 7;
        });

        doc.save(`${getReportFilename()}.pdf`);
    };

    const handleDownloadCSV = () => {
        if (!report) return;
        const csv = buildReportCSV();
        downloadBlob(csv, `${getReportFilename()}.csv`, 'text/csv;charset=utf-8;');
    };

    const shareText = buildReportText();
    const reportTitle = `${report?.summary?.reportType || 'Energy Report'} - ${selectedDate}`;
    const encodedText = encodeURIComponent(shareText);
    const encodedTitle = encodeURIComponent(reportTitle);
    const reportUrl = window.location.href;
    const encodedUrl = encodeURIComponent(reportUrl);

    const shareToEmail = () => {
        const subject = encodeURIComponent(`Smart Energy Report - ${selectedDate}`);
        const body = encodeURIComponent(`\nEnergy Report\n\n${shareText}\n\nGenerated on: ${new Date().toLocaleString()}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        setShareMenuOpen(false);
    };

    const shareToTwitter = () => {
        const text = encodeURIComponent(`Check out my energy consumption report! Total: ${report.summary?.totalConsumption || 0} kWh. Using Smart Energy Monitoring System 📊⚡`);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`, 'twitter-share', 'width=550,height=420');
        setShareMenuOpen(false);
    };

    const shareToFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, 'facebook-share', 'width=550,height=420');
        setShareMenuOpen(false);
    };

    const shareToLinkedIn = () => {
        const title = encodeURIComponent('Smart Energy Consumption Report');
        const summary = encodeURIComponent(`Total Consumption: ${report.summary?.totalConsumption || 0} kWh`);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${title}&summary=${summary}`, 'linkedin-share', 'width=550,height=420');
        setShareMenuOpen(false);
    };

    const shareToWhatsApp = () => {
        const message = encodeURIComponent(`📊 Energy Report\n\nTotal Consumption: ${report.summary?.totalConsumption || 0} kWh\nTotal Cost: ₱${getDisplayCost().toFixed(2)}\nAverage: ${report.summary?.averageDailyConsumption || 0} kWh\n\nDate: ${selectedDate}`);
        window.open(`https://wa.me/?text=${message}`, '_blank');
        setShareMenuOpen(false);
    };

    const shareToTelegram = () => {
        const message = encodeURIComponent(`📊 Energy Report\n\n⚡ Total Consumption: ${report.summary?.totalConsumption || 0} kWh\n💰 Total Cost: ₱${getDisplayCost().toFixed(2)}\n📈 Average: ${report.summary?.averageDailyConsumption || 0} kWh\n📅 Date: ${selectedDate}`);
        window.open(`https://t.me/share/url?url=${encodedUrl}&text=${message}`, '_blank');
        setShareMenuOpen(false);
    };

    const shareToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareText);
            setSuccess('Report copied to clipboard!');
            setError('');
            setShareMenuOpen(false);
        } catch (err) {
            setError('Failed to copy to clipboard');
        }
    };

    const handleShareReport = async () => {
        if (!report) return;

        // Try native share API first
        if (navigator.share) {
            try {
                await navigator.share({
                    title: reportTitle,
                    text: shareText,
                    url: reportUrl
                });
                setError('');
                setSuccess('Report shared successfully.');
                return;
            } catch (err) {
                if (err.name !== 'AbortError') {
                    // User closed the share dialog, show menu instead
                    setShareMenuOpen(!shareMenuOpen);
                }
            }
        } else {
            // Open share menu if native share not available
            setShareMenuOpen(!shareMenuOpen);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="reports-page">
            <h1>Energy Reports & Analytics</h1>

            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}

            <div className="report-controls">
                <div>
                    <label>Report Type:</label>
                    <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                        <option value="daily">Daily Report</option>
                        <option value="monthly">Monthly Report</option>
                        <option value="yearly">Yearly Report</option>
                    </select>
                </div>

                <div>
                    <label>Date:</label>
                    <input 
                        type={reportType === 'yearly' ? 'text' : reportType === 'monthly' ? 'month' : 'date'}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        placeholder={reportType === 'yearly' ? 'YYYY' : ''}
                    />
                </div>

                <div>
                    <label>Rate (₱/kWh):</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={energyRate}
                        onChange={(e) => setEnergyRate(e.target.value)}
                    />
                </div>
            </div>

            {report && (
                <div className="report-container">
                    <Card className="report-header">
                        <h2>{report.summary?.reportType || 'Report'}</h2>
                        <p>{report.date || formatters.formatDate(new Date())}</p>
                    </Card>

                    <div className="report-summary">
                        <Card>
                            <h3>Total Consumption</h3>
                            <p className="summary-value">
                                {formatters.formatEnergy(report.summary?.totalConsumption || 0)}
                            </p>
                        </Card>
                        <Card>
                            <h3>Total Cost</h3>
                            <p className="summary-value">
                                {formatters.formatCurrency(getDisplayCost(), '₱')}
                            </p>
                        </Card>
                        <Card>
                            <h3>Average</h3>
                            <p className="summary-value">
                                {formatters.formatEnergy(report.summary?.averageDailyConsumption || 0)}
                            </p>
                        </Card>
                    </div>

                    {report.dailyBreakdown && (
                        <Card className="breakdown">
                            <h3>Daily Breakdown</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Consumption (kWh)</th>
                                        <th>Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(report.dailyBreakdown).map(([date, data]) => (
                                        <tr key={date}>
                                            <td>{formatters.formatDate(date)}</td>
                                            <td>{formatters.formatEnergy(data.consumption)}</td>
                                            <td>{formatters.formatCurrency(data.cost)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    )}
                </div>
            )}

            {insights && (
                <Card className="insights-card">
                    <h2>Smart Insights</h2>
                    <div className="insights-content">
                        <div className="insight-item">
                            <strong>Period:</strong> {insights.period}
                        </div>
                        <div className="insight-item">
                            <strong>Total Consumption:</strong> {formatters.formatEnergy(insights.totalConsumption)}
                        </div>
                        <div className="insight-item">
                            <strong>Daily Average:</strong> {formatters.formatEnergy(insights.averageDaily)}
                        </div>
                        <div className="insight-item">
                            <strong>Peak Hour:</strong> {insights.peakHour}:00
                        </div>

                        <h3>Recommendations</h3>
                        <ul className="recommendations">
                            {insights.recommendations?.map((rec, idx) => (
                                <li key={idx}>💡 {rec}</li>
                            ))}
                        </ul>
                    </div>
                </Card>
            )}

            <div className="report-actions">
                <Button variant="primary" onClick={handleDownloadPDF}>Download PDF</Button>
                <Button variant="primary" onClick={handleDownloadCSV}>Download CSV</Button>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Button variant="primary" onClick={handleShareReport}>
                         Share Report
                    </Button>
                    {shareMenuOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            zIndex: 1000,
                            minWidth: '200px',
                            marginTop: '8px'
                        }}>
                            <div style={{ padding: '12px' }}>
                                <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', color: '#2c3e50', fontSize: '14px' }}>
                                    Share via:
                                </p>
                                <button onClick={shareToEmail} style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '8px',
                                    backgroundColor: '#f0f0f0',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '14px',
                                    transition: 'background 0.2s'
                                }} onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'} onMouseOut={(e) => e.target.style.backgroundColor = '#f0f0f0'}>
                                    📧 Email
                                </button>
                                <button onClick={shareToTwitter} style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '8px',
                                    backgroundColor: '#f0f0f0',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '14px'
                                }} onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'} onMouseOut={(e) => e.target.style.backgroundColor = '#f0f0f0'}>
                                    𝕏 Twitter
                                </button>
                                <button onClick={shareToFacebook} style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '8px',
                                    backgroundColor: '#f0f0f0',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '14px'
                                }} onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'} onMouseOut={(e) => e.target.style.backgroundColor = '#f0f0f0'}>
                                    👥 Facebook
                                </button>
                                <button onClick={shareToLinkedIn} style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '8px',
                                    backgroundColor: '#f0f0f0',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '14px'
                                }} onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'} onMouseOut={(e) => e.target.style.backgroundColor = '#f0f0f0'}>
                                    💼 LinkedIn
                                </button>
                                <button onClick={shareToWhatsApp} style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '8px',
                                    backgroundColor: '#f0f0f0',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '14px'
                                }} onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'} onMouseOut={(e) => e.target.style.backgroundColor = '#f0f0f0'}>
                                    💬 WhatsApp
                                </button>
                                <button onClick={shareToTelegram} style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '8px',
                                    backgroundColor: '#f0f0f0',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '14px'
                                }} onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'} onMouseOut={(e) => e.target.style.backgroundColor = '#f0f0f0'}>
                                    ✈️ Telegram
                                </button>
                                <button onClick={shareToClipboard} style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#f0f0f0',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '14px'
                                }} onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'} onMouseOut={(e) => e.target.style.backgroundColor = '#f0f0f0'}>
                                    📋 Copy to Clipboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
