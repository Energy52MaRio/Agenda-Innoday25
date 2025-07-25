import React, { useState, useCallback } from 'react';
import { AppState, FinancialData, SimulationParams } from './types';
import { extractFinancialsFromImage } from './services/geminiService';
import { useFinancialModel } from './hooks/useFinancialModel';
import ImageUploader from './components/ImageUploader';
import SimulationControls from './components/SimulationControls';
import FinancialStatement from './components/FinancialStatement';
import { LogoIcon } from './components/icons';
import { GUV_ORDER, BILANZ_ORDER, CASHFLOW_ORDER, GUV_LABELS, BILANZ_LABELS, CASHFLOW_LABELS } from './constants';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [baseFinancials, setBaseFinancials] = useState<FinancialData[] | null>(null);
    const [simulationParams, setSimulationParams] = useState<SimulationParams>({
        margeProzent: 0,
        fixkostenProzent: 0,
        neuinvestition: 0,
        neudarlehen: 0,
        zinssatzDarlehenProzent: 5,
        nutzungsdauerInvestitionJahre: 8,
    });

    // The simulation is always based on the latest year's data.
    const latestYearData = baseFinancials ? baseFinancials[0] : null;
    const projectedFinancials = useFinancialModel(latestYearData, simulationParams);

    const handleImageUpload = useCallback(async (base64Image: string) => {
        setAppState('processing');
        setError(null);
        try {
            const data = await extractFinancialsFromImage(base64Image);
            // Sort data by year, descending, to ensure the latest year is always first.
            const sortedData = data.sort((a, b) => b.year - a.year);
            setBaseFinancials(sortedData);
            setAppState('ready');
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten.';
            setError(`Fehler bei der Datenextraktion: ${errorMessage}. Bitte versuchen Sie es mit einem klareren Bild erneut.`);
            setAppState('error');
        }
    }, []);
    
    const handleReset = () => {
        setAppState('idle');
        setBaseFinancials(null);
        setError(null);
        setSimulationParams({
            margeProzent: 0,
            fixkostenProzent: 0,
            neuinvestition: 0,
            neudarlehen: 0,
            zinssatzDarlehenProzent: 5,
            nutzungsdauerInvestitionJahre: 8,
        });
    };

    const renderContent = () => {
        switch (appState) {
            case 'idle':
            case 'processing':
            case 'error':
                return <ImageUploader onImageUpload={handleImageUpload} isLoading={appState === 'processing'} error={error} />;
            case 'ready':
                if (!baseFinancials) return null;
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full">
                        <div className="lg:col-span-1 xl:col-span-1 bg-gray-800/50 rounded-lg p-6 self-start top-6 sticky">
                           <SimulationControls params={simulationParams} setParams={setSimulationParams} />
                        </div>
                        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
                            <FinancialStatement title="Gewinn- und Verlustrechnung (GuV)" baseData={baseFinancials} projectedData={projectedFinancials} itemOrder={GUV_ORDER} labels={GUV_LABELS} statementType="incomeStatement" />
                            <FinancialStatement title="Bilanz" baseData={baseFinancials} projectedData={projectedFinancials} itemOrder={BILANZ_ORDER} labels={BILANZ_LABELS} statementType="balanceSheet" />
                            <FinancialStatement title="Cashflow-Rechnung" baseData={baseFinancials} projectedData={projectedFinancials} itemOrder={CASHFLOW_ORDER} labels={CASHFLOW_LABELS} statementType="cashFlow" />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto">
                <header className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <LogoIcon className="h-10 w-10 text-cyan-400" />
                        <div>
                           <h1 className="text-2xl font-bold text-white tracking-tight">Integra-Plan</h1>
                           <p className="text-sm text-gray-400">KI-gestützter Finanz-Simulator</p>
                        </div>
                    </div>
                     {appState === 'ready' && (
                        <button
                            onClick={handleReset}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Neu starten
                        </button>
                    )}
                </header>
                <main className="h-full">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default App;
