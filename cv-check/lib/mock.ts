import type { AnalysisResult } from "./types";

// Mirrors the contract example so the UI can be built before the edge function exists.
export const mockAnalysis: AnalysisResult = {
  id: "00000000-0000-4000-8000-000000000000",
  match_score: 72,
  language: "et",
  summary: "Tugev tehniline sobivus, juhtimiskogemus pole CV-s nähtav.",
  missing: [
    {
      item: "Meeskonna juhtimine",
      importance: "critical",
      suggestion:
        "Kui oled juhendanud praktikante või vedanud projekti, kirjuta see välja koos meeskonna suurusega.",
    },
    {
      item: "SQL-i kogemus",
      importance: "important",
      suggestion:
        "Kuulutus nõuab SQL-i. Kui kasutasid seda aruannete või andmete jaoks, nimeta see konkreetse projekti juures.",
    },
    {
      item: "Agiilne arendus",
      importance: "important",
      suggestion: "Lisa, kas töötasid sprintides ja millist meetodit meeskond kasutas.",
    },
    {
      item: "Power BI",
      importance: "nice_to_have",
      suggestion: "Ei ole kohustuslik, aga kui oled seda kasutanud, lisa oskuste alla.",
    },
  ],
  cv_improvements: [
    {
      suggestion:
        "Lisa projekti juurde mõõdetav tulemus, näiteks „kiirendasin päringuid 40%“.",
    },
    {
      suggestion:
        "Too kokkuvõttes esile kaks oskust, mida kuulutus kõige rohkem rõhutab.",
    },
    {
      suggestion:
        "Kirjelda viimase töökoha vastutust tegusõnadega: juhtisin, ehitasin, vähendasin.",
    },
  ],
  keywords_missing: ["SQL", "Agile", "stakeholder management", "Power BI"],
  cover_letter: `Lugupeetud värbamismeeskond

Kandideerin Teie andmeanalüütiku ametikohale, sest see ühendab kaks asja, millega olen viimased kolm aastat igapäevaselt tegelenud: andmete puhastamise ja selgete otsuste toetamise.

Praeguses töös ehitasin müügiosakonnale nädalaraporti, mis asendas käsitsi koostatud tabelid ja säästis meeskonnale ligi neli tundi nädalas. Kuulutuses rõhutate Pythoni ja andmete visualiseerimise oskust. Kasutan Pythonit iga päev ning olen loonud juhtkonnale ülevaateid, mille põhjal planeeriti eelmise aasta eelarvet.

Hindan, et Teie meeskond töötab otse ärijuhtidega. Olen harjunud selgitama tehnilisi tulemusi inimestele, kellel analüütika taust puudub, ja teen seda meelsasti ka edaspidi.

Meeskonna juhtimise kogemust mul veel ei ole, kuid olen valmis selles suunas kasvama ja võtma vastutust uute kolleegide sisseelamisel.

Tänan Teid aja eest ja vastan hea meelega küsimustele.

Lugupidamisega
Mari Maasikas`,
};
