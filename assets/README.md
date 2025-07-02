# Structure des Assets Hobbymood

Ce dossier contient tous les assets visuels pour les jeux et les scores.

## Structure des dossiers

```
assets/
├── jeu1/
│   ├── questions/
│   │   ├── Q1.png
│   │   ├── Q1_reponses.png
│   │   ├── Q2.png
│   │   ├── Q2_reponses.png
│   │   └── ... (jusqu'à Q8)
│   ├── logo.png
│   └── presentation.png
├── jeu2/
│   ├── questions/
│   │   ├── Q1.png
│   │   ├── Q1_reponses.png
│   │   └── ... (jusqu'à Q9)
│   ├── logo.png
│   └── presentation.png
├── jeu3/
│   ├── questions/
│   │   ├── Q1.png
│   │   ├── Q1_reponses.png
│   │   └── ... (jusqu'à Q10)
│   ├── logo.png
│   └── presentation.png
└── scores/
    └── base.png
```

## Format des fichiers

- **Format** : PNG recommandé pour la transparence
- **Résolution** : 1920x1080 pour un affichage optimal
- **Transparence** : Supportée pour les overlays

## Naming convention

- **Questions** : `Q1.png`, `Q2.png`, etc.
- **Réponses** : `Q1_reponses.png`, `Q2_reponses.png`, etc.
- **Logos** : `logo.png`
- **Présentations** : `presentation.png`
- **Scores** : `base.png`

## Ajout de nouveaux assets

1. Placez vos images dans le bon dossier selon le jeu
2. Respectez la convention de nommage
3. Redémarrez le serveur si nécessaire

## Notes importantes

- Les images doivent être optimisées pour le web
- Évitez les fichiers trop volumineux (> 2MB par image)
- Testez l'affichage dans OBS avant l'utilisation en direct 