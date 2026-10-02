// Objectif : produire un rapport hors ligne comparant les trois chemins de décision.
import { assessInspectionFollowup } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const principal = {
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
};
const limite = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-10-01"
  },
  "inspections": []
};
const revue = {
  "id": "revue-1",
  "text": "Deux fiches portent des enseignes proches dans la même rue, mais leurs identifiants et adresses normalisées ne concordent pas complètement.",
  "source": {
    "url": "https://example.test/dossier-ambigu",
    "date": "2026-10-01"
  },
  "details": {
    "origine": "donnée synthétique",
    "signal": "informations incomplètes"
  }
};
const réponses = [{
  "model": "jev-1.13.0",
  "answers": {
    "decision": {
      "type": "choice",
      "choice": "improvement_supported",
      "probabilities": {
        "improvement_supported": 0.82,
        "review_required": 0.06,
        "unresolved": 0.06,
        "no_inspection": 0.06
      },
      "confidence": 0.82
    }
  },
  "usage": {
    "input_tokens": 120,
    "output_tokens": 0
  }
}, {
  "model": "jev-1.13.0",
  "answers": {
    "decision": {
      "type": "choice",
      "choice": "review_required",
      "probabilities": {
        "improvement_supported": 0.1267,
        "review_required": 0.62,
        "unresolved": 0.1267,
        "no_inspection": 0.1267
      },
      "confidence": 0.62
    }
  },
  "usage": {
    "input_tokens": 140,
    "output_tokens": 0
  }
}];
const provider = createFakeProvider(() => réponses.shift());
const résultats = [];
for (const [scénario, dossier] of [["principal", principal], ["limite déterministe", limite], ["revue humaine", revue]]) {
  const résultat = await assessInspectionFollowup(dossier, provider);
  résultats.push({ scénario, décision: résultat.label, revueHumaine: résultat.review, déterministe: résultat.deterministic });
}
console.log(JSON.stringify({ dépôt: "jev-alimconfiance-followup", résultats }, null, 2));
