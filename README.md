# MeetEasy

Une application web pour faciliter la rédaction de comptes-rendus de réunion.

## Objectif

Permettre aux utilisateurs de saisir des notes de réunion librement, puis de générer un compte-rendu structuré grâce à une intégration d'IA (OpenAI).

## Stack Technique

- Frontend : React
- Backend : Express (Node.js)
- Base de données : MongoDB
- API IA : OpenAI API (GPT-3.5)
- Hébergement : Netlify (front), Northflank (back)
- Tests : Jest, Supertest

## Fonctionnalités prévues

- Saisie de notes en ligne
- Génération de compte rendu via IA
- Export PDF / Copier-coller
- Limitation d'utilisation gratuite (2 essais)
- Historique de réunions (version 2)

## Tests

- Jest et Supertest sont utilisés pour tester les routes backend (utilisateurs).
- Des tests ont été rapidement mis en place pour vérifier les routes utilisateur (création, connexion, récupération des infos).
- L'objectif était d'expérimenter et m'initier rapidement aux tests unitaires mais ce n'est pas une partie que je développerai davantage.
