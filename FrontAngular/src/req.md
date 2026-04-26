initial requirements before developpment started

Application de Gestion de Formation

## Aperçu du Projet
Développer une application web complète pour gérer les sessions de formation professionnelle au centre de formation « Excellent Training » (filiale de la société « Green Building »). L'application centralisera la gestion des données de formation, remplacera les processus manuels basés sur Excel, et fournira des capacités d'analyse statistique et de suivi.

## Pile Technologique
- **Backend**: Spring Boot (Spring Web, Spring Data JPA, Lombok)
- **Frontend**: Angular avec Tailwind CSS
- **Base de Données**: PostgreSQL
- **ORM**: Hibernate (via Spring Data JPA)

---

## Exigences Fonctionnelles

### 1. Rôles Utilisateur et Contrôle d'Accès
L'application doit prendre en charge trois rôles utilisateur distincts avec des permissions spécifiques :

#### 1.1 Simple Utilisateur (Utilisateur Simple)
- Gérer les formateurs (opérations CRUD)
- Gérer les formations (opérations CRUD)
- Gérer les participants (opérations CRUD)
- Consulter les tableaux de bord d'informations de base

#### 1.2 Responsable du Centre (Responsable du Centre)
- Consulter les statistiques et rapports complets de formation
- Filtrer les statistiques par structure
- Filtrer les statistiques par domaine
- Surveiller les activités de formation
- Accès à toutes les fonctionnalités de Simple Utilisateur

#### 1.3 Administrateur (Administrateur)
- Accès illimité à toutes les fonctionnalités de l'application
- Effectuer toutes les tâches des autres rôles utilisateur
- Gérer les comptes d'utilisateurs (créer, modifier, supprimer, activer/désactiver)
- Gérer les domaines (CRUD)
- Gérer les structures (CRUD)
- Gérer les profils des participants (CRUD)
- Configuration et maintenance du système

### 2. Modules de Gestion de Données Centraux

#### 2.1 Gestion des Formateurs (Formateur)
**Champs Requis**:
- Prénom
- Nom
- Email
- Numéro de Téléphone (Tel)
- Type de Formateur (Type): Interne (interne) ou Externe (externe)
- Identifiant Employeur (pour les formateurs externes)

**Fonctionnalités**:
- Créer de nouveaux formateurs avec validation
- Modifier les informations du formateur
- Supprimer des formateurs (avec vérification de cohérence des données)
- Lister tous les formateurs avec options de filtrage
- Distinguer entre les formateurs internes (employés de Green Building) et les formateurs externes

#### 2.2 Gestion des Formations (Formation)
**Champs Requis**:
- Titre (Titre)
- Année (Année)
- Durée en jours (Durée)
- Identifiant Domaine (idDomaine)
- Budget
- Affectation du formateur
- Liste des participants
- Lieu de la formation
- Date de la formation

**Fonctionnalités**:
- Créer des sessions de formation avec toutes les informations requises
- Affecter des formateurs aux formations
- Affecter des participants aux formations
- Modifier les détails et la planification des formations
- Supprimer des formations
- Lister toutes les formations avec filtrage avancé (par domaine, année, formateur, statut)
- Afficher la liste des participants pour chaque formation
- Archivage historique des formations terminées

#### 2.3 Gestion des Participants (Participant)
**Champs Requis**:
- Prénom
- Nom
- Identifiant Structure (IdStructure)
- Identifiant Profil (idProfil)
- Email
- Numéro de Téléphone (Tel)

**Fonctionnalités**:
- Enregistrer de nouveaux participants avec validation
- Modifier les informations des participants
- Supprimer des participants (avec vérification des contraintes)
- Lister tous les participants
- Filtrer les participants par structure
- Filtrer les participants par profil
- Suivre l'historique de participation
- Affecter les participants à une ou plusieurs formations

#### 2.4 Gestion des Domaines (Domaine)
**Champs Requis**:
- Libelle (Libelle)

**Fonctionnalités**:
- Créer de nouveaux domaines (Informatique, Finance, Comptabilité, Mécanique, etc.)
- Modifier les informations du domaine
- Supprimer les domaines (seulement s'il n'y a pas de formations associées)
- Lister tous les domaines
- Afficher le nombre de formations par domaine

#### 2.5 Gestion des Structures (Structure)
**Champs Requis**:
- Libelle (Libelle)

**Fonctionnalités**:
- Créer des structures organisationnelles (Direction Centrale, Directions Régionales)
- Modifier les informations de la structure
- Supprimer les structures (avec validation des données)
- Lister toutes les structures
- Afficher le nombre de participants par structure
- Afficher la participation à la formation par structure

#### 2.6 Gestion des Profils (Profil)
**Champs Requis**:
- Libelle (Libelle) - Exemples: Informaticien (Bac+5), Informaticien (Bac+3), Gestionnaire, Juriste, Technicien Supérieur, etc.

**Fonctionnalités**:
- Créer de nouveaux profils professionnels
- Modifier les informations du profil
- Supprimer les profils (avec vérification de cohérence)
- Lister tous les profils

#### 2.7 Gestion des Employeurs (Employeur)
**Champs Requis**:
- Nom Employeur (nomemployeur)

**Fonctionnalités**:
- Créer de nouveaux employeurs pour les formateurs externes
- Modifier les informations de l'employeur
- Supprimer les employeurs
- Lister tous les employeurs

#### 2.8 Gestion des Comptes Utilisateurs (Utilisateur) - Admin Uniquement
**Champs Requis**:
- Login (unique)
- Mot de Passe (chiffré/hashé)
- Identifiant Rôle (idRole)

**Fonctionnalités**:
- Créer des comptes utilisateurs avec attribution de rôle
- Réinitialiser les mots de passe utilisateurs
- Modifier les informations utilisateur
- Supprimer/désactiver les comptes utilisateurs
- Attribuer des rôles aux utilisateurs
- Lister tous les utilisateurs avec leurs rôles
- Activer/désactiver l'accès utilisateur

### 3. Module de Rapports et Statistiques

#### 3.1 Tableau de Bord des Statistiques de Formation
- Nombre total de formations par année
- Total des heures de formation par domaine
- Formations par structure
- Formations par formateur
- Analyse du budget de formation
- Nombre de participants par formation
- Taux de présence aux formations

#### 3.2 Analyses Basées sur les Structures
- Besoins de formation satisfaits par structure
- Nombre de participants par structure
- Dépenses de formation spécifiques à la structure
- Distribution des formations par domaine au sein de chaque structure
- Tendances de participation

#### 3.3 Analyses Basées sur les Domaines
- Fréquence de formation par domaine
- Allocation totale du budget par domaine
- Participants formés par domaine
- Métriques de popularité du domaine
- Spécialisation des formateurs par domaine

#### 3.4 Génération de Rapports
- Rapports exportables (PDF, Excel)
- Plages de dates personnalisables
- Rapports filtrés par structure/domaine
- Résumés de la prestation de formation
- Rapports annuels d'activité de formation

### 4. Règles de Validation et d'Intégrité des Données

**Validation des Entrées Obligatoires**:
- Tous les champs requis doivent être non-vides
- Les adresses e-mail doivent respecter un format valide
- Les numéros de téléphone doivent être valides (numériques, longueur appropriée)
- Les noms d'utilisateurs doivent être uniques
- Les mots de passe doivent respecter les exigences de sécurité (min 8 caractères, mélange de majuscules/minuscules/chiffres/caractères spéciaux)
- La durée de formation doit être un entier positif
- Le budget doit être un nombre positif
- Les champs de date doivent être valides et logiquement ordonnés
- Au moins un participant doit être affecté à chaque formation
- Le formateur doit exister avant son affectation à une formation

**Validation de la Logique Métier**:
- Impossible de supprimer les domaines avec des formations associées
- Impossible de supprimer les structures avec des participants associés
- Impossible d'affecter le même participant deux fois à une formation identique
- Impossible d'affecter un formateur à une formation s'il n'est pas disponible ce jour-là
- La date de formation ne doit pas être antérieure à aujourd'hui (pour les nouvelles formations)
- Impossible de supprimer les formateurs avec des affectations de formation actives
- L'année de formation doit être valide (pas plus de 5 ans dans le futur)

### 5. Exigences de l'Interface Utilisateur

#### 5.1 Interface Générale et Expérience Utilisateur
- Design responsive pour les appareils de bureau, tablettes et mobiles
- Tailwind CSS pour le style avec un système de conception cohérent
- Navigation intuitive et claire
- Visibilité du menu basée sur les rôles
- Navigation en fil d'Ariane pour une orientation facile
- Indicateurs de chargement pour les opérations asynchrones
- Messages d'erreur affichés clairement aux utilisateurs
- Messages de confirmation de succès

#### 5.2 Structure des Pages
- **Tableau de Bord/Page d'Accueil**: Aperçu rapide, widgets spécifiques au rôle
- **Menu de Navigation**: Accessible à partir de toutes les pages, réductible sur mobile
- **Formulaires**: Validation des entrées avec retour en temps réel
- **Tableaux de Données**: Pagination, tri, filtrage, fonctionnalité de recherche
- **Pages de Statistiques**: Graphiques et graphiques en utilisant des bibliothèques compatibles avec Angular

#### 5.3 Pages Clés Requises
- Page de Connexion (Login)
- Tableau de Bord (spécifique au rôle)
- Page de Gestion des Formateurs
- Page de Gestion des Formations
- Page de Gestion des Participants
- Page de Gestion des Domaines
- Page de Gestion des Structures
- Page de Gestion des Profils
- Page de Gestion des Employeurs
- Page de Gestion des Utilisateurs (Admin uniquement)
- Page de Statistiques et Rapports
- Page du Profil Utilisateur/Paramètres

---

## Schéma de la Base de Données

### Spécification des Tables

**Utilisateur**
- Id (PK, auto-increment)
- Login (String, unique)
- Password (String, chiffré)
- idRole (FK vers Rôle)

**Rôle**
- Id (PK, auto-increment)
- Nom (String): "simple_utilisateur" / "responsable" / "administrateur"

**Formateur**
- Id (PK, auto-increment)
- Nom (String)
- Prénom (String)
- Email (String)
- Tel (Integer)
- Type (String): "interne" / "externe"
- IdEmployeur (FK vers Employeur, nullable pour les formateurs internes)

**Formation**
- Id (PK, auto-increment, Long)
- Titre (String)
- Année (Integer)
- Durée (Integer) - nombre de jours
- IdDomaine (FK vers Domaine)
- Budget (Double)
- IdFormateur (FK vers Formateur)
- Lieu (String) - lieu de la formation
- DateDebut (Date) - date de début de la formation
- DateFin (Date) - date de fin de la formation
- DateCreation (Date) - horodatage de création

**Participant**
- Id (PK, auto-increment)
- Nom (String)
- Prénom (String)
- IdStructure (FK vers Structure)
- IdProfil (FK vers Profil)
- Email (String)
- Tel (Integer)
- DateEmbauche (Date) - optionnel

**ParticipantFormation (Table de Jonction)**
- IdParticipant (FK vers Participant, partie de la PK composite)
- IdFormation (FK vers Formation, partie de la PK composite)
- DateInscription (Date)

**Domaine**
- Id (PK, auto-increment)
- Libelle (String, unique)

**Structure**
- Id (PK, auto-increment)
- Libelle (String, unique)

**Profil**
- Id (PK, auto-increment)
- Libelle (String, unique)

**Employeur**
- Id (PK, auto-increment)
- nomemployeur (String, unique)

---

## Exigences Techniques

### Backend (Spring Boot)

#### 4.1 Architecture
- Utiliser Spring Boot 3.x ou la dernière version stable
- Implémenter le modèle MVC avec une séparation claire des préoccupations
- Utiliser Spring Data JPA pour les opérations de base de données
- Implémenter une couche de service pour la logique métier
- Utiliser les DTOs (Data Transfer Objects) pour les réponses API
- Conception API RESTful avec les méthodes HTTP et codes de statut appropriés

#### 4.2 Dépendances Requises
```
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-boot-starter-validation
- postgresql driver
- lombok
- mapstruct (pour le mapping DTO)
- springdoc-openapi (pour la documentation Swagger)
```

#### 4.3 Structure des Points de Terminaison API
Suivre les conventions RESTful :
- `GET /api/formateurs` - Lister tous les formateurs
- `POST /api/formateurs` - Créer un formateur
- `GET /api/formateurs/{id}` - Obtenir les détails du formateur
- `PUT /api/formateurs/{id}` - Modifier un formateur
- `DELETE /api/formateurs/{id}` - Supprimer un formateur
- Modèles similaires pour toutes les autres entités

#### 4.4 Implémentation de la Sécurité
- Spring Security pour l'authentification et l'autorisation
- Jetons JWT pour l'authentification API
- Chiffrement des mots de passe à l'aide de BCrypt
- Contrôle d'accès basé sur les rôles (RBAC)
- Protection CSRF
- Configuration CORS pour le frontend Angular

#### 4.5 Validation des Données
- Utiliser les annotations de validation Java Bean (@NotNull, @NotEmpty, @Email, etc.)
- Implémenter des validateurs personnalisés pour les règles métier complexes
- Retourner des messages d'erreur significatifs avec retour de validation au niveau du champ
- Implémenter un intercepteur de validation des demandes

#### 4.6 Gestion des Erreurs
- Classes d'exception personnalisées pour différents scénarios d'erreur
- Gestionnaire d'exceptions global utilisant @ControllerAdvice
- Format de réponse d'erreur cohérent avec codes d'erreur et messages
- Codes de statut HTTP appropriés (400, 401, 403, 404, 500, etc.)

#### 4.7 Enregistrement
- Utiliser SLF4J avec Logback
- Enregistrer les opérations importantes et les erreurs
- Inclure l'enregistrement des demandes/réponses pour le débogage

### Frontend (Angular + Tailwind CSS)

#### 5.1 Structure du Projet
```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   ├── models/
│   │   ├── interceptors/
│   │   └── guards/
│   ├── shared/
│   │   ├── components/
│   │   └── directives/
│   ├── features/
│   │   ├── formateurs/
│   │   ├── formations/
│   │   ├── participants/
│   │   ├── domaines/
│   │   ├── structures/
│   │   ├── profils/
│   │   ├── employeurs/
│   │   ├── utilisateurs/
│   │   ├── statistiques/
│   │   └── tableau-de-bord/
│   ├── auth/
│   └── app.module.ts
├── assets/
└── styles/
```

#### 5.2 Fonctionnalités Angular Requises
- Angular 17+ (dernière version stable)
- Routage Angular avec chargement différé
- HttpClientModule pour la communication API
- Formulaires Réactifs avec validation complète
- RxJS pour la gestion d'état (ou NgRx pour un état complexe)
- Services et modèles type-safe
- Intercepteurs pour la gestion des jetons JWT et la gestion des erreurs
- Gardes d'itinéraire pour les pages protégées
- Architecture basée sur les composants

#### 5.3 Composants UI et Bibliothèques
- Tailwind CSS pour le style
- Angular Material ou ng-bootstrap pour les composants UI
- ng-apexcharts ou Chart.js pour la visualisation des statistiques
- ngx-pagination pour la pagination des tableaux
- ngx-toastr ou similaire pour les notifications
- ngx-spinner pour les indicateurs de chargement
- Bibliothèque de sélecteur de date (datepicker ngx-bootstrap ou similaire)

#### 5.4 Gestion des Formulaires
- Formulaires Réactifs pour tous les formulaires de saisie
- Retour de validation en temps réel
- Validateurs personnalisés si nécessaire
- Messages d'erreur clairs sous chaque champ
- Fonctionnalité de réinitialisation du formulaire
- Fonctionnalité d'enregistrement automatique du brouillon (optionnel)

#### 5.5 Fonctionnalités de Tableau
- Colonnes triables
- Lignes filtrables
- Pagination avec taille de page configurable
- Fonctionnalité de recherche
- Exportation en CSV/Excel (optionnel)
- Édition en ligne (optionnel)
- Actions en masse (optionnel)

#### 5.6 Authentification et Autorisation
- Page de connexion avec e-mail et mot de passe
- Stockage du jeton JWT dans localStorage/sessionStorage
- Intercepteur HTTP pour l'attachement du jeton aux demandes
- Mécanisme d'actualisation automatique du jeton
- Fonctionnalité de déconnexion
- Gardes d'itinéraire basés sur les rôles
- Gestion de l'accès non autorisé

#### 5.7 Design Responsive
- Approche mobile-first avec Tailwind
- Menu hamburger pour la navigation mobile
- Boutons et entrées adaptés au tactile
- Tableaux/grilles responsive
- Typographie adaptée
- Optimisations spécifiques aux appareils

---

## Contraintes du Projet et Livrables

### Calendrier
- **Date limite de soumission finale**: 30 avril 2026
- **Semaine de soutenance/présentation**: 4 mai 2026 (en ligne)
- **Taille de l'équipe**: Monôme (individuel) ou Binôme (pair)

### Livrables

#### 1. Documentation de Conception (UML)
- **Diagramme de Classes**: Toutes les entités, leurs attributs, méthodes et relations
- **Diagrammes de Séquences**: Au moins 4-5 flux de travail utilisateur clés :
  - Flux d'authentification et connexion utilisateur
  - Processus de création de formation et d'affectation de participants
  - Processus d'enregistrement du formateur
  - Processus de génération de rapport
  - Modification du rôle utilisateur par l'administrateur

#### 2. Code Source
- Code bien organisé et documenté
- Suivi des principes SOLID
- Conventions de dénomination cohérentes
- Commentaires clairs pour la logique complexe
- README avec instructions de configuration

#### 3. Configuration de la Base de Données
- Scripts SQL pour la création de tables
- Scripts de remplissage des données initiales (données d'exemple)
- Documentation du schéma de la base de données

#### 4. Rapport du Projet
- Aperçu et objectifs du projet
- Architecture du système
- Justification de la conception de la base de données
- Détails de l'implémentation
- Défis rencontrés et solutions
- Documentation des tests
- Guide/manuel utilisateur

#### 5. Livrables Supplémentaires
- Documentation API (Swagger/OpenAPI)
- Instructions de déploiement
- Fichiers de configuration (application.properties, variables d'environnement)

---

## Qualité et Exigences de Test

### Qualité du Code
- Suivre les meilleures pratiques Spring Boot et Angular
- Principe DRY (Don't Repeat Yourself)
- Gestion appropriée des exceptions
- Validation des entrées sur tous les points de terminaison
- Meilleures pratiques de sécurité (prévention de l'injection SQL, protection XSS, etc.)
- Optimisation des performances (chargement différé, mise en cache si approprié)

### Tests (Optionnel mais Recommandé)
- Tests unitaires pour la couche de service (JUnit 5 + Mockito)
- Tests d'intégration pour les contrôleurs
- Tests unitaires frontend (Jasmine/Karma)
- Tests de bout en bout (Cypress ou Protractor)
- Rapport de couverture de test

### Liste de Contrôle de Sécurité
- Tous les mots de passe chiffrés
- Prévention de l'injection SQL (requêtes paramétrées via JPA)
- Implémentation du jeton CSRF
- Protection XSS
- CORS correctement configuré
- Authentification requise pour les points de terminaison protégés
- Vérifications d'autorisation pour les opérations spécifiques au rôle
- Données sensibles non enregistrées
- Limitation de débit (optionnel)

---

## Meilleures Pratiques de Développement

### Backend
1. Utiliser l'injection de constructeur pour les dépendances
2. Implémenter une gestion appropriée des exceptions
3. Utiliser Lombok pour réduire le code passe-partout
4. Créer des classes DTO pour les demandes/réponses API
5. Implémenter un enregistrement complet
6. Utiliser les transactions de base de données pour les opérations critiques
7. Implémenter une suppression logicielle pour les entités si nécessaire
8. Créer des index de base de données pour les colonnes fréquemment interrogées

### Frontend
1. Utiliser les composants intelligents et présentationnels
2. Implémenter le cycle de vie OnDestroy pour se désabonner des observables
3. Utiliser trackBy dans les boucles *ngFor pour les performances
4. Charger les modules de fonctionnalités de manière différée
5. Utiliser ChangeDetectionStrategy.OnPush si approprié
6. Implémenter une gestion appropriée des erreurs et un retour utilisateur
7. Utiliser les fichiers d'environnement pour la configuration
8. Implémenter le typage TypeScript approprié

### Base de Données
1. Utiliser les types de données appropriés
2. Implémenter les contraintes de clé étrangère
3. Ajouter des index sur les colonnes fréquemment recherchées
4. Documenter les modifications de schéma
5. Utiliser les migrations pour les mises à jour de schéma

---

## Remarques Supplémentaires

### Règles Métier Clés à Appliquer
1. Un participant peut s'inscrire à plusieurs formations
2. Chaque formation doit avoir exactement un formateur affecté
3. Chaque formation doit avoir au moins un participant affecté
4. Les formateurs peuvent être internes ou externes avec des règles de gestion différentes
5. L'année de formation ne doit pas dépasser 5 ans dans le futur
6. Les domaines et les profils agissent comme données de référence et ne peuvent pas être supprimés s'ils sont en cours d'utilisation
7. Toutes les dates doivent être dans un format valide et logiquement cohérentes

### Considérations de Performance
- Implémenter la pagination pour les grands ensembles de données (formations, participants)
- Mettre en cache les données fréquemment accessibles (domaines, structures, profils)
- Optimiser les requêtes de base de données pour éviter les problèmes N+1
- Utiliser le chargement différé dans les relations

### Considérations de Scalabilité
- Concevoir l'API pour gérer plusieurs utilisateurs simultanés
- Implémenter l'indexation appropriée de la base de données
- Envisager d'implémenter une limitation de débit API
- Utiliser la mise en pool de connexions

---

## Critères de Succès

L'application sera considérée comme réussie si elle :
1. ✅ Implémente les trois rôles utilisateur avec un contrôle d'accès approprié
2. ✅ Fournit des opérations CRUD complètes pour toutes les entités
3. ✅ Inclut une validation de données complète sur le frontend et le backend
4. ✅ Génère des statistiques et des rapports significatifs
5. ✅ Offre une interface responsive et conviviale
6. ✅ Maintient l'intégrité des données par le biais de contraintes appropriées
7. ✅ Inclut une authentification et une autorisation appropriées
8. ✅ Suit les meilleures pratiques de technologie choisie
9. ✅ Inclut une documentation complète
10. ✅ Est déployable et maintenable

---

## Liste de Contrôle de Démarrage du Développement

- [ ] Configurer le projet Spring Boot avec les dépendances requises
- [ ] Configurer la base de données PostgreSQL
- [ ] Créer le schéma de base de données et les données de remplissage
- [ ] Configurer le projet Angular avec Tailwind CSS
- [ ] Configurer la communication API entre le frontend et le backend
- [ ] Implémenter le système d'authentification/connexion
- [ ] Construire les modules CRUD de base pour chaque entité
- [ ] Implémenter le contrôle d'accès basé sur les rôles
- [ ] Créer le tableau de bord de statistiques et de rapports
- [ ] Validation complète des formulaires
- [ ] Gestion des erreurs et retour utilisateur
- [ ] Tests et corrections de bogues
- [ ] Documentation et nettoyage du code
- [ ] Révision finale et préparation au déploiement

---

## Ressources et Références

**Spring Boot**
- Documentation Officielle Spring Boot: https://spring.io/projects/spring-boot
- Guide Spring Data JPA: https://spring.io/projects/spring-data-jpa
- Spring Security: https://spring.io/projects/spring-security

**Angular**
- Documentation Officielle Angular: https://angular.io/docs
- Meilleures Pratiques Angular: https://angular.io/guide/styleguide
- Formulaires Réactifs: https://angular.io/guide/reactive-forms

**Tailwind CSS**
- Documentation Tailwind CSS: https://tailwindcss.com/docs
- Composants Tailwind: https://tailwindui.com/

**Base de Données**
- Documentation PostgreSQL: https://www.postgresql.org/docs/
- Documentation Hibernate: https://hibernate.org/orm/documentation/

---

**Fin du Document de Spécification du Projet**