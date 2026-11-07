# Journal des versions

Ce journal suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), et la bibliothèque le [versionnage sémantique](https://semver.org/lang/fr/).

## [Non publié]

## 0.1.0

Première version, sur la version `2026-11-01` de l'API.

- `Ophelix`, un service par ressource publique : praticiens, patients, droits, factures et prestations, événements, requêtes, points de terminaison, postes et codes d'appairage, outils du mode test.
- Types de chaque objet et de chaque paramètre, générés depuis la spécification OpenAPI.
- Une classe par type d'erreur de l'API, avec code, paramètre, lien vers la documentation et `Request-Id`.
- Clé `Idempotency-Key` tirée pour chaque écriture et gardée d'une reprise à l'autre ; reprises avec délai croissant sur 429, 5xx et coupure, `Retry-After` respecté.
- Pagination par `for await`, dans les deux sens, et `toArray({ limit })`.
- Mode test ou production déduit de la clé, version de l'API épinglée et réglable.
- `webhooks.constructEvent()`, qui vérifie `Ophelix-Signature` et sa fraîcheur.
- ESM et CommonJS, Node 20.3 et plus, aucune dépendance.
