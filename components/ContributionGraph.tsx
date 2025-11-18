
import React from 'react';

const ContributionGraph: React.FC = () => {
    const weeks = 52;
    const days = 7;
    const totalDays = weeks * days;
    const colors = ['bg-gray-800', 'bg-green-900', 'bg-green-700', 'bg-green-500', 'bg-green-300'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const contributions = Array.from({ length: totalDays }, () => {
        const random = Math.random();
        if (random < 0.3) return 0; // 30% chance of no contribution
        if (random < 0.7) return 1; // 40% chance of level 1
        if (random < 0.9) return 2; // 20% chance of level 2
        if (random < 0.98) return 3; // 8% chance of level 3
        return 4; // 2% chance of level 4
    });

    return (
        <div className="border border-gray-700 rounded-md p-4">
            <h2 className="text-lg font-semibold mb-4 text-white">Contribution Activity (Simulated)</h2>
            <div className="flex text-xs text-gray-400" style={{ marginLeft: '24px' }}>
                {months.map((month, index) => (
                    <div key={month} style={{ minWidth: (14 * 4.3) + 'px' }} className="text-center">{month}</div>
                ))}
            </div>
            <div className="flex">
                <div className="flex flex-col text-xs text-gray-400 pr-2">
                    <div className="h-3.5 mt-3.5">Mon</div>
                    <div className="h-3.5 mt-1.5"></div>
                    <div className="h-3.5 mt-1.5">Wed</div>
                    <div className="h-3.5 mt-1.5"></div>
                    <div className="h-3.5 mt-1.5">Fri</div>
                </div>
                <div className="grid grid-flow-col grid-rows-7 gap-1">
                    {contributions.map((level, index) => (
                        <div
                            key={index}
                            className={`w-3.5 h-3.5 rounded-sm ${colors[level]}`}
                            title={`Contribution level ${level} on day ${index}`}
                        />
                    ))}
                </div>
            </div>
            <div className="flex justify-end items-center text-xs text-gray-400 mt-2">
                Less
                {colors.map((color, index) => (
                    <div key={index} className={`w-3 h-3 rounded-sm ml-1 ${color}`} />
                ))}
                More
            </div>
        </div>
    );
};

export default ContributionGraph;
