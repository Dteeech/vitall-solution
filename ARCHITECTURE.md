# Architecture du Projet Vitall

## 🛡️ Sécurité : Pourquoi Snyk pour le Container Scanning ?

Dans le cadre de notre démarche **DevSecOps**, nous avons intégré **Snyk** comme scanner de vulnérabilités pour nos images Docker. Contrairement à des outils standards, Snyk se distingue par :
1.  **Intelligence Contextuelle** : Snyk n'identifie pas seulement les vulnérabilités système (OS), mais analyse aussi les dépendances applicatives et l'image de base node.js.
2.  **Aide à la remédiation** : Il propose des chemins de mise à jour concrets (ex: suggérer une image de base plus récente et moins vulnérable) plutôt que de simples alertes.
3.  **Filtrage par sévérité** : Notre pipeline est configuré pour bloquer tout déploiement contenant des vulnérabilités de niveau "High" ou "Critical", garantissant que seule une image saine atteint la production.

Cette intégration permet d'automatiser la sécurité sans ralentir le cycle de développement, en apportant des retours immédiats aux développeurs directement dans la CI.
