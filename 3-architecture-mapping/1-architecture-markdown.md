
# Architecture de l'application *Todo List*

## Description des composants

### Composants de structure

- **App.js** : Point d'entrée de l'application

- **Layout.js** : Structure générale (header, contenu, footer)
- **Header.js** : En-tête de l'application
- **Footer.js** : Pied de page

### Composants métier

- **TodoPage.js** : Gestion de l'état et de la logique
- **AddTodo.js** : Formulaire d'ajout de tâche
- **TodoFilter.js** : Filtrage des tâches
- **TodoList.js** : Liste des tâches
- **TodoItem.js** : Affichage d'une tâche

### Services

- **todoService.js** : Gestion de la persistance des données

## Flux de données

1. Les données sont stockées dans TodoPage (todos, filter)
2. Les actions utilisateur sont remontées via les props (onAdd, onToggle, etc.)
3. Les mises à jour sont propagées du haut vers le bas
4. La persistance est gérée via le service

## Organisation des fichiers

```bash
src/
├── assets/
│   └── styles/
│       ├── App.css
│       └── index.css
├── components/
│   ├── AddTodo.js
│   ├── TodoFilter.js
│   ├── TodoItem.js
│   └── TodoList.js
├── layouts/
│   ├── Footer.js
│   ├── Header.js
│   └── Layout.js
├── pages/
│   └── TodoPage.js
├── services/
│   └── todoService.js
└── App.js
```
