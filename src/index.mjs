// Objectif : implémenter la frontière de décision métier propre au dépôt.
import { readFile } from "node:fs/promises";
export const DECISIONS = Object.freeze({
  "improvement_supported": "amelioration_etayee",
  "review_required": "revue_requise",
  "unresolved": "situation_non_resolue",
  "no_inspection": "aucun_controle_fourni"
});
const CRITERIA = Object.freeze({
  "improvement_supported": "amelioration etayee",
  "review_required": "revue requise",
  "unresolved": "situation non resolue",
  "no_inspection": "aucun controle fourni"
});
export function inspectionFollowupCase(input) {
  if (!input?.id || !input?.text || !input?.source?.url || !input?.source?.date) throw new TypeError("Le dossier exige id, text, source.url et source.date");
  const date = new Date(input.source.date);
  if (Number.isNaN(date.valueOf())) throw new TypeError("source.date doit être une date ISO valide");
  return { ...input, id: String(input.id), text: String(input.text).trim(), source: { url: String(input.source.url), date: date.toISOString() } };
}
export async function assessInspectionFollowup(input, provider) {
  const record = inspectionFollowupCase(input);
  if (Array.isArray(record.inspections) && record.inspections.length === 0) return { decision: "no_inspection", label: DECISIONS["no_inspection"], probability: 1, review: false, deterministic: true };
  const response = await provider.decide({
    state: record,
    questions: { decision: { type: "choice", instructions: "Analysez ce dossier à partir des seuls éléments sourcés. Évaluez la concordance d’identité de l’établissement, la chronologie et l’évolution explicitement observable entre les contrôles. Choisissez la catégorie la plus prudente. N’inventez ni fait, ni règle applicable, ni garantie.", criteria: CRITERIA } },
  });
  const answer = response.answers.decision;
  return { decision: answer.choice, label: DECISIONS[answer.choice], probability: answer.probabilities[answer.choice], confidence: answer.confidence, review: answer.confidence < 0.8, deterministic: false, usage: response.usage };
}
export async function runCli(argv, io = console) {
  if (argv.length !== 1) throw new Error("Usage : jev-alimconfiance-followup <dossier.json>");
  const dossier = inspectionFollowupCase(JSON.parse(await readFile(argv[0], "utf8")));
  io.log(JSON.stringify({ dossier, prochaineÉtape: "Transmettez ce dossier à assessInspectionFollowup avec un fournisseur Jev configuré." }, null, 2));
}
