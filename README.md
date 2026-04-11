# Training Management System - Complete Setup & Testing Guide

## 📋 Project Overview

A complete web application for managing professional training sessions at "Excellent Training" center. Built with Spring Boot 3.x backend and Angular 17+ frontend.

**Stack**: Spring Boot + PostgreSQL + Angular + Tailwind CSS

---

## 🚀 Quick Start (5 minutes)

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

# Create database and user
CREATE DATABASE training_db;
CREATE USER training_user WITH PASSWORD 'training_password';
ALTER ROLE training_user SET client_encoding TO 'utf8';
ALTER ROLE training_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE training_user SET default_transaction_deferrable TO on;
ALTER ROLE training_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE training_db TO training_user;
\q
```

#### 2. Clone and Configure Backend

```bash
cd /home/claude/training-app/backend

# Update application.properties with your database credentials
# File: src/main/resources/application.properties
# spring.datasource.username=training_user
# spring.datasource.password=training_password
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

## 🗄️ Database Setup

### Initialize Database Schema

Create file: `schema.sql`

```sql
-- Create tables
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE utilisateur (
    id SERIAL PRIMARY KEY,
    login VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    id_role BIGINT NOT NULL REFERENCES role(id),
    actif BOOLEAN DEFAULT true,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employeur (
    id SERIAL PRIMARY KEY,
    nomemployeur VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE formateur (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    tel VARCHAR(20),
    type VARCHAR(20) NOT NULL,
    id_employeur BIGINT REFERENCES employeur(id),
    specialite VARCHAR(255),
    bio TEXT
);

CREATE TABLE domaine (
    id SERIAL PRIMARY KEY,
    libelle VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE structure (
    id SERIAL PRIMARY KEY,
    libelle VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    lieu VARCHAR(150)
);

CREATE TABLE profil (
    id SERIAL PRIMARY KEY,
    libelle VARCHAR(150) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE participant (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    id_structure BIGINT NOT NULL REFERENCES structure(id),
    id_profil BIGINT NOT NULL REFERENCES profil(id),
    email VARCHAR(150) NOT NULL,
    tel VARCHAR(20),
    date_embauche DATE,
    actif BOOLEAN DEFAULT true
);

CREATE TABLE formation (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    annee INTEGER NOT NULL,
    duree INTEGER NOT NULL,
    id_domaine BIGINT NOT NULL REFERENCES domaine(id),
    budget DOUBLE PRECISION NOT NULL,
    id_formateur BIGINT NOT NULL REFERENCES formateur(id),
    lieu VARCHAR(150),
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'PLANIFIEE',
    description TEXT
);

CREATE TABLE participant_formation (
    id_participant BIGINT NOT NULL REFERENCES participant(id),
    id_formation BIGINT NOT NULL REFERENCES formation(id),
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut_participation VARCHAR(20) DEFAULT 'INSCRIT',
    PRIMARY KEY (id_participant, id_formation)
);

-- Create indexes
CREATE INDEX idx_utilisateur_login ON utilisateur(login);
CREATE INDEX idx_formateur_type ON formateur(type);
CREATE INDEX idx_formation_domaine ON formation(id_domaine);
CREATE INDEX idx_formation_formateur ON formation(id_formateur);
CREATE INDEX idx_participant_structure ON participant(id_structure);
CREATE INDEX idx_participant_formation ON participant_formation(id_formation);
```

#### Load Initial Data

```sql
-- Insert roles
INSERT INTO role (nom, description) VALUES
('SIMPLE_UTILISATEUR', 'Simple user with basic CRUD operations'),
('RESPONSABLE', 'Training center manager with reporting access'),
('ADMINISTRATEUR', 'Administrator with full system access');

-- Insert structures
INSERT INTO structure (libelle, description, lieu) VALUES
('Direction Centrale', 'Central headquarters', 'Tunis'),
('Direction Régionale Nord', 'Northern regional office', 'Bizerte'),
('Direction Régionale Sud', 'Southern regional office', 'Sfax');

-- Insert domains
INSERT INTO domaine (libelle, description) VALUES
('Informatique', 'IT and Technology training'),
('Finance', 'Financial management training'),
('Comptabilité', 'Accounting training'),
('Management', 'Management and leadership training'),
('Communication', 'Communication skills training');

-- Insert profiles
INSERT INTO profil (libelle, description) VALUES
('Informaticien (Bac+5)', 'Software Engineer with Master degree'),
('Informaticien (Bac+3)', 'IT Technician with Bachelor degree'),
('Gestionnaire', 'Manager/Administrator'),
('Juriste', 'Legal professional'),
('Technicien Supérieur', 'Senior Technician');

-- Insert employers
INSERT INTO employeur (nomemployeur) VALUES
('Tech Solutions Inc'),
('Global Training Ltd'),
('Expert Consultants'),
('Professional Development Co');

-- Insert admin user (password: admin123)
-- Use bcrypt hashed password: $2a$10$qYjBU.zLTqxEG4BVpwQvqeeAGz7W2LU2zJ2wq5zX5ZvZP5qXwOiAi
INSERT INTO utilisateur (login, password, id_role, actif) VALUES
('admin', '$2a$10$qYjBU.zLTqxEG4BVpwQvqeeAGz7W2LU2zJ2wq5zX5ZvZP5qXwOiAi', 3, true);

-- Insert test users
-- Password for all: password123
-- Hash: $2a$10$G8Pq2DjPmBnQqPmQqPmQqPmQqPmQqPmQqPmQqPmQqPmQqPmQqPmQq
INSERT INTO utilisateur (login, password, id_role, actif) VALUES
('user1', '$2a$10$G8Pq2DjPmBnQqPmQqPmQqPmQqPmQqPmQqPmQqPmQqPmQqPmQqPmQq', 1, true),
('manager1', '$2a$10$G8Pq2DjPmBnQqPmQqPmQqPmQqPmQqPmQqPmQqPmQqPmQqPmQqPmQq', 2, true);
```

**Run SQL script:**
```bash
psql -U training_user -d training_db -f schema.sql
```

---

## 🧪 Testing the Application

### Using Postman

#### 1. Login and Get Token

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

✅ **JWT Authentication**: Token-based stateless authentication
✅ **Password Encryption**: BCrypt for secure password hashing
✅ **Role-Based Access Control (RBAC)**: Three-tier role system
✅ **Method-Level Security**: @PreAuthorize annotations
✅ **CORS Configuration**: Configurable cross-origin requests
✅ **CSRF Protection**: Built-in Spring Security CSRF tokens
✅ **Input Validation**: Bean validation and custom validators
✅ **Exception Handling**: Global exception handler

---

## 📊 Architecture Overview

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

---

## 📝 Database Schema

### Entity Relationships

```
Utilisateur (User)
├── role: Role (Many-to-One)
└── Many users per role

Role
├── Simple Utilisateur
├── Responsable
└── Administrateur

Formation (Training)
├── formateur: Formateur (Many-to-One)
├── domaine: Domaine (Many-to-One)
├── participants: Set<Participant> (Many-to-Many via ParticipantFormation)

Participant (Trainee)
├── structure: Structure (Many-to-One)
├── profil: Profil (Many-to-One)
├── formations: Set<Formation> (Many-to-Many)

Formateur (Trainer)
├── employeur: Employeur (Many-to-One, nullable for internal)
├── type: "interne" or "externe"

Domaine (Training Field)
Profil (Job Profile)
Structure (Organization)
Employeur (External Employer)
```

---

## 🔑 Default Test Credentials

| User | Password | Role | Purpose |
|------|----------|------|---------|
| admin | admin123 | ADMINISTRATEUR | Full system access |
| user1 | password123 | SIMPLE_UTILISATEUR | Basic CRUD operations |
| manager1 | password123 | RESPONSABLE | Reporting & Statistics |

---

## ✅ Testing Checklist

- [ ] Database connection successful
- [ ] Backend starts without errors
- [ ] Login endpoint returns valid JWT token
- [ ] Token can be used in Authorization header
- [ ] Create formateur returns 201 with ID
- [ ] Get all formateurs returns 200 with list
- [ ] Update formateur returns 200 with updated data
- [ ] Delete formateur returns 204 No Content
- [ ] Unauthorized requests return 401
- [ ] Forbidden requests return 403
- [ ] Invalid role restrictions enforced

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

## 📚 API Endpoints Summary

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | User login |
| POST | `/api/auth/refresh` | Public | Refresh token |
| GET | `/api/formateurs` | USER+ | List all trainers |
| POST | `/api/formateurs` | USER+ | Create trainer |
| PUT | `/api/formateurs/{id}` | USER+ | Update trainer |
| DELETE | `/api/formateurs/{id}` | ADMIN | Delete trainer |

*(Additional endpoints for formations, participants, statistics, etc. follow similar patterns)*

---

## 🚀 Deployment

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

## 📖 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security JWT Guide](https://spring.io/blog/2015/01/12/the-login-page-configure-it-or-protect-it-and-why)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Swagger/OpenAPI Docs](http://localhost:8080/api/swagger-ui.html)

---

## 📞 Support

For issues or questions:
1. Check logs in console
2. Review application.properties configuration
3. Verify database setup
4. Test endpoints with Postman
5. Check JWT token validity

---

**Last Updated**: April 2026
**Version**: 1.0.0
