import './MetricCard.css';

const MetricCard = ({ icon, title, value, change, changeType = 'neutral' }) => {
    const getChangeColor = () => {
        if (changeType === 'positive') return '#10b981';
        if (changeType === 'negative') return '#ef4444';
        return '#6b7280';
    };

    const getChangeIcon = () => {
        if (changeType === 'positive') return '↑';
        if (changeType === 'negative') return '↓';
        return '→';
    };

    return (
        <div className="metric-card">
            <div className="metric-card-header">
                <div className="metric-icon">{icon}</div>
                <span className="metric-title">{title}</span>
            </div>
            <div className="metric-value">{value}</div>
            {change !== undefined && (
                <div className="metric-change" style={{ color: getChangeColor() }}>
                    <span className="change-icon">{getChangeIcon()}</span>
                    <span className="change-value">{change}</span>
                </div>
            )}
        </div>
    );
};

export default MetricCard;
