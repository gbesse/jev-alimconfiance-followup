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
void assessInspectionFollowup(dossier, createFakeProvider(() => ({})));
