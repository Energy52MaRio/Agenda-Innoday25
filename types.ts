export type AppState = 'idle' | 'processing' | 'ready' | 'error';

// Detaillierte GuV-Struktur
export interface IncomeStatement {
    year: number;
    umsatzerloese: number;
    erloesschmaelerungen: number;
    sonstigeBetrieblicheErtraege: number;
    gesamtleistung: number;
    materialaufwand: number;
    deckungsbeitrag1: number;
    personalkosten: number;
    sonstigeBetrieblicheAufwendungen: number;
    ebitda: number;
    abschreibungen: number;
    ebit: number;
    finanzergebnis: number;
    ebt: number;
    steueraufwand: number;
    jahresueberschuss: number;
}

// Detaillierte Bilanz-Struktur
export interface BalanceSheet {
    year: number;
    // Aktiva
    immaterielleVermoegenswerte: number;
    sachanlagen: number;
    finanzanlagen: number;
    anlagevermoegen: number;
    vorraete: number;
    forderungenLuL: number;
    sonstigeVermoegenswerte: number;
    liquideMittel: number;
    umlaufvermoegen: number;
    bilanzsummeAktiva: number;
    // Passiva
    gezeichnetesKapital: number;
    kapitalruecklage: number;
    gewinnruecklagen: number;
    bilanzgewinn: number;
    eigenkapital: number;
    rueckstellungen: number;
    verbindlichkeitenKreditinstitute: number;
    verbindlichkeitenLuL: number;
    sonstigeVerbindlichkeiten: number;
    fremdkapital: number;
    bilanzsummePassiva: number;
}

// Angepasste Cashflow-Struktur
export interface CashFlowStatement {
    year: number;
    cashflowOperativ: number;
    cashflowInvestition: number;
    cashflowFinanzierung: number;
    nettoveraenderungLiquideMittel: number;
}

export interface FinancialData {
    year: number;
    incomeStatement: Omit<IncomeStatement, 'year'>;
    balanceSheet: Omit<BalanceSheet, 'year'>;
    cashFlow: Omit<CashFlowStatement, 'year'>;
}

export interface SimulationParams {
    margeProzent: number; // Marge improvement in % on material costs
    fixkostenProzent: number; // Fixed cost change in % on personnel and other operating expenses
    neuinvestition: number; // New investment in currency
    neudarlehen: number; // New loan in currency
    zinssatzDarlehenProzent: number; // Interest rate for new loan
    nutzungsdauerInvestitionJahre: number; // Useful life for new investment
}

export interface LabelConfig {
  label: string;
  indent?: boolean;
  isTotal?: boolean;
}
