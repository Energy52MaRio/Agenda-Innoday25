
import React from 'react';
import { SimulationParams } from '../types';

interface SimulationControlsProps {
    params: SimulationParams;
    setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
}

interface SliderInputProps {
    label: string;
    id: keyof SimulationParams;
    value: number;
    min: number;
    max: number;
    step: number;
    unit: string;
    params: SimulationParams;
    setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
}

const SliderInput: React.FC<SliderInputProps> = ({ label, id, value, min, max, step, unit, params, setParams }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setParams({ ...params, [id]: parseFloat(e.target.value) });
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-baseline">
                <label htmlFor={id} className="text-sm font-medium text-gray-300">{label}</label>
                <span className="text-sm font-mono bg-gray-700 text-cyan-300 px-2 py-0.5 rounded">{value.toLocaleString('de-DE')}{unit}</span>
            </div>
            <input
                id={id}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb:bg-cyan-400"
            />
        </div>
    );
};


const SimulationControls: React.FC<SimulationControlsProps> = ({ params, setParams }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setParams({ ...params, [id]: parseFloat(value) || 0 });
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-gray-600 pb-2">Simulations-Parameter</h2>
            
            <SliderInput label="Margen-Veränderung" id="margeProzent" value={params.margeProzent} min={-25} max={25} step={0.5} unit="%" params={params} setParams={setParams} />
            <SliderInput label="Fixkosten-Veränderung" id="fixkostenProzent" value={params.fixkostenProzent} min={-50} max={50} step={1} unit="%" params={params} setParams={setParams} />
            
            <div className="space-y-2">
                 <label htmlFor="neuinvestition" className="text-sm font-medium text-gray-300">Neuinvestition (€)</label>
                 <input type="number" id="neuinvestition" value={params.neuinvestition} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
            
            <div className="space-y-2">
                 <label htmlFor="neudarlehen" className="text-sm font-medium text-gray-300">Neudarlehen (€)</label>
                 <input type="number" id="neudarlehen" value={params.neudarlehen} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                     <label htmlFor="zinssatzDarlehenProzent" className="text-sm font-medium text-gray-300">Zinssatz (%)</label>
                     <input type="number" id="zinssatzDarlehenProzent" value={params.zinssatzDarlehenProzent} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div className="space-y-2">
                     <label htmlFor="nutzungsdauerInvestitionJahre" className="text-sm font-medium text-gray-300">ND Invest. (Jahre)</label>
                     <input type="number" id="nutzungsdauerInvestitionJahre" value={params.nutzungsdauerInvestitionJahre} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
            </div>
        </div>
    );
};

export default SimulationControls;
