import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { FinancialData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const financialDataSchema = {
    type: Type.OBJECT,
    properties: {
        year: { type: Type.NUMBER, description: "Das Geschäftsjahr, auf das sich die Daten beziehen (z.B. 2023)" },
        incomeStatement: {
            type: Type.OBJECT,
            description: "Gewinn- und Verlustrechnung",
            properties: {
                umsatzerloese: { type: Type.NUMBER },
                erloesschmaelerungen: { type: Type.NUMBER },
                sonstigeBetrieblicheErtraege: { type: Type.NUMBER },
                gesamtleistung: { type: Type.NUMBER, description: "Berechne als umsatzerloese - erloesschmaelerungen + sonstigeBetrieblicheErtraege" },
                materialaufwand: { type: Type.NUMBER },
                deckungsbeitrag1: { type: Type.NUMBER, description: "Berechne als gesamtleistung - materialaufwand" },
                personalkosten: { type: Type.NUMBER },
                sonstigeBetrieblicheAufwendungen: { type: Type.NUMBER },
                ebitda: { type: Type.NUMBER, description: "Berechne als deckungsbeitrag1 - personalkosten - sonstigeBetrieblicheAufwendungen" },
                abschreibungen: { type: Type.NUMBER },
                ebit: { type: Type.NUMBER, description: "Berechne als ebitda - abschreibungen" },
                finanzergebnis: { type: Type.NUMBER },
                ebt: { type: Type.NUMBER, description: "Berechne als ebit + finanzergebnis" },
                steueraufwand: { type: Type.NUMBER },
                jahresueberschuss: { type: Type.NUMBER, description: "Berechne als ebt - steueraufwand" },
            },
        },
        balanceSheet: {
            type: Type.OBJECT,
            description: "Bilanz",
            properties: {
                immaterielleVermoegenswerte: { type: Type.NUMBER },
                sachanlagen: { type: Type.NUMBER },
                finanzanlagen: { type: Type.NUMBER },
                anlagevermoegen: { type: Type.NUMBER, description: "Summe aus immateriellen VW, Sachanlagen und Finanzanlagen" },
                vorraete: { type: Type.NUMBER },
                forderungenLuL: { type: Type.NUMBER },
                sonstigeVermoegenswerte: { type: Type.NUMBER },
                liquideMittel: { type: Type.NUMBER },
                umlaufvermoegen: { type: Type.NUMBER, description: "Summe aus Vorräten, Forderungen, sonstigen VW und liquiden Mitteln" },
                bilanzsummeAktiva: { type: Type.NUMBER, description: "Summe aus Anlagevermögen und Umlaufvermögen" },
                gezeichnetesKapital: { type: Type.NUMBER },
                kapitalruecklage: { type: Type.NUMBER },
                gewinnruecklagen: { type: Type.NUMBER },
                bilanzgewinn: { type: Type.NUMBER },
                eigenkapital: { type: Type.NUMBER, description: "Summe der Eigenkapitalposten" },
                rueckstellungen: { type: Type.NUMBER },
                verbindlichkeitenKreditinstitute: { type: Type.NUMBER },
                verbindlichkeitenLuL: { type: Type.NUMBER },
                sonstigeVerbindlichkeiten: { type: Type.NUMBER },
                fremdkapital: { type: Type.NUMBER, description: "Summe der Fremdkapitalposten" },
                bilanzsummePassiva: { type: Type.NUMBER, description: "Summe aus Eigenkapital und Fremdkapital" },
            },
        },
        cashFlow: {
             type: Type.OBJECT,
             description: "Cashflow-Rechnung",
            properties: {
                cashflowOperativ: { type: Type.NUMBER },
                cashflowInvestition: { type: Type.NUMBER },
                cashflowFinanzierung: { type: Type.NUMBER },
                nettoveraenderungLiquideMittel: { type: Type.NUMBER, description: "Summe der drei Cashflow-Arten" },
            },
        }
    },
    required: ["year", "incomeStatement", "balanceSheet", "cashFlow"]
};


const responseSchema = {
    type: Type.ARRAY,
    items: financialDataSchema
};

export const extractFinancialsFromImage = async (base64Image: string): Promise<FinancialData[]> => {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
        },
    };

    const textPart = {
        text: `Analysiere die Finanzberichte (GuV, Bilanz, Cashflow) im Bild. Extrahiere die Werte für alle verfügbaren Jahre. Gib eine Liste von JSON-Objekten zurück, eines für jedes Jahr, sortiert vom neuesten zum ältesten Jahr. Fülle alle Felder des JSON-Schemas. Wenn ein Wert nicht direkt ersichtlich ist, berechne ihn aus anderen Posten oder setze ihn auf 0, falls er nicht ableitbar ist. Berechne alle Zwischensummen (z.B. Gesamtleistung, EBITDA, Bilanzsummen), auch wenn sie nicht explizit aufgeführt sind. Gib das Ergebnis ausschließlich als JSON-Array zurück, das dem vorgegebenen Schema entspricht.`
    };
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonString = response.text.trim();
        const parsedData = JSON.parse(jsonString);

        if (!Array.isArray(parsedData) || parsedData.length === 0) {
            throw new Error("Die KI konnte keine Jahresdaten aus dem Bild extrahieren.");
        }
        
        // Basic validation on the first element
        const firstItem = parsedData[0];
        if (!firstItem.year || !firstItem.incomeStatement || !firstItem.balanceSheet) {
            throw new Error("Die extrahierten Daten sind unvollständig. Wichtige Abschnitte fehlen.");
        }
        
        return parsedData as FinancialData[];

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error && error.message.includes("JSON")) {
             throw new Error("Die KI-Antwort war kein valides JSON. Dies kann bei komplexen oder unklaren Bildern passieren.");
        }
        throw new Error("Die KI konnte die Daten aus dem Bild nicht verarbeiten. Stellen Sie sicher, dass das Bild klar und lesbar ist.");
    }
};
