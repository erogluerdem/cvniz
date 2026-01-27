import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#06b6d4', '#8b5cf6', '#ef4444', '#f59e0b']; // Cyan, Purple, Red, Amber

const DeviceChart = ({ data }) => {
    // Data expected: { desktop: 10, mobile: 5, other: 2 } or array

    // Transform to array if object
    const chartData = Array.isArray(data) ? data : [
        { name: 'Masaüstü', value: data.desktop || 0 },
        { name: 'Mobil', value: data.mobile || 0 },
        { name: 'Diğer', value: data.other || 0 }
    ].filter(i => i.value > 0);

    if (chartData.length === 0) {
        return <div className="text-center text-gray-400 py-10">Veri yok</div>
    }

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DeviceChart;
