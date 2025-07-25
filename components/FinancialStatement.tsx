import React from 'react';
import { FinancialData, LabelConfig } from '../types';

type StatementKey = keyof Omit<FinancialData, 'year'>;
type Items = { [key: string]: number };

interface FinancialStatementProps {
    title: string;
    baseData: FinancialData[];
    projectedData: FinancialData | null;
    itemOrder: string[];
    labels: { [key: string]: LabelConfig };
    statementType: StatementKey;
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
};

const FinancialStatement: React.FC<FinancialStatementProps> = ({ title, baseData, projectedData, itemOrder, labels, statementType }) => {
    
    const calculateChange = (base: number, projected: number) => {
        if (base === 0 && projected !== 0) return { value: Infinity, isInfinite: true };
        if (base === 0) return { value: 0, isInfinite: false };
        return { value: ((projected - base) / Math.abs(base)) * 100, isInfinite: false };
    };
    
    const renderChange = (base: number, projected: number, key: string) => {
        const { value, isInfinite } = calculateChange(base, projected);

        if (isInfinite) {
            return <span className="text-cyan-400 font-bold">NEU</span>;
        }
        if (Math.abs(value) < 0.01) {
            return <span className="text-gray-500">-</span>;
        }

        const isCostItem = key.toLowerCase().includes('kosten') || key.toLowerCase().includes('aufwand') || key.toLowerCase().includes('schmälerung');
        const isDebtItem = key.toLowerCase().includes('verbindlichkeiten') || key.toLowerCase().includes('fremdkapital');
        const isNegativeGood = isCostItem || isDebtItem;

        let colorClass = 'text-gray-400';
        if ((value > 0 && !isNegativeGood) || (value < 0 && isNegativeGood)) {
            colorClass = 'text-green-400';
        } else {
            colorClass = 'text-red-400';
        }
        
        const sign = value > 0 ? '+' : '';
        return <span className={colorClass}>{sign}{value.toFixed(1)}%</span>;
    };
    
    const latestYearData = baseData[0] ? baseData[0][statementType] as Items : {};
    const projectedItems = projectedData ? projectedData[statementType] as Items : null;

    return (
        <div className="bg-gray-800/50 rounded-lg shadow-lg overflow-hidden">
            <h3 className="text-lg font-bold text-white p-4 border-b border-gray-700">{title}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-700/50 text-xs text-gray-300 uppercase tracking-wider">
                        <tr>
                            <th scope="col" className="px-6 py-3 sticky left-0 bg-gray-700/50 z-10">Position</th>
                            {baseData.map(data => (
                                <th scope="col" key={data.year} className="px-6 py-3 text-right">{data.year} (€)</th>
                            ))}
                            {projectedItems && <th scope="col" className="px-6 py-3 text-right bg-cyan-900/40">Planung {baseData[0].year + 1} (€)</th>}
                            {projectedItems && <th scope="col" className="px-6 py-3 text-right bg-cyan-900/40">Veränd. (%)</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {itemOrder.map((key) => {
                            const { label, indent, isTotal } = labels[key] || { label: key };
                            const labelClass = indent ? 'pl-10' : 'pl-6';
                            const rowClass = isTotal ? 'bg-gray-700/30 font-bold' : '';

                            return (
                                <tr key={key} className={`hover:bg-gray-700/50 transition-colors ${rowClass}`}>
                                    <td className={`px-6 py-3 font-medium text-gray-200 whitespace-nowrap sticky left-0 bg-gray-800/80 z-10 ${rowClass ? 'bg-gray-700/60' : ''} ${labelClass}`}>{label}</td>
                                    
                                    {baseData.map(data => {
                                      const items = data[statementType] as Items;
                                      const value = items[key] ?? 0;
                                      return (
                                        <td key={`${data.year}-${key}`} className="px-6 py-3 text-right font-mono text-gray-300">{formatNumber(value)}</td>
                                      )
                                    })}

                                    {projectedItems && (
                                        <>
                                            <td className="px-6 py-3 text-right font-mono text-white bg-gray-700/20">{formatNumber(projectedItems[key] ?? 0)}</td>
                                            <td className="px-6 py-3 text-right font-mono bg-gray-700/20">{renderChange(latestYearData[key] ?? 0, projectedItems[key] ?? 0, key)}</td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinancialStatement;
