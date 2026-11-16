# 🚨 Alerte Secours Bénin

Application mobile (PWA) permettant à un **témoin** d'alerter les secours en **3 secondes**, avec sa **position GPS** transmise et des **guides de premiers secours** disponibles même hors connexion.

> **Problème visé :** au Bénin, la latence entre un accident (route, incendie, malaise) et l'arrivée des secours est aggravée par un signalement approximatif : le témoin panique, décrit mal le lieu, et ne sait pas toujours quel service appeler. Cette app réduit ce délai en supprimant la réflexion : un type d'urgence, un bouton, une position précise.

> ⚠️ **Cette application ne remplace pas les secours officiels.** Elle facilite leur appel. En cas d'urgence : **112** (SAMU), **118** (pompiers), **117 / 166** (police), **136** (santé publique).

---

## ✨ Fonctionnalités

- **Alerte en 3 taps** — Accueil → type d'urgence → localisation
- **Appel ciblé automatique** — le bon numéro selon la situation (accident/malaise → 112, incendie → 118, autre danger → 117)
- **Position GPS** — coordonnées précises, avec plan B par **saisie manuelle** si le GPS est refusé ou absent
- **SMS d'alerte pré-rempli** — type d'urgence, coordonnées, précision, nombre de victimes et **lien Google Maps** cliquable par les secours
- **Prévenir un proche** — partage WhatsApp du message complet
- **Coordonnées à dicter** — affichage géant + copie en un tap (secours au téléphone)
- **Premiers secours** — guides pas à pas **disponibles hors-ligne** (accident, incendie, malaise, autre danger)
- **Contacts d'urgence** — stockés uniquement sur le téléphone
- **Numéros utiles** — annuaire officiel béninois cliquable
- **Installable** — s'ajoute à l'écran d'accueil Android/iOS, s'ouvre en plein écran
- **Fonctionne hors-ligne** — Service Worker avec repli sur le cache

## 🧱 Stack technique

| Élément | Choix | Pourquoi |
|---|---|---|
| Interface | **HTML / CSS / JavaScript** (vanilla), sans framework | Léger, lisible, aucun build |
| Type d'app | **PWA** (manifest + Service Worker) | Installable sans Play Store, mises à jour instantanées |
| Données | `localStorage` | Aucune donnée personnelle envoyée à un serveur |
| Backend | **Aucun** (v1) | L'appel et le SMS fonctionnent sans serveur |
| Hébergement démo | Freebuff Sites (`worker.js` + assets statiques) | HTTPS gratuit, requis pour le GPS |

---

## 📂 Structure du projet

```
alerte-secours-benin/
├── index.html            # Les 7 écrans de l'app (structure)
├── css/
│   └── styles.css        # Design mobile-first, thème urgence
├── js/
│   └── app.js            # Toute la logique (navigation, GPS, appels, SMS, guides)
├── icons/
│   ├── icon.svg          # Icône vectorielle
│   ├── icon-192.png      # Icône PWA (Android)
│   ├── icon-512.png      # Icône PWA (haute résolution / maskable)
│   └── apple-touch-icon.png
├── manifest.json         # Manifeste PWA (nom, icônes, affichage plein écran)
├── sw.js                 # Service Worker (cache + fonctionnement hors-ligne)
├── worker.js             # Worker d'hébergement (sert les fichiers statiques)
├── deploy.json           # Manifeste de déploiement (Freebuff Sites)
├── SPEC-DESIGN.md        # Spécification design détaillée (Figma)
└── README.md
```

> `public/` n'est **pas** versionné : c'est la copie de build utilisée pour le déploiement (elle est générée par la commande de la section *Déploiement*).

---

## 🚀 Installation locale

### Prérequis

- Un **navigateur moderne** (Chrome, Edge, Firefox)
- **Python 3** (fourni sur macOS/Linux, ou [python.org](https://www.python.org/downloads/)) — sert uniquement de petit serveur local
- Un **éditeur de code** (VS Code recommandé)

> Le GPS et le Service Worker exigent une origine sécurisée : `localhost` ou HTTPS. Ouvrir `index.html` par double-clic (`file://`) **casse** la géolocalisation et le mode hors-ligne.

### Étapes

```bash
# 1. Récupérer le projet
git clone https://github.com/bassith62/alerte-secours-benin.git
cd alerte-secours-benin

# 2. Lancer un serveur local
python3 -m http.server 3000

# 3. Ouvrir dans le navigateur
#    http://localhost:3000
```

Alternative sans Python : extension **Live Server** de VS Code (clic droit sur `index.html` → *Open with Live Server*).

### Tester sur téléphone (depuis le réseau local)

```bash
# Serveur accessible depuis tout le réseau local
python3 -m http.server 3000 --bind 0.0.0.0
# puis, sur le téléphone (même WiFi) : http://<IP-du-PC>:3000
```

> Le GPS peut être bloqué en HTTP hors `localhost`. Pour un test GPS réel et l'installation, utilisez la version **HTTPS** déployée.

### Installer l'app sur Android

1. Ouvrir l'URL HTTPS dans **Chrome**
2. Menu **⋮ → « Ajouter à l'écran d'accueil »** (ou « Installer l'application »)
3. Ouvrir depuis l'icône : l'app démarre en plein écran

### Installer l'app sur iPhone

1. Ouvrir l'URL dans **Safari**
2. Bouton **Partager → « Sur l'écran d'accueil »**

---

## 🔄 Mettre à jour après une modification

Le Service Worker sert les fichiers cachés en priorité. Après un changement de code :

1. Incrémenter la version du cache dans `sw.js` (`alerte-secours-v5` → `v6`)
2. Recharger l'app (sur mobile : fermer puis rouvrir l'app installée)

---

## ☁️ Déploiement

L'app est 100 % statique : n'importe quel hébergeur HTTPS convient (**GitHub Pages**, Netlify, Vercel, Cloudflare Pages).

### GitHub Pages (le plus simple)

```bash
# dans les paramètres du dépôt : Settings → Pages → Branch: main → / (root)
# l'app sera servie sur https://bassith62.github.io/alerte-secours-benin/
```

Aucun build nécessaire : les fichiers sont déjà à la racine. Le GPS fonctionne car GitHub Pages sert en HTTPS.

### Build pour un déploiement de type « assets »

```bash
mkdir -p public/css public/js public/icons
cp index.html manifest.json sw.js public/
cp css/styles.css public/css/
cp js/app.js public/js/
cp icons/* public/icons/
```

---

## 🧪 Tests manuels recommandés

| Test | Comment | Résultat attendu |
|---|---|---|
| Appel | ALERTE → Accident → *APPELER LES SECOURS* | Le composeur s'ouvre sur le **112** |
| SMS | Sur l'écran d'alerte, *Envoyer ma position* | SMS pré-rempli avec coordonnées + lien Maps |
| GPS refusé | Refuser la permission | Message explicite + formulaire de saisie manuelle |
| Hors-ligne | Installer, couper les données, rouvrir | App et guides de premiers secours accessibles |
| Contacts | Ajouter un proche puis relancer une alerte | Contact présent après fermeture/réouverture |

> Ne pas appeler réellement le 112 pour tester : utiliser un numéro personnel, ou vérifier simplement que le composeur affiche le bon numéro.

---

## 🗺 Feuille de route

- **Phase 1 (fait)** — Alerte, GPS, SMS/appel, guides premiers secours, PWA installable
- **Phase 2** — Écran carte (Leaflet/OpenStreetMap), choix du proche à prévenir, envoi serveur des alertes (relais SMS fiable), photos jointes
- **Phase 3** — Partenariats officiels (SAMU, protection civile, opérateurs), statistiques d'accidents géolocalisées, mode « dispatch »

## 📚 Sources institutionnelles (numéros d'urgence)

- [CNSR — numéros verts](https://cnsr.bj/contact/numeros-verts)
- [Ministère de la Santé du Bénin — numéros d'urgence sanitaires](https://sante.gouv.bj/article/numeros-durgence/numeros-durgence-sanitaires)
- [Gouvernement du Bénin — renforcement du SAMU (ambulances)](https://www.gouv.bj/article/2662/renforcement-performances-samu-benin-receptionne-premier-ambulances/)

## ⚖️ Avertissement

Projet indépendant, **non affilié** au SAMU, à la Protection civile ou au Gouvernement du Bénin. Les numéros d'urgence affichés sont ceux publiés par les sources officielles citées ci-dessus ; ils peuvent évoluer. En cas de doute, composer le **112**.
