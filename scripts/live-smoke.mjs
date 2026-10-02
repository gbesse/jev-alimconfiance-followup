// Objectif : effectuer un appel Jev synthétique uniquement sur demande explicite.
import { createJevClient } from "../src/jev.mjs";
import { assessInspectionFollowup } from "../src/index.mjs";
const client = createJevClient();
const résultat = await assessInspectionFollowup({
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
}, client);
console.log(JSON.stringify({ décision: résultat.decision, confiance: résultat.confidence, usage: résultat.usage }, null, 2));
