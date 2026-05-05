// Utility functions for calculations
export const calculateConsumption = (voltage, current, powerFactor, time) => {
    // P = V × I × PF (in kilowatts)
    const power = (voltage * current * (powerFactor || 1)) / 1000;
    // Energy = Power × Time (in kWh)
    return power * time;
};

export const calculateCost = (consumption, costPerKWh) => {
    return consumption * costPerKWh;
};

export const calculateAverageDailyConsumption = (consumptions) => {
    if (!consumptions.length) return 0;
    const total = consumptions.reduce((sum, item) => sum + item.consumption, 0);
    return total / consumptions.length;
};

export const calculateMonthlyConsumption = (consumptions) => {
    return consumptions.reduce((sum, item) => sum + item.consumption, 0);
};

export const calculateMonthlyCost = (monthlyConsumption, costPerKWh) => {
    return (monthlyConsumption * costPerKWh).toFixed(2);
};

export const calculateConsumptionTrend = (currentPeriod, previousPeriod) => {
    if (previousPeriod === 0) return 0;
    return (((currentPeriod - previousPeriod) / previousPeriod) * 100).toFixed(2);
};

export const convertToWatts = (kilowatts) => {
    return kilowatts * 1000;
};

export const convertToKilowatts = (watts) => {
    return watts / 1000;
};

export const estimateRemainingBudget = (budgetLimit, consumedAmount) => {
    const remaining = budgetLimit - consumedAmount;
    return Math.max(0, remaining);
};

export const calculateBudgetPercentage = (consumedAmount, budgetLimit) => {
    if (budgetLimit === 0) return 0;
    return ((consumedAmount / budgetLimit) * 100).toFixed(1);
};

export const getDayOfWeek = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
};

export const getMonthName = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[new Date(date).getMonth()];
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

export const getDatesRange = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= new Date(endDate)) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
};

export const getLastNMonths = (months) => {
    const result = [];
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        result.push({
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            label: getMonthName(date)
        });
    }
    return result;
};

export const calculatePeakHours = (consumptions) => {
    if (!consumptions.length) return null;
    return consumptions.reduce((max, item) => 
        item.consumption > max.consumption ? item : max
    );
};

export const calculateOffPeakHours = (consumptions) => {
    if (!consumptions.length) return null;
    return consumptions.reduce((min, item) => 
        item.consumption < min.consumption ? item : min
    );
};

export const generateReportPeriod = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        daysIncluded: diffDays
    };
};
