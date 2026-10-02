// Objectif : vérifier la normalisation, la règle déterministe et les décisions sémantiques.
import test from "node:test";
import assert from "node:assert/strict";
import { inspectionFollowupCase, assessInspectionFollowup } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const casLimite = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-10-01"
  },
  "inspections": []
};
const casPrincipal = {
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
const casÀRevoir = {
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
test("exige une source", () => assert.throws(() => inspectionFollowupCase({ id: "x", text: "y" }), /source/));
test("refuse une date de source invalide", () => assert.throws(() => inspectionFollowupCase({ id: "x", text: "y", source: { url: "https://example.test", date: "impossible" } }), /date ISO/));
test("applique le cas limite sans appel Jev", async () => {
  const provider = createFakeProvider(() => { throw new Error("appel interdit"); });
  assert.equal((await assessInspectionFollowup(casLimite, provider)).decision, "no_inspection");
  assert.equal(provider.calls, 0);
});
test("classe un dossier sourcé avec une confiance suffisante", async () => {
  const provider = createFakeProvider(() => ({
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
}));
  const résultat = await assessInspectionFollowup(casPrincipal, provider);
  assert.equal(résultat.decision, "improvement_supported");
  assert.equal(résultat.review, false);
  assert.equal(provider.calls, 1);
});
test("marque une décision incertaine pour revue humaine", async () => {
  const provider = createFakeProvider(() => ({
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
}));
  const résultat = await assessInspectionFollowup(casÀRevoir, provider);
  assert.equal(résultat.decision, "review_required");
  assert.equal(résultat.review, true);
  assert.equal(résultat.confidence, 0.62);
});
