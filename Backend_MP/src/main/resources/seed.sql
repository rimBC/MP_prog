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
('ADMIN',         'Administrateur du système'),
('GESTIONNAIRE',  'Gestionnaire des formations'),
('FORMATEUR',     'Formateur interne'),
('CONSULTATION',  'Accès en lecture seule');

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
-- 7. UTILISATEURS
-- =============================================================================
-- Password hash: bcrypt of "password123" — replace with your own bootstrap admin
INSERT INTO public.utilisateur (login, password, id_role, actif, date_creation, date_modification) VALUES
('admin',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, true, '2021-01-01 08:00:00', '2025-01-15 10:00:00'),
('gestionnaire1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, true, '2021-01-10 08:00:00', '2024-06-20 14:30:00'),
('gestionnaire2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, true, '2022-03-01 09:00:00', '2025-02-10 09:15:00'),
('m.bensalah',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, true, '2021-02-01 08:00:00', '2024-09-01 11:00:00'),
('s.trabelsi',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, true, '2021-02-01 08:00:00', '2024-09-01 11:00:00'),
('k.bouazizi',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, true, '2021-04-15 08:00:00', '2025-01-05 16:20:00'),
('a.hamdi',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, true, '2021-05-10 08:00:00', '2024-12-01 10:00:00'),
('s.mejri',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, true, '2021-06-01 08:00:00', '2025-03-12 13:45:00'),
('n.khelifi',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, true, '2022-01-15 08:00:00', '2024-08-22 09:30:00'),
('a.bouzid',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, true, '2022-04-20 08:00:00', '2025-02-28 11:10:00'),
('rh.lecture',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4, true, '2022-06-01 09:00:00', '2025-01-20 14:00:00'),
('audit.lecture', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4, true, '2023-02-15 09:00:00', '2025-03-01 09:00:00'),
('ancien.user',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, false,'2021-03-01 08:00:00', '2023-11-15 17:00:00'),
('stagiaire.it',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4, true, '2024-09-01 08:00:00', '2025-04-01 10:00:00'),
('dg.read',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4, true, '2023-01-10 09:00:00', '2025-02-15 08:30:00');

-- =============================================================================
-- 8. PARTICIPANTS (100 personnes)
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
-- 9. FORMATIONS (~90 sessions, étalées sur 2021-01 -> 2026-06)
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
        WHEN s.date_debut + (s.duree - 1) * INTERVAL '1 day' < DATE '2026-04-29' THEN 'TERMINEE'
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
-- 10. PARTICIPANT_FORMATION (inscriptions)
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
-- 11. Synchronisation des séquences (sécurité au cas où)
-- =============================================================================
SELECT setval(pg_get_serial_sequence('public.role',         'id'), COALESCE(MAX(id),1)) FROM public.role;
SELECT setval(pg_get_serial_sequence('public.domaine',      'id'), COALESCE(MAX(id),1)) FROM public.domaine;
SELECT setval(pg_get_serial_sequence('public.profil',       'id'), COALESCE(MAX(id),1)) FROM public.profil;
SELECT setval(pg_get_serial_sequence('public.structure',    'id'), COALESCE(MAX(id),1)) FROM public.structure;
SELECT setval(pg_get_serial_sequence('public.employeur',    'id'), COALESCE(MAX(id),1)) FROM public.employeur;
SELECT setval(pg_get_serial_sequence('public.formateur',    'id'), COALESCE(MAX(id),1)) FROM public.formateur;
SELECT setval(pg_get_serial_sequence('public.utilisateur',  'id'), COALESCE(MAX(id),1)) FROM public.utilisateur;
SELECT setval(pg_get_serial_sequence('public.participant',  'id'), COALESCE(MAX(id),1)) FROM public.participant;
SELECT setval(pg_get_serial_sequence('public.formation',    'id'), COALESCE(MAX(id),1)) FROM public.formation;

COMMIT;

-- =============================================================================
-- Aperçu rapide des volumes (à exécuter après le COMMIT pour vérifier)
-- =============================================================================
-- SELECT 'role'                  AS table_, COUNT(*) FROM public.role
-- UNION ALL SELECT 'domaine',              COUNT(*) FROM public.domaine
-- UNION ALL SELECT 'profil',               COUNT(*) FROM public.profil
-- UNION ALL SELECT 'structure',            COUNT(*) FROM public.structure
-- UNION ALL SELECT 'employeur',            COUNT(*) FROM public.employeur
-- UNION ALL SELECT 'formateur',            COUNT(*) FROM public.formateur
-- UNION ALL SELECT 'utilisateur',          COUNT(*) FROM public.utilisateur
-- UNION ALL SELECT 'participant',          COUNT(*) FROM public.participant
-- UNION ALL SELECT 'formation',            COUNT(*) FROM public.formation
-- UNION ALL SELECT 'participant_formation',COUNT(*) FROM public.participant_formation;
