# Rapports d'incidents

## #001 - Performance de rendu

**Sévérité**: Haute
**Date**: 2024-01-15
**Description**: L'application devient très lente après l'ajout de nombreux favoris (>100).
**Cause probable**: Absence de virtualisation de liste et re-rendus excessifs.

## #002 - Perte de métadonnées

**Sévérité**: Moyenne
**Date**: 2024-01-18
**Description**: Les descriptions et images des sites sont parfois perdues après rafraîchissement.
**Cause probable**: Erreurs dans la récupération/stockage des métadonnées.

## #003 - URLs invalides

**Sévérité**: Haute
**Date**: 2024-01-20
**Description**: Certains favoris sont sauvegardés avec des URLs malformées.
**Cause probable**: Validation insuffisante des URLs.

## #004 - Doublons

**Sévérité**: Basse
**Date**: 2024-01-22
**Description**: Possibilité d'ajouter plusieurs fois le même favori.
**Cause probable**: Pas de vérification d'unicité.
