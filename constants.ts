import { LabelConfig } from './types';

// Neue, detaillierte Reihenfolge und Bezeichnungen für die GuV
export const GUV_ORDER = [
    'umsatzerloese',
    'erloesschmaelerungen',
    'sonstigeBetrieblicheErtraege',
    'gesamtleistung',
    'materialaufwand',
    'deckungsbeitrag1',
    'personalkosten',
    'sonstigeBetrieblicheAufwendungen',
    'ebitda',
    'abschreibungen',
    'ebit',
    'finanzergebnis',
    'ebt',
    'steueraufwand',
    'jahresueberschuss',
];

export const GUV_LABELS: { [key: string]: LabelConfig } = {
    umsatzerloese: { label: 'Umsatzerlöse' },
    erloesschmaelerungen: { label: 'Erlösschmälerungen', indent: true },
    sonstigeBetrieblicheErtraege: { label: 'Sonstige betriebliche Erträge' },
    gesamtleistung: { label: 'Gesamtleistung', isTotal: true },
    materialaufwand: { label: 'Materialaufwand / Wareneinsatz', indent: true },
    deckungsbeitrag1: { label: 'Deckungsbeitrag I', isTotal: true },
    personalkosten: { label: 'Personalkosten', indent: true },
    sonstigeBetrieblicheAufwendungen: { label: 'Sonstige betriebliche Aufwendungen', indent: true },
    ebitda: { label: 'EBITDA', isTotal: true },
    abschreibungen: { label: 'Abschreibungen', indent: true },
    ebit: { label: 'EBIT', isTotal: true },
    finanzergebnis: { label: 'Finanzergebnis' },
    ebt: { label: 'Ergebnis vor Steuern (EBT)', isTotal: true },
    steueraufwand: { label: 'Steueraufwand (30%)', indent: true },
    jahresueberschuss: { label: 'Jahresüberschuss', isTotal: true },
};

// Neue, detaillierte Reihenfolge und Bezeichnungen für die Bilanz
export const BILANZ_ORDER = [
    // Aktiva
    'immaterielleVermoegenswerte',
    'sachanlagen',
    'finanzanlagen',
    'anlagevermoegen',
    'vorraete',
    'forderungenLuL',
    'sonstigeVermoegenswerte',
    'liquideMittel',
    'umlaufvermoegen',
    'bilanzsummeAktiva',
    // Passiva
    'gezeichnetesKapital',
    'kapitalruecklage',
    'gewinnruecklagen',
    'bilanzgewinn',
    'eigenkapital',
    'rueckstellungen',
    'verbindlichkeitenKreditinstitute',
    'verbindlichkeitenLuL',
    'sonstigeVerbindlichkeiten',
    'fremdkapital',
    'bilanzsummePassiva',
];

export const BILANZ_LABELS: { [key: string]: LabelConfig } = {
    // Aktiva
    immaterielleVermoegenswerte: { label: 'Immaterielle Vermögenswerte', indent: true },
    sachanlagen: { label: 'Sachanlagen', indent: true },
    finanzanlagen: { label: 'Finanzanlagen', indent: true },
    anlagevermoegen: { label: 'Anlagevermögen', isTotal: true },
    vorraete: { label: 'Vorräte', indent: true },
    forderungenLuL: { label: 'Forderungen aus L&L', indent: true },
    sonstigeVermoegenswerte: { label: 'Sonstige Vermögenswerte', indent: true },
    liquideMittel: { label: 'Liquide Mittel', indent: true },
    umlaufvermoegen: { label: 'Umlaufvermögen', isTotal: true },
    bilanzsummeAktiva: { label: 'Bilanzsumme (Aktiva)', isTotal: true },
    // Passiva
    gezeichnetesKapital: { label: 'Gezeichnetes Kapital', indent: true },
    kapitalruecklage: { label: 'Kapitalrücklage', indent: true },
    gewinnruecklagen: { label: 'Gewinnrücklagen', indent: true },
    bilanzgewinn: { label: 'Bilanzgewinn/-verlust', indent: true },
    eigenkapital: { label: 'Eigenkapital', isTotal: true },
    rueckstellungen: { label: 'Rückstellungen', indent: true },
    verbindlichkeitenKreditinstitute: { label: 'Verbindlichkeiten ggü. Kreditinstituten', indent: true },
    verbindlichkeitenLuL: { label: 'Verbindlichkeiten aus L&L', indent: true },
    sonstigeVerbindlichkeiten: { label: 'Sonstige Verbindlichkeiten', indent: true },
    fremdkapital: { label: 'Fremdkapital', isTotal: true },
    bilanzsummePassiva: { label: 'Bilanzsumme (Passiva)', isTotal: true },
};

// Reihenfolge und Bezeichnungen für die Cashflow-Rechnung
export const CASHFLOW_ORDER = [
    'cashflowOperativ',
    'cashflowInvestition',
    'cashflowFinanzierung',
    'nettoveraenderungLiquideMittel',
];

export const CASHFLOW_LABELS: { [key: string]: LabelConfig } = {
    cashflowOperativ: { label: 'Cashflow aus operativer Tätigkeit', isTotal: true },
    cashflowInvestition: { label: 'Cashflow aus Investitionstätigkeit', isTotal: true },
    cashflowFinanzierung: { label: 'Cashflow aus Finanzierungstätigkeit', isTotal: true },
    nettoveraenderungLiquideMittel: { label: 'Nettoveränderung der liquiden Mittel', isTotal: true },
};
