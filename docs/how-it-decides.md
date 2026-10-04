# Comment la décision est prise

Compare des contrôles sanitaires successifs et prépare une conclusion de suivi sourcée et révisable.

Le code normalise la source et applique d’abord le cas déterministe documenté dans `src/index.mjs`. Pour les autres dossiers, Jev choisit la catégorie la plus prudente selon la concordance d’identité de l’établissement, la chronologie et l’évolution explicitement observable entre les contrôles. Une confiance inférieure à `0.8`, la catégorie `review_required` ou une absence de données choisie par le modèle marque le résultat pour revue humaine. Une collection vide explicitement fournie reste un résultat déterministe sans appel Jev.

Les niveaux officiels de maîtrise sanitaire et les identifiants exacts ne sont jamais recalculés par le modèle.

Les démonstrations ne contiennent que des probabilités synthétiques. Constituez un corpus français annoté, mesurez les erreurs par catégorie et fixez vos propres seuils avant un usage opérationnel.
