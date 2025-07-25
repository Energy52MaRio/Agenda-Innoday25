import { useMemo } from 'react';
import { FinancialData, SimulationParams } from '../types';

export const useFinancialModel = (
    baseData: FinancialData | null,
    params: SimulationParams
): FinancialData | null => {
    return useMemo(() => {
        if (!baseData) {
            return null;
        }

        // --- GuV / P&L Calculation ---
        const p = { ...params };
        const baseIS = baseData.incomeStatement;
        const projectedIS = { ...baseIS };
        
        projectedIS.umsatzerloese = baseIS.umsatzerloese;
        projectedIS.erloesschmaelerungen = baseIS.erloesschmaelerungen;
        projectedIS.sonstigeBetrieblicheErtraege = baseIS.sonstigeBetrieblicheErtraege;
        projectedIS.gesamtleistung = projectedIS.umsatzerloese - projectedIS.erloesschmaelerungen + projectedIS.sonstigeBetrieblicheErtraege;
        
        // Apply margin change to material costs
        projectedIS.materialaufwand = baseIS.materialaufwand * (1 - p.margeProzent / 100);
        projectedIS.deckungsbeitrag1 = projectedIS.gesamtleistung - projectedIS.materialaufwand;
        
        // Apply change to fixed costs (personnel and other)
        const fixkostenFaktor = 1 + p.fixkostenProzent / 100;
        projectedIS.personalkosten = baseIS.personalkosten * fixkostenFaktor;
        projectedIS.sonstigeBetrieblicheAufwendungen = baseIS.sonstigeBetrieblicheAufwendungen * fixkostenFaktor;
        
        projectedIS.ebitda = projectedIS.deckungsbeitrag1 - projectedIS.personalkosten - projectedIS.sonstigeBetrieblicheAufwendungen;
        
        // New depreciation from investment
        const zusaetzlicheAbschreibung = p.nutzungsdauerInvestitionJahre > 0 ? p.neuinvestition / p.nutzungsdauerInvestitionJahre : 0;
        projectedIS.abschreibungen = baseIS.abschreibungen + zusaetzlicheAbschreibung;
        projectedIS.ebit = projectedIS.ebitda - projectedIS.abschreibungen;
        
        // New interest from loan
        const zusaetzlicheZinsen = p.neudarlehen * (p.zinssatzDarlehenProzent / 100);
        projectedIS.finanzergebnis = baseIS.finanzergebnis - zusaetzlicheZinsen; // Interest expense is negative
        
        projectedIS.ebt = projectedIS.ebit + projectedIS.finanzergebnis;
        projectedIS.steueraufwand = projectedIS.ebt > 0 ? projectedIS.ebt * 0.30 : 0; // Simplified 30% tax rate
        projectedIS.jahresueberschuss = projectedIS.ebt - projectedIS.steueraufwand;

        // --- Cash Flow Calculation ---
        const projectedCF = { ...baseData.cashFlow };
        
        // CFO: Start with Net Income, add back depreciation (simplified)
        projectedCF.cashflowOperativ = projectedIS.jahresueberschuss + projectedIS.abschreibungen;
        // CFI: New investment is a cash out
        projectedCF.cashflowInvestition = baseData.cashFlow.cashflowInvestition - p.neuinvestition;
        // CFF: New loan is a cash in
        projectedCF.cashflowFinanzierung = baseData.cashFlow.cashflowFinanzierung + p.neudarlehen;

        projectedCF.nettoveraenderungLiquideMittel = projectedCF.cashflowOperativ + projectedCF.cashflowInvestition + projectedCF.cashflowFinanzierung;

        // --- Balance Sheet Calculation ---
        const baseBS = baseData.balanceSheet;
        const projectedBS = { ...baseBS };

        // Assets Side
        projectedBS.sachanlagen = baseBS.sachanlagen + p.neuinvestition - zusaetzlicheAbschreibung;
        projectedBS.anlagevermoegen = projectedBS.immaterielleVermoegenswerte + projectedBS.sachanlagen + projectedBS.finanzanlagen;
        
        const veraenderungLiquideMittel = projectedCF.nettoveraenderungLiquideMittel - baseData.cashFlow.nettoveraenderungLiquideMittel;
        projectedBS.liquideMittel = baseBS.liquideMittel + veraenderungLiquideMittel;
        
        projectedBS.umlaufvermoegen = projectedBS.vorraete + projectedBS.forderungenLuL + projectedBS.sonstigeVermoegenswerte + projectedBS.liquideMittel;
        projectedBS.bilanzsummeAktiva = projectedBS.anlagevermoegen + projectedBS.umlaufvermoegen;

        // Liabilities & Equity Side
        projectedBS.bilanzgewinn = baseBS.bilanzgewinn + projectedIS.jahresueberschuss; // Simplified: change in equity = net income
        projectedBS.eigenkapital = baseBS.gezeichnetesKapital + baseBS.kapitalruecklage + baseBS.gewinnruecklagen + projectedBS.bilanzgewinn;
        
        // Assume new loan is long-term (kreditinstitute)
        projectedBS.verbindlichkeitenKreditinstitute = baseBS.verbindlichkeitenKreditinstitute + p.neudarlehen;
        
        // Balance sheet balancing plug -> sonstige Verbindlichkeiten
        const passivSummeOhnePlug = projectedBS.eigenkapital + projectedBS.rueckstellungen + projectedBS.verbindlichkeitenKreditinstitute + projectedBS.verbindlichkeitenLuL + baseBS.sonstigeVerbindlichkeiten;
        const bilanzDifferenz = projectedBS.bilanzsummeAktiva - passivSummeOhnePlug;
        projectedBS.sonstigeVerbindlichkeiten = baseBS.sonstigeVerbindlichkeiten + bilanzDifferenz;

        projectedBS.fremdkapital = projectedBS.rueckstellungen + projectedBS.verbindlichkeitenKreditinstitute + projectedBS.verbindlichkeitenLuL + projectedBS.sonstigeVerbindlichkeiten;
        projectedBS.bilanzsummePassiva = projectedBS.eigenkapital + projectedBS.fremdkapital;

        return {
            year: baseData.year + 1, // The projected year is the next year
            incomeStatement: projectedIS,
            balanceSheet: projectedBS,
            cashFlow: projectedCF,
        };
    }, [baseData, params]);
};
