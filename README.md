# RedReeduc 🏋️‍♂️🩺
> Application web progressive de prescription et de suivi de séances de kinésithérapie et rééducation musculaire, reprenant l'ergonomie, les codes visuels et l'expérience utilisateur de l'application sportive **Hevy**.

![Hevy Dark Mode](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 Fonctionnalités Clés

### 🩺 1. Espace Kinésithérapeute (Dr. Alexandre Dupont)
- **Tableau de bord patient** : Vue d'ensemble de la patientèle, dernières séances exécutées et alertes de douleur (EVA > 4/10).
- **Créateur de séances Hevy-like** :
  - Sélection d'exercices dans un catalogue riche de 30+ exercices ciblés rééducation & musculation (LCA/Genou, Coiffe/Épaule, Rachis/Lombaire, Cheville/Proprioception, Cardio).
  - Modal d'ajout d'exercice sur-mesure (au poids de corps, haltères, élastiques, machines).
  - Programmation série par série : charges cibles (kg), répétitions, durée statique (gainage), résistance élastique (Jaune/Rouge/Vert/Bleu/Noir), consigne spécifique kiné et temps de repos recommandé.
  - Assignation directe au patient.
- **Fil de supervision & Réponses** : Consultation des bilans de séances reçus en temps réel avec possibilité de laisser un commentaire d'ajustement.

---

### 🏃 2. Espace Patient (Lucas Martin) - L'Expérience Hevy
- **Mode Entraînement en Direct (Live Workout)** :
  - Chronomètre supérieur en temps réel (Durée).
  - Calcul automatique et instantané du **Volume total** soulevé (kg).
  - Compteur de séries complétées (ex: 5 / 12).
  - **Fiches d'exercices Hevy** :
    - Badge d'exercice et groupe musculaire.
    - Consignes en surbrillance du kiné.
    - Statut du repos (ex: `⏱ Repos: 60s` modifiable en direct).
    - Tableau des séries avec historique de la dernière séance (`PRÉCÉDENT`).
    - Inputs fluides pour ajuster la charge ou les répétitions pendant la séance.
    - **Bouton de validation (Checkmark)** : Passe du gris sombre au vert émeraude vibrant (`#00D084`) au clic, émet un clic tactile (Web Audio API) et déclenche automatiquement le compte à rebours de repos !
  - **Bandeau de repos flottant** : Décompte en secondes avec boutons `+30s`, `-15s` et `Passer`, signal sonore agréable à l'expiration.
  - Possibilité d'ajouter des séries supplémentaires ou d'ajouter un exercice imprévu en cours de séance.
- **Bilan de fin de séance & Transmission au Kiné** :
  - Célébration festive avec confettis et son de victoire.
  - Statistiques complètes de la séance (Durée, Volume, Séries).
  - **Échelle de douleur EVA (0 à 10)** avec retour qualitatif pour le praticien.
  - **Échelle d'effort perçu RPE** (Modéré, Difficile, Épuisant...).
  - Zone de remarques et sensations pour le kiné.
  - Bouton `Enregistrer et Transmettre à mon Kiné` pour synchronisation immédiate.

---

## 🛠️ Stack Technique

- **Framework** : Next.js 16 (App Router, Turbopack, React 19, TypeScript)
- **Styling** : Tailwind CSS v4 avec palette sombre sportive Hevy (`#0B0D13`, `#121622`, `#182030`, `#007AFF`, `#00D084`)
- **Icônes** : Lucide React
- **Animations & Sons** : Web Audio API native (synthèse audio sans fichiers externes) + Canvas Confetti
- **Persistance** : Store Isomorphique réactif avec synchronisation automatique

---

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancement du serveur de développement
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### 3. Changement de profil instantané
En haut à droite de l'application, un menu déroulant permet de basculer en un clic entre :
- **Dr. Alexandre Dupont (Kiné)**
- **Lucas Martin (Patient LCA Genou)**
- **Camille Roussel (Patiente Épaule)**
