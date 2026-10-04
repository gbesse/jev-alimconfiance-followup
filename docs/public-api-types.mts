// Objectif : vérifier les types publiés depuis un projet consommateur.
import { inspectionFollowupCase, assessInspectionFollowup, DECISIONS } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = inspectionFollowupCase({
  "id": "exemple-1",
  "text": "Deux contrôles synthétiques du même établissement et du même SIRET : le second ne reprend plus les écarts d’hygiène documentaire décrits lors du premier.",
  "source": {
    "url": "https://example.test/source-publique",
    "date": "2026-10-01"
  },
  "details": {
    "territoire": "France — cas synthétique",
    "origine": "donnée synthétique"
  }
});
void DECISIONS;
void assessInspectionFollowup(dossier, createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "improvement_supported", probabilities: { "improvement_supported": 0.82, "review_required": 0.06, "unresolved": 0.06, "no_inspection": 0.06 }, confidence: 0.82 } } })));

// Ces erreurs attendues protègent le contrat des consommateurs TypeScript.
// @ts-expect-error — un fournisseur doit retourner une réponse Jev complète.
createFakeProvider(() => ({}));
const result = await assessInspectionFollowup(dossier, createFakeProvider(() => ({ model: "jev-1.13.0", answers: {} })));
const review: boolean = result.review;
void review;
// @ts-expect-error — la revue humaine est un booléen.
const incorrect: string = result.review;
void incorrect;
