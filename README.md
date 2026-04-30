# Excellent Training : Training Management System - Complete Setup & Testing Guide

## Project Overview

A complete web application for managing professional training sessions at "Excellent Training" center. Built with Spring Boot 4.0.5 backend and Angular 17+ frontend.

**Stack**: Spring Boot + PostgreSQL + Angular + Tailwind CSS

---

## Quick Start (5 minutes)

### Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL 13+
- Node.js 18+ (for frontend)
- Git

### Backend Setup

#### 1. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user (you can replace postgres with your username, MP with your database name and the password and then configure the backend. see 2. bellow)
CREATE DATABASE MP;
CREATE USER postgres WITH PASSWORD '123123';
ALTER ROLE postgres SET client_encoding TO 'utf8';
ALTER ROLE postgres SET default_transaction_isolation TO 'read committed';
ALTER ROLE postgres SET default_transaction_deferrable TO on;
ALTER ROLE postgres SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE MP TO postgres;
\q
```

#### 2. Clone and Configure Backend

```bash
# Update application.properties with your database credentials
# you can replace postgres, MP and the password with yours
# File: src/main/resources/application.properties
#spring.datasource.url=jdbc:postgresql://localhost:5432/MP
# spring.datasource.username=postgres
# spring.datasource.password=123123
```

#### 3. Build Backend

```bash
mvn clean install -DskipTests
```

#### 4. Run Backend

```bash
mvn spring-boot:run
```

Backend runs on: **http://localhost:8080/api**
Swagger UI: **http://localhost:8080/api/swagger-ui.html**

---
## Architecture Backend

```
training-app/
├── backend/
│   ├── src/main/java/com/excellenttraining/
│   │   ├── domain/
│   │   │   ├── entity/           # JPA Entities
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   └── repository/       # Spring Data Repositories
│   │   ├── service/              # Business Logic Services
│   │   ├── web/controller/       # REST Controllers
│   │   ├── security/             # Security Configuration & JWT
│   │   └── TrainingManagementApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/                      # Angular application
├── docs/                          # Documentation
└── README.md
```

### Frontend Setup

The frontend is an Angular 21 single-page application that consumes the Spring Boot REST API.

#### 1. Install dependencies !!

```bash
cd FrontAngular
npm install
```

#### 2. Run the dev server

```bash
ng serve
```

App runs on: **http://localhost:4200**

#### 3. Production build

```bash
ng build
```

Artifacts are emitted to `dist/`.


## 🎨 Frontend Overview

### Stack
- **Angular 21** (standalone components, signals, new control flow)
- **TypeScript 5.9**
- **Tailwind CSS 4** for styling
- **Chart.js 4** for the statistics dashboard
- **RxJS 7.8** for HTTP and reactive flows

### Architecture Frontend

```
FrontAngular/src/app/
├── app.routes.ts              # Root router (role-guarded zones)
├── app.config.ts              # Standalone bootstrap providers
├── auth/
│   └── components/
│       ├── login/             # JWT login screen
│       ├── user-management/   # Admin: create users
│       └── unauthorized/      # 403 page
├── components/
│   ├── home/                  # Landing/home dashboard
│   ├── admin/
│   │   ├── manage-users/      # Activate/deactivate, reset password, change role
│   │   └── configurations/    # Reference data (domaines, structures, profils, employeurs)
│   ├── user/
│   │   ├── manage-formation/  # Training sessions: list, create, details, enroll
│   │   ├── manage-formateur/  # Trainers (interne / externe)
│   │   └── manage-participants/ # Trainees + profile view
│   └── responsable/
│       ├── dashboard/         # KPI + charts (Chart.js)
│       ├── kpi-card/
│       └── chart-canvas/
├── core/
│   ├── config/                # Menu config, settings (API base URL)
│   ├── guards/                # AuthGuard, RoleGuard
│   ├── interceptors/          # JWT bearer + 401 refresh
│   └── services/              # AuthService, FormationService, ParticipantService, etc.
├── models/                    # DTO interfaces matching backend
└── shared/components/         # Layout, contact form, reusable widgets
```

### Routing & Role Zones

The router enforces three role-based zones via `RoleGuard` (`src/app/app.routes.ts`):

| Path prefix    | Allowed roles                                     | Purpose                                          |
|----------------|---------------------------------------------------|--------------------------------------------------|
| `/auth/login`  | Public                                            | Login                                            |
| `/user/**`     | `SIMPLE_UTILISATEUR`, `RESPONSABLE`, `ADMINISTRATEUR` | Trainings, trainers, participants            |
| `/manager/**`  | `RESPONSABLE`, `ADMINISTRATEUR`                   | Statistics dashboard, reports                    |
| `/admin/**`    | `ADMINISTRATEUR`                                  | User management, reference data, configurations  |
| `/unauthorized`| Public                                            | 403 fallback                                     |

### Authentication Flow
1. `Login` posts to `POST /api/auth/login` and stores `token` + `refreshToken`.
2. The HTTP interceptor attaches `Authorization: Bearer <token>` to every request.
3. On 401, the interceptor calls `POST /api/auth/refresh` and retries.
4. `AuthGuard` blocks unauthenticated access; `RoleGuard` checks the JWT role claim against the route's `data.roles`.

---

## Database Setup

### Initialize Database Schema

Create file: `schema.sql` — generated from the pgAdmin 4 ERD tool. Tables are created first, then foreign keys + supporting indexes are applied. Safe to re-run thanks to `IF NOT EXISTS` guards.

```sql
-- This script was generated by the ERD tool in pgAdmin 4.
BEGIN;

CREATE TABLE IF NOT EXISTS public.domaine
(
    id bigserial NOT NULL,
    libelle character varying(100) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    CONSTRAINT domaine_pkey PRIMARY KEY (id),
    CONSTRAINT domaine_libelle_key UNIQUE (libelle)
);

CREATE TABLE IF NOT EXISTS public.employeur
(
    id bigserial NOT NULL,
    nomemployeur character varying(150) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT employeur_pkey PRIMARY KEY (id),
    CONSTRAINT employeur_nomemployeur_key UNIQUE (nomemployeur)
);

CREATE TABLE IF NOT EXISTS public.formateur
(
    id bigserial NOT NULL,
    nom character varying(100) COLLATE pg_catalog."default" NOT NULL,
    prenom character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(150) COLLATE pg_catalog."default" NOT NULL,
    tel character varying(20) COLLATE pg_catalog."default",
    type character varying(20) COLLATE pg_catalog."default" NOT NULL,
    id_employeur bigint,
    specialite character varying(255) COLLATE pg_catalog."default",
    bio text COLLATE pg_catalog."default",
    CONSTRAINT formateur_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.formation
(
    id bigserial NOT NULL,
    titre character varying(200) COLLATE pg_catalog."default" NOT NULL,
    annee integer NOT NULL,
    duree integer NOT NULL,
    id_domaine bigint NOT NULL,
    budget double precision NOT NULL,
    id_formateur bigint NOT NULL,
    lieu character varying(150) COLLATE pg_catalog."default",
    date_debut date NOT NULL,
    date_fin date NOT NULL,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(20) COLLATE pg_catalog."default" DEFAULT 'PLANIFIEE'::character varying,
    description text COLLATE pg_catalog."default",
    CONSTRAINT formation_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.participant
(
    id bigserial NOT NULL,
    nom character varying(100) COLLATE pg_catalog."default" NOT NULL,
    prenom character varying(100) COLLATE pg_catalog."default" NOT NULL,
    id_structure bigint NOT NULL,
    id_profil bigint NOT NULL,
    email character varying(150) COLLATE pg_catalog."default" NOT NULL,
    tel character varying(20) COLLATE pg_catalog."default",
    date_embauche timestamp without time zone,
    actif boolean DEFAULT true,
    CONSTRAINT participant_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.participant_formation
(
    id_participant bigint NOT NULL,
    id_formation bigint NOT NULL,
    date_inscription timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut_participation character varying(20) COLLATE pg_catalog."default" DEFAULT 'INSCRIT'::character varying,
    CONSTRAINT participant_formation_pkey PRIMARY KEY (id_participant, id_formation)
);

CREATE TABLE IF NOT EXISTS public.profil
(
    id bigserial NOT NULL,
    libelle character varying(150) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    CONSTRAINT profil_pkey PRIMARY KEY (id),
    CONSTRAINT profil_libelle_key UNIQUE (libelle)
);

CREATE TABLE IF NOT EXISTS public.role
(
    id bigserial NOT NULL,
    nom character varying(50) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT role_pkey PRIMARY KEY (id),
    CONSTRAINT role_nom_key UNIQUE (nom)
);

CREATE TABLE IF NOT EXISTS public.structure
(
    id bigserial NOT NULL,
    libelle character varying(100) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    lieu character varying(150) COLLATE pg_catalog."default",
    CONSTRAINT structure_pkey PRIMARY KEY (id),
    CONSTRAINT structure_libelle_key UNIQUE (libelle)
);

CREATE TABLE IF NOT EXISTS public.utilisateur
(
    id bigserial NOT NULL,
    login character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id_role bigint NOT NULL,
    actif boolean DEFAULT true,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT utilisateur_pkey PRIMARY KEY (id),
    CONSTRAINT utilisateur_login_key UNIQUE (login)
);

-- ---------------------------------------------------------------------------
-- Foreign keys + indexes
-- ---------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.formateur
    ADD CONSTRAINT formateur_id_employeur_fkey FOREIGN KEY (id_employeur)
    REFERENCES public.employeur (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.formation
    ADD CONSTRAINT formation_id_domaine_fkey FOREIGN KEY (id_domaine)
    REFERENCES public.domaine (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;
CREATE INDEX IF NOT EXISTS idx_formation_domaine
    ON public.formation(id_domaine);

ALTER TABLE IF EXISTS public.formation
    ADD CONSTRAINT formation_id_formateur_fkey FOREIGN KEY (id_formateur)
    REFERENCES public.formateur (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;
CREATE INDEX IF NOT EXISTS idx_formation_formateur
    ON public.formation(id_formateur);

ALTER TABLE IF EXISTS public.participant
    ADD CONSTRAINT participant_id_profil_fkey FOREIGN KEY (id_profil)
    REFERENCES public.profil (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.participant
    ADD CONSTRAINT participant_id_structure_fkey FOREIGN KEY (id_structure)
    REFERENCES public.structure (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;
CREATE INDEX IF NOT EXISTS idx_participant_structure
    ON public.participant(id_structure);

ALTER TABLE IF EXISTS public.participant_formation
    ADD CONSTRAINT participant_formation_id_formation_fkey FOREIGN KEY (id_formation)
    REFERENCES public.formation (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;
CREATE INDEX IF NOT EXISTS idx_participant_formation
    ON public.participant_formation(id_formation);

ALTER TABLE IF EXISTS public.participant_formation
    ADD CONSTRAINT participant_formation_id_participant_fkey FOREIGN KEY (id_participant)
    REFERENCES public.participant (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.utilisateur
    ADD CONSTRAINT utilisateur_id_role_fkey FOREIGN KEY (id_role)
    REFERENCES public.role (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

END;
```

#### Load Initial Data (Seed Script)

The full seed script lives at `Backend_MP/src/main/resources/seed.sql`. It is **idempotent** (TRUNCATE + RESTART IDENTITY) and produces a multi-year dataset spanning **2021 → 2026 (Q2)** so the statistics dashboards have meaningful history.

**Volumes produced:**
- 3 roles, 10 domaines, 10 profils, 8 structures, 8 employeurs
- 25 formateurs (15 internes + 10 externes)
- 15 utilisateurs
- 100 participants (generated via `generate_series`)
- ~90 formations spread across 5+ years, with realistic statuses (`COMPLETEE`, `EN_COURS`, `PLANIFIEE`, `ANNULEE`)
- ~720 enrollments in `participant_formation` with statuses `PRESENT` / `ABSENT` / `ANNULE` / `INSCRIT`
<details>
  <summary> Click to view the full SQL Script</summary>

```sql
-- =============================================================================
-- Seed data for the formation-management database.
-- Spans 2021 -> 2026 (Q2) to feed multi-year statistics dashboards.
-- Idempotent: TRUNCATE + RESTART IDENTITY at the top.
-- =============================================================================
BEGIN;

TRUNCATE TABLE
    public.participant_formation,
    public.participant,
    public.formation,
    public.formateur,
    public.utilisateur,
    public.role,
    public.profil,
    public.structure,
    public.domaine,
    public.employeur
RESTART IDENTITY CASCADE;

-- =============================================================================
-- 1. ROLES
-- =============================================================================
INSERT INTO public.role (nom, description) VALUES
('SIMPLE_UTILISATEUR', 'Administrateur du système'),
('ADMINISTRATEUR', 'Administrateur du système'),
('RESPONSABLE',    'Responsable des formations');

-- =============================================================================
-- 2. DOMAINES
-- =============================================================================
INSERT INTO public.domaine (libelle, description) VALUES
('Informatique',              'Développement, infrastructure, cybersécurité'),
('Management',                'Leadership et gestion d''équipe'),
('Langues étrangères',        'Anglais, français, allemand'),
('Finance',                   'Comptabilité, contrôle de gestion, audit'),
('Ressources Humaines',       'Gestion du personnel, droit du travail'),
('Marketing & Communication', 'Stratégie marketing et communication'),
('Qualité',                   'Normes ISO, amélioration continue'),
('Sécurité au travail',       'HSE, prévention des risques'),
('Juridique',                 'Droit des affaires, contrats'),
('Soft Skills',               'Communication, négociation, gestion du temps');

-- =============================================================================
-- 3. PROFILS
-- =============================================================================
INSERT INTO public.profil (libelle, description) VALUES
('Ingénieur',              'Profil ingénieur'),
('Technicien supérieur',   'Profil technique'),
('Cadre',                  'Cadre administratif'),
('Manager',                'Manager d''équipe'),
('Directeur',              'Directeur de département'),
('Assistant administratif','Support administratif'),
('Comptable',              'Service comptabilité'),
('Commercial',             'Force de vente'),
('Chef de projet',         'Pilotage de projets'),
('Ouvrier qualifié',       'Atelier / production');

-- =============================================================================
-- 4. STRUCTURES
-- =============================================================================
INSERT INTO public.structure (libelle, description, lieu) VALUES
('DSI',                'Direction des Systèmes d''Information', 'Tunis'),
('DRH',                'Direction des Ressources Humaines',     'Tunis'),
('DAF',                'Direction Administrative et Financière','Tunis'),
('Marketing',          'Direction Marketing',                   'Tunis'),
('Production',         'Direction de Production',               'Sfax'),
('Commercial',         'Direction Commerciale',                 'Sousse'),
('Direction Générale', 'Direction Générale',                    'Tunis'),
('R&D',                'Recherche et Développement',            'Tunis');

-- =============================================================================
-- 5. EMPLOYEURS (organismes externes)
-- =============================================================================
INSERT INTO public.employeur (nomemployeur) VALUES
('ITCenter Tunisie'),
('Cegos Tunisie'),
('Demos'),
('IFPC'),
('Indépendant'),
('Centre des Études Juridiques'),
('ISGB Formation'),
('ENIT Consulting');

-- =============================================================================
-- 6. FORMATEURS (15 internes + 10 externes)
-- =============================================================================
INSERT INTO public.formateur (nom, prenom, email, tel, type, id_employeur, specialite, bio) VALUES
-- Internes (id_employeur NULL)
('Ben Salah',  'Mohamed', 'mohamed.bensalah@entreprise.tn',  '+216 71 234 001', 'INTERNE', NULL, 'Java / Spring Boot',         'Tech lead backend, 12 ans d''expérience.'),
('Trabelsi',   'Salma',   'salma.trabelsi@entreprise.tn',    '+216 71 234 002', 'INTERNE', NULL, 'Angular / TypeScript',       'Architecte front-end senior.'),
('Bouazizi',   'Karim',   'karim.bouazizi@entreprise.tn',    '+216 71 234 003', 'INTERNE', NULL, 'DevOps / Kubernetes',        'Expert infrastructure cloud.'),
('Hamdi',      'Amira',   'amira.hamdi@entreprise.tn',       '+216 71 234 004', 'INTERNE', NULL, 'Cybersécurité',              'Responsable sécurité SI.'),
('Mejri',      'Sami',    'sami.mejri@entreprise.tn',        '+216 71 234 005', 'INTERNE', NULL, 'Management de projet',       'PMP certifié, 15 ans en pilotage.'),
('Khelifi',    'Nadia',   'nadia.khelifi@entreprise.tn',     '+216 71 234 006', 'INTERNE', NULL, 'Communication interne',      'Coach en communication.'),
('Bouzid',     'Ahmed',   'ahmed.bouzid@entreprise.tn',      '+216 71 234 007', 'INTERNE', NULL, 'Contrôle de gestion',        'Expert finance d''entreprise.'),
('Gharbi',     'Imen',    'imen.gharbi@entreprise.tn',       '+216 71 234 008', 'INTERNE', NULL, 'Droit du travail',           'Juriste RH.'),
('Sassi',      'Wassim',  'wassim.sassi@entreprise.tn',      '+216 71 234 009', 'INTERNE', NULL, 'Qualité ISO 9001',           'Auditeur qualité interne.'),
('Jouini',     'Olfa',    'olfa.jouini@entreprise.tn',       '+216 71 234 010', 'INTERNE', NULL, 'HSE',                        'Responsable hygiène et sécurité.'),
('Mansour',    'Mehdi',   'mehdi.mansour@entreprise.tn',     '+216 71 234 011', 'INTERNE', NULL, 'Data Science',               'Data scientist, ML.'),
('Karoui',     'Rania',   'rania.karoui@entreprise.tn',      '+216 71 234 012', 'INTERNE', NULL, 'Marketing digital',          'Spécialiste SEO/SEA.'),
('Belhaj',     'Anis',    'anis.belhaj@entreprise.tn',       '+216 71 234 013', 'INTERNE', NULL, 'Bases de données Oracle',    'DBA senior.'),
('Saidi',      'Hela',    'hela.saidi@entreprise.tn',        '+216 71 234 014', 'INTERNE', NULL, 'Soft skills',                'Formatrice en développement personnel.'),
('Brahmi',     'Youssef', 'youssef.brahmi@entreprise.tn',    '+216 71 234 015', 'INTERNE', NULL, 'Architecture logicielle',    'Architecte solutions.'),
-- Externes
('Ferchichi',  'Nizar',   'nizar.ferchichi@itcenter.tn',     '+216 71 555 001', 'EXTERNE', 1,    'Microsoft Azure',            'Consultant Azure certifié.'),
('Naceur',     'Sonia',   'sonia.naceur@cegos.tn',           '+216 71 555 002', 'EXTERNE', 2,    'Leadership',                 'Coach exécutif Cegos.'),
('Riahi',      'Walid',   'walid.riahi@demos.com',           '+216 71 555 003', 'EXTERNE', 3,    'Anglais professionnel',      'Formateur langues 10+ ans.'),
('Ayadi',      'Fatma',   'fatma.ayadi@ifpc.tn',             '+216 71 555 004', 'EXTERNE', 4,    'Comptabilité IFRS',          'Expert-comptable IFPC.'),
('Chaouch',    'Rami',    'rami.chaouch@indep.tn',           '+216 71 555 005', 'EXTERNE', 5,    'Agile / Scrum',              'Scrum Master indépendant.'),
('Zouari',     'Asma',    'asma.zouari@cej.tn',              '+216 71 555 006', 'EXTERNE', 6,    'Droit des contrats',         'Avocate d''affaires.'),
('Tlili',      'Bilel',   'bilel.tlili@isgb.tn',             '+216 71 555 007', 'EXTERNE', 7,    'Marketing stratégique',      'Professeur marketing ISGB.'),
('Cherif',     'Leila',   'leila.cherif@enit-c.tn',          '+216 71 555 008', 'EXTERNE', 8,    'Lean Six Sigma',             'Black belt Lean.'),
('Khlifi',     'Hamza',   'hamza.khlifi@itcenter.tn',        '+216 71 555 009', 'EXTERNE', 1,    'Cybersécurité offensive',    'Pentester certifié OSCP.'),
('Mahmoudi',   'Yosra',   'yosra.mahmoudi@cegos.tn',         '+216 71 555 010', 'EXTERNE', 2,    'Gestion du changement',      'Consultante change management.');

-- =============================================================================
-- 7. PARTICIPANTS (100 personnes)
-- =============================================================================
INSERT INTO public.participant (nom, prenom, email, tel, id_structure, id_profil, date_embauche, actif)
SELECT
    (ARRAY['Ben Salah','Trabelsi','Bouazizi','Hamdi','Mejri','Khelifi','Bouzid','Gharbi','Sassi','Jouini',
           'Mansour','Karoui','Belhaj','Saidi','Brahmi','Ferchichi','Naceur','Riahi','Ayadi','Chaouch',
           'Zouari','Tlili','Cherif','Khlifi','Mahmoudi','Aouini','Bahri','Chebbi','Daoud','Ennaifer',
           'Frikha','Guesmi','Hammami','Ibrahimi','Jaballi','Kefi','Lamine','Mestiri','Najjar','Ouali'])[1 + (gs % 40)],
    (ARRAY['Mohamed','Ahmed','Ali','Sami','Karim','Youssef','Mehdi','Wassim','Nizar','Anis',
           'Salma','Amira','Fatma','Asma','Nadia','Rania','Sonia','Imen','Hela','Olfa',
           'Walid','Bilel','Hamza','Rami','Bassem','Khaled','Slim','Foued','Tarek','Marwen',
           'Ines','Yasmine','Sarra','Mariem','Sirine','Cyrine','Dorra','Leila','Houda','Najla'])[1 + ((gs * 7) % 40)],
    'p' || gs || '.user@entreprise.tn',
    '+216 ' || (20 + (gs % 80))::text || ' ' || LPAD(((gs * 13) % 1000)::text, 3, '0') || ' ' || LPAD(((gs * 17 + 100) % 1000)::text, 3, '0'),
    1 + (gs % 8),
    1 + ((gs * 3) % 10),
    DATE '2010-01-01' + ((gs * 137) % 5400) * INTERVAL '1 day',
    (gs % 25) <> 0
FROM generate_series(1, 100) AS gs;

-- =============================================================================
-- 8. FORMATIONS (~90 sessions, étalées sur 2021-01 -> 2026-06)
-- =============================================================================
WITH titres AS (
    SELECT * FROM (VALUES
        (1,  'Spring Boot avancé',                          1),
        (2,  'Angular en profondeur',                       1),
        (3,  'Docker & Kubernetes',                         1),
        (4,  'Sécurité applicative OWASP',                  1),
        (5,  'PostgreSQL pour développeurs',                1),
        (6,  'Initiation à la Data Science',                1),
        (7,  'Git & DevOps quotidien',                      1),
        (8,  'Architecture microservices',                  1),
        (9,  'Tests automatisés (JUnit, Cypress)',          1),
        (10, 'Cloud Azure fondamentaux',                    1),
        (11, 'Leadership et management d''équipe',          2),
        (12, 'Conduite du changement',                      2),
        (13, 'Gestion de projet PMI',                       2),
        (14, 'Agile / Scrum Master',                        2),
        (15, 'Prise de parole en public',                   2),
        (16, 'Anglais professionnel B2',                    3),
        (17, 'Anglais technique IT',                        3),
        (18, 'Français écrit professionnel',                3),
        (19, 'Allemand débutant',                           3),
        (20, 'Comptabilité générale',                       4),
        (21, 'Contrôle de gestion',                         4),
        (22, 'Normes IFRS',                                 4),
        (23, 'Audit interne',                               4),
        (24, 'Recrutement et entretien',                    5),
        (25, 'Droit du travail tunisien',                   5),
        (26, 'GPEC et plan de formation',                   5),
        (27, 'Marketing digital',                           6),
        (28, 'SEO / SEA fondamentaux',                      6),
        (29, 'Communication de crise',                      6),
        (30, 'Stratégie de marque',                         6),
        (31, 'ISO 9001 - mise en oeuvre',                   7),
        (32, 'Lean Six Sigma Yellow Belt',                  7),
        (33, 'Amélioration continue Kaizen',                7),
        (34, 'HSE - prévention des risques',                8),
        (35, 'Sécurité incendie',                           8),
        (36, 'Premiers secours au travail',                 8),
        (37, 'Droit des contrats',                          9),
        (38, 'RGPD et protection des données',              9),
        (39, 'Gestion du temps et priorités',               10),
        (40, 'Négociation commerciale',                     10),
        (41, 'Intelligence émotionnelle',                   10),
        (42, 'Travail collaboratif et soft skills',         10)
    ) AS t(idx, titre, id_domaine)
),
sessions AS (
    SELECT
        gs                                                                          AS sess,
        DATE '2021-01-12' + ((gs - 1) * 22) * INTERVAL '1 day'                      AS date_debut,
        2 + ((gs * 5) % 9)                                                          AS duree,
        1500 + ((gs * 137) % 14000)                                                 AS budget,
        1 + ((gs - 1) % 25)                                                         AS id_formateur,
        (ARRAY['Tunis - siège','Tunis - Lac 2','Sousse','Sfax','Visioconférence','Hammamet','Bizerte'])[1 + (gs % 7)] AS lieu,
        1 + ((gs - 1) % 42)                                                         AS titre_idx
    FROM generate_series(1, 90) AS gs
)
INSERT INTO public.formation
    (titre, annee, duree, id_domaine, budget, id_formateur, lieu, date_debut, date_fin, date_creation, statut, description)
SELECT
    t.titre || ' - S' || s.sess,
    EXTRACT(YEAR FROM s.date_debut)::int,
    s.duree,
    t.id_domaine,
    s.budget::double precision,
    s.id_formateur,
    s.lieu,
    s.date_debut::date,
    (s.date_debut + (s.duree - 1) * INTERVAL '1 day')::date,
    (s.date_debut - INTERVAL '45 days')::timestamp,
    CASE
        WHEN s.date_debut + (s.duree - 1) * INTERVAL '1 day' < DATE '2026-04-29' THEN 'COMPLETEE'
        WHEN s.date_debut <= DATE '2026-04-29'                                    THEN 'EN_COURS'
        ELSE 'PLANIFIEE'
    END,
    'Session ' || s.sess || ' - ' || t.titre || '. Animée par le formateur #' || s.id_formateur || '.'
FROM sessions s
JOIN titres t ON t.idx = s.titre_idx;

-- Bonus: quelques formations annulées pour la stat "statut"
UPDATE public.formation
SET statut = 'ANNULEE'
WHERE id IN (7, 23, 41, 58, 71);

-- =============================================================================
-- 9. PARTICIPANT_FORMATION (inscriptions)
-- =============================================================================
-- Sélection pseudo-aléatoire (~8%) -> ~720 inscriptions, ~8/formation en moyenne.
INSERT INTO public.participant_formation
    (id_participant, id_formation, date_inscription, statut_participation)
SELECT
    p.id,
    f.id,
    (f.date_debut - INTERVAL '20 days')::timestamp,
    CASE
        WHEN f.statut = 'ANNULEE'                                  THEN 'ANNULE'
        WHEN f.statut IN ('PLANIFIEE','EN_COURS')                  THEN 'INSCRIT'
        ELSE (ARRAY['PRESENT','PRESENT','PRESENT','PRESENT','PRESENT','PRESENT','PRESENT','ABSENT','ANNULE','PRESENT'])
             [1 + ((p.id * 31 + f.id * 17) % 10)]
    END
FROM public.formation f
CROSS JOIN public.participant p
WHERE ((p.id * 7 + f.id * 13 + (p.id_structure * 11)) % 100) < 9
  AND p.actif = true;

-- =============================================================================
-- 10. Synchronisation des séquences (sécurité au cas où)
-- =============================================================================
SELECT setval(pg_get_serial_sequence('public.role',         'id'), COALESCE(MAX(id),1)) FROM public.role;
SELECT setval(pg_get_serial_sequence('public.domaine',      'id'), COALESCE(MAX(id),1)) FROM public.domaine;
SELECT setval(pg_get_serial_sequence('public.profil',       'id'), COALESCE(MAX(id),1)) FROM public.profil;
SELECT setval(pg_get_serial_sequence('public.structure',    'id'), COALESCE(MAX(id),1)) FROM public.structure;
SELECT setval(pg_get_serial_sequence('public.employeur',    'id'), COALESCE(MAX(id),1)) FROM public.employeur;
SELECT setval(pg_get_serial_sequence('public.formateur',    'id'), COALESCE(MAX(id),1)) FROM public.formateur;
SELECT setval(pg_get_serial_sequence('public.participant',  'id'), COALESCE(MAX(id),1)) FROM public.participant;
SELECT setval(pg_get_serial_sequence('public.formation',    'id'), COALESCE(MAX(id),1)) FROM public.formation;

COMMIT;
```

**Verify volumes:**
```sql
SELECT 'role' AS table_, COUNT(*) FROM public.role
UNION ALL SELECT 'domaine',              COUNT(*) FROM public.domaine
UNION ALL SELECT 'profil',               COUNT(*) FROM public.profil
UNION ALL SELECT 'structure',            COUNT(*) FROM public.structure
UNION ALL SELECT 'employeur',            COUNT(*) FROM public.employeur
UNION ALL SELECT 'formateur',            COUNT(*) FROM public.formateur
UNION ALL SELECT 'utilisateur',          COUNT(*) FROM public.utilisateur
UNION ALL SELECT 'participant',          COUNT(*) FROM public.participant
UNION ALL SELECT 'formation',            COUNT(*) FROM public.formation
UNION ALL SELECT 'participant_formation',COUNT(*) FROM public.participant_formation;
```


</details>

---
## Testing the Application

### Using Postman

#### 1. Login and Get Token

**Mandatory** 
### 1. Create the admin user

**Request:**
```
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "login": "admin",
  "password": "admin123",
  "passwordConfirm": "admin123",
  "roleId": 1
}
```

### 2. Create the basic user

**Request:**
```
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "login": "user1",
  "password": "password123",
  "passwordConfirm": "password123",
  "roleId": 3
}
```

### 3. Create the manager user

**Request:**
```
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "login": "manager1",
  "password": "password123",
  "passwordConfirm": "password123",
  "roleId": 2
}
```


**Request:**
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "login": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "id": 1,
  "login": "admin",
  "role": "ADMINISTRATEUR",
  "actif": true,
  "type": "Bearer"
}
```

#### 2. Create Formateur (Trainer)

**Request:**
```
POST http://localhost:8080/api/formateurs
Authorization: Bearer {token}
Content-Type: application/json

{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "tel": "+21698765432",
  "type": "interne",
  "specialite": "Java Development",
  "bio": "Experienced Java developer with 10 years experience"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "tel": "+21698765432",
  "type": "interne",
  "employeurId": null,
  "employeurNom": null,
  "specialite": "Java Development",
  "bio": "Experienced Java developer with 10 years experience"
}
```

#### 3. Get All Formateurs

**Request:**
```
GET http://localhost:8080/api/formateurs
Authorization: Bearer {token}
```

#### 4. Update Formateur

**Request:**
```
PUT http://localhost:8080/api/formateurs/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "nom": "Dupont",
  "prenom": "Jean-Pierre",
  "email": "jp.dupont@example.com",
  "tel": "+21698765432",
  "type": "interne",
  "specialite": "Spring Boot Development",
  "bio": "Expert in Spring Boot and microservices"
}
```

#### 5. Delete Formateur

**Request:**
```
DELETE http://localhost:8080/api/formateurs/1
Authorization: Bearer {token}
```

---

## 🧬 Curl Command Examples

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "admin",
    "password": "admin123"
  }'
```

### Create Formateur
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:8080/api/formateurs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "tel": "+21698765432",
    "type": "interne",
    "specialite": "Java Development",
    "bio": "10 years experience"
  }'
```

### Get All Formateurs
```bash
curl -X GET http://localhost:8080/api/formateurs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Filter by Type
```bash
curl -X GET http://localhost:8080/api/formateurs/type/interne \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔒 Security Features Implemented

**JWT Authentication**: Token-based stateless authentication
**Password Encryption**: BCrypt for secure password hashing
**Role-Based Access Control (RBAC)**: Three-tier role system
**Method-Level Security**: @PreAuthorize annotations
**CORS Configuration**: Configurable cross-origin requests
**CSRF Protection**: Built-in Spring Security CSRF tokens
**Input Validation**: Bean validation and custom validators
**Exception Handling**: Global exception handler

---





## 🛠️ Creating the Default Credentials via Postman

If your database does not yet contain the test users (e.g. you skipped `seed.sql` or are running against a fresh schema), you can create them by hitting the public `POST /api/auth/signup` endpoint from Postman.

> The signup endpoint takes a numeric `roleId` that must match a row in the `role` table. After running `schema.sql`, insert the roles first (or run `seed.sql` which populates them):
> `1 = SIMPLE_UTILISATEUR`, `2 = ADMINISTRATEUR`, `3 = RESPONSABLE`. Adjust the IDs below if your `role` table uses different values.

<<<<<<< HEAD
### 1. Create the admin user

**Request:**
```
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "login": "admin",
  "password": "admin123",
  "passwordConfirm": "admin123",
  "roleId": 2
}
```

### 2. Create the basic user

**Request:**
```
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "login": "user1",
  "password": "password123",
  "passwordConfirm": "password123",
  "roleId": 1
}
```

### 3. Create the manager user

**Request:**
```
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "login": "manager1",
  "password": "password123",
  "passwordConfirm": "password123",
  "roleId": 3
}
```

=======
>>>>>>> 3ef86eab2ee9c3f315a78ca86d8e8879ccbd038f
### Postman setup tips

- Set the request method to **POST** and the URL to `http://localhost:8080/api/auth/signup`.
- In the **Headers** tab, add `Content-Type: application/json`.
- In the **Body** tab, choose **raw** + **JSON** and paste one of the payloads above.
- A successful call returns **201 Created** with the new user's ID and login. You can then call `POST /api/auth/login` with the same credentials to get a JWT.
- Login rules: 3–100 chars, only `[a-zA-Z0-9._-]`. Password must be ≥ 8 chars and match `passwordConfirm`.
- If you get **409 Conflict**, the login already exists — use `GET /api/auth/check-availability/{login}` to verify before retrying.

---

## 🔑 Default Test Credentials

| User | Password | Role | Purpose |
|------|----------|------|---------|
| admin | admin123 | ADMINISTRATEUR | Full system access |
| user1 | password123 | SIMPLE_UTILISATEUR | Basic CRUD operations |
| manager1 | password123 | RESPONSABLE | Reporting & Statistics |

---

## 🐛 Troubleshooting

### Issue: "Connection refused" for PostgreSQL

**Solution:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

### Issue: "jwt.secret" is too short

**Solution:**
Update `application.properties`:
```properties
app.security.jwt.secret=your-very-long-secret-key-min-32-characters-required-for-security
```

### Issue: Token validation fails

**Verify:**
- JWT secret matches in generation and validation
- Token hasn't expired
- Bearer prefix is included in Authorization header
- User exists and is active

### Issue: CORS errors in browser

**Solution:**
Update `application.properties`:
```properties
app.cors.allowed-origins=http://localhost:4200,http://localhost:3000
```

---

## API Endpoints Reference

Complete reference generated from the backend OpenAPI spec (`/v3/api-docs`). All endpoints are prefixed with `http://localhost:8080` and — except `/api/auth/**` — require a `Bearer <jwt>` header.

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/login`                       | Authenticate, returns `AuthResponse` (token + refreshToken + role) |
| POST   | `/api/auth/refresh?refreshToken=...`    | Exchange refresh token for a new JWT |
| POST   | `/api/auth/signup`                      | Register a new user (`SignUpRequest`) |
| GET    | `/api/auth/check-availability/{login}`  | Check if a login is available |
| GET    | `/api/auth/health`                      | Service health probe |

### User Management (`/api/utilisateurs`) — *Admin only*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/utilisateurs`                            | List all users |
| GET    | `/api/utilisateurs/{id}`                       | Get user by ID |
| DELETE | `/api/utilisateurs/{id}`                       | Delete user |
| GET    | `/api/utilisateurs/login/{login}`              | Get user by login |
| GET    | `/api/utilisateurs/check-login/{login}`        | Login existence check |
| GET    | `/api/utilisateurs/role/{roleName}`            | List users by role |
| GET    | `/api/utilisateurs/status/active`              | List active users |
| GET    | `/api/utilisateurs/status/inactive`            | List inactive users |
| POST   | `/api/utilisateurs/{id}/activate`              | Activate user |
| POST   | `/api/utilisateurs/{id}/deactivate`            | Deactivate user |
| POST   | `/api/utilisateurs/{id}/reset-password`        | Reset password (body: `{ "password": "..." }`) |
| PUT    | `/api/utilisateurs/{userId}/role/{roleId}`     | Change user role |

### Formations (`/api/formations`) — *Training Sessions*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/formations`                                       | List all training sessions |
| POST   | `/api/formations`                                       | Create training session (`FormationDTO`) |
| GET    | `/api/formations/{id}`                                  | Get formation by ID |
| PUT    | `/api/formations/{id}`                                  | Update formation |
| DELETE | `/api/formations/{id}`                                  | Delete formation |
| GET    | `/api/formations/year/{year}`                           | Filter by year |
| GET    | `/api/formations/status/{status}`                       | Filter by status (`PLANIFIEE`, `EN_COURS`, `TERMINEE`, `ANNULEE`) |
| GET    | `/api/formations/domain/{domaineId}`                    | Filter by domain |
| GET    | `/api/formations/formateur/{formateurId}`               | Filter by trainer |
| GET    | `/api/formations/daterange?startDate=&endDate=`         | Filter by date range (`yyyy-MM-dd`) |
| GET    | `/api/formations/count/domain/{domaineId}`              | Count formations in a domain |
| POST   | `/api/formations/{id}/participants/{participantId}`     | Enroll a participant |
| DELETE | `/api/formations/{id}/participants/{participantId}`     | Remove a participant |

### Formateurs (`/api/formateurs`) — *Trainers*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/formateurs`                  | List all trainers |
| POST   | `/api/formateurs`                  | Create trainer (interne / externe) |
| GET    | `/api/formateurs/{id}`             | Get trainer by ID |
| PUT    | `/api/formateurs/{id}`             | Update trainer |
| DELETE | `/api/formateurs/{id}`             | Delete trainer |
| GET    | `/api/formateurs/type/{type}`      | Filter by type (`interne` / `externe`) |

### Participants (`/api/participants`) — *Trainees*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/participants`                                | List all participants |
| POST   | `/api/participants`                                | Create participant |
| GET    | `/api/participants/{id}`                           | Get participant by ID |
| PUT    | `/api/participants/{id}`                           | Update participant |
| DELETE | `/api/participants/{id}`                           | Delete participant |
| GET    | `/api/participants/active`                         | List active participants |
| POST   | `/api/participants/{id}/deactivate`                | Deactivate participant |
| POST   | `/api/participants/{id}/reactivate`                | Reactivate participant |
| GET    | `/api/participants/structure/{structureId}`        | Filter by structure |
| GET    | `/api/participants/profil/{profilId}`              | Filter by profil |
| GET    | `/api/participants/formation/{formationId}`        | List participants enrolled in a formation |
| GET    | `/api/participants/count/structure/{structureId}`  | Count participants by structure |

### Reference Data (`/api/reference/**`)

CRUD endpoints for the four lookup tables. All four resources (`structures`, `profils`, `domaines`, `employeurs`) expose the same shape:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/reference/{resource}`         | List all |
| POST   | `/api/reference/{resource}`         | Create |
| GET    | `/api/reference/{resource}/{id}`    | Get by ID |
| PUT    | `/api/reference/{resource}/{id}`    | Update |
| DELETE | `/api/reference/{resource}/{id}`    | Delete |

Where `{resource}` is one of `structures`, `profils`, `domaines`, `employeurs`.

###Core DTOs

| DTO              | Notable fields |
|------------------|----------------|
| `AuthRequest`    | `login`, `password` |
| `AuthResponse`   | `token`, `refreshToken`, `type` (Bearer), `id`, `login`, `role`, `actif` |
| `SignUpRequest`  | `login` (3-100, `[a-zA-Z0-9._-]`), `password` (≥8), `passwordConfirm`, `roleId` |
| `UtilisateurDTO` | `id`, `login`, `roleId`, `roleName`, `actif`, `dateCreation`, `dateModification` |
| `FormationDTO`   | `id`, `titre`, `annee`, `duree`, `domaineId/Libelle`, `budget`, `formateurId/Nom`, `lieu`, `dateDebut`, `dateFin`, `statut`, `participantIds`, `nombreParticipants` |
| `FormateurDTO`   | `id`, `nom`, `prenom`, `email`, `tel`, `type`, `employeurId/Nom`, `specialite`, `bio` |
| `ParticipantDTO` | `id`, `nom`, `prenom`, `structureId/Libelle`, `profilId/Libelle`, `email`, `tel`, `dateEmbauche`, `actif` |
| `StructureDTO`   | `id`, `libelle`, `description`, `lieu`, `nombreParticipants` |
| `ProfilDTO`      | `id`, `libelle`, `description`, `nombreParticipants` |
| `DomaineDTO`     | `id`, `libelle`, `description`, `nombreFormations` |
| `EmployeurDTO`   | `id`, `nomEmployeur`, `nombreFormateurs` |

> The interactive Swagger UI is available at **http://localhost:8080/api/swagger-ui.html** once the backend is running.

---

## Deployment

### Docker Setup

**Dockerfile:**
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/training-management-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Build & Run:**
```bash
mvn clean package -DskipTests
docker build -t training-app .
docker run -p 8080:8080 -e SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/training_db training-app
```

---

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security JWT Guide](https://spring.io/blog/2015/01/12/the-login-page-configure-it-or-protect-it-and-why)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Swagger/OpenAPI Docs](http://localhost:8080/api/swagger-ui.html)


---

**Last Updated**: April 2026
**Version**: 1.0.0
