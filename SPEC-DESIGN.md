# Spec Design — Alerte Secours Bénin

> Référence unique pour reproduire les écrans dans **Figma** et garder une cohérence visuelle entre les versions.
> Frame de référence : **390 × 844 px** (iPhone 13/14 ou Galaxy S/Android courant), densité mobile.

---

## 1. Identité visuelle

### Palette de couleurs

| Rôle | Couleur | Hex | Usage |
|---|---|---|---|
| **Rouge urgence** (primaire) | 🔴 | `#C62828` | Bouton ALERTE, boutons principaux, accents, numéros |
| **Rouge foncé** (pressé/ombre) | 🟥 | `#8E0000` | État "enfoncé" des boutons, dégradé du bouton rond |
| **Rouge clair** (survol) | 🩹 | `#FF6F60` | États secondaires, dégradé |
| **Vert secours** | 🟢 | `#2E7D32` | Bouton "Guide premiers secours", statut "✅ Position trouvée", badge hors-ligne |
| **Fond** | ⬜ | `#FAFAFA` | Fond de page |
| **Texte principal** | ⚫ | `#212121` | Titres, corps |
| **Texte secondaire** | ▫️ | `#757575` | Sous-titres, aide, labels |
| **Carte** | ⬜ | `#FFFFFF` | Cartes, encadrés |
| **Rouge fond alerte** | 🌸 | `#FFF5F5` | Fond du résumé d'alerte, états actifs |

**Ombre standard (cards) :** `0 2px 8px rgba(0,0,0,0.12)`
**Ombre bouton ALERTE :** `0 8px 24px rgba(194,40,40,0.45)`

### Typographie

- **Famille** : `System UI` (Roboto sur Android, SF sur iOS) — dans Figma : utiliser **Inter** ou **Roboto** comme substitut proche
- **Titre app** : 1.3 rem → **21 px**, weight 700
- **Titre d'écran (h2)** : 1.4 rem → **24 px**, weight 700
- **Libellé bouton ALERTE** : **36 px**, weight 800, letter-spacing 2 px
- **Coordonnées (dictées)** : **36 px**, weight 800, `font-family: monospace`
- **Corps** : 16 px / weight 400
- **Aide / légende** : 13 px / `#757575`

### Gabarit commun

- **Largeur app** : max 480 px centrée (dans Figma : frame 390 px)
- **Padding écran** : 16 px (gauche/droite), 16 px haut
- **Rayon des cartes** : 12–16 px
- **Rayon des boutons** : 10–12 px
- **Hauteur cible tactile** : ≥ 48 px (règle d'or accessibilité + stress/urgence)

---

## 2. Les 7 écrans

### Écran 1 — Accueil

- **Header** : emoji 🚨 (28 px) + titre "Alerte Secours **BJ**" (BJ en `#C62828`, italique non)
- **Accroche** : "Un accident ? **3 secondes** pour alerter les secours." en `#757575`, marge bas 24 px
- **Bouton ALERTE** : **cercle** Ø `min(70vw, 260 px)` → dans la frame Figma : **260 px**
  - Dégradé radial `#E53935` → `#8E0000` (haut-gauche → centre)
  - Ombre portée rouge `0 8px 24px rgba(194,40,40,0.45)`
  - Contenu centré en colonne : 🚨 (51 px) / "ALERTE" (36 px, blanc, 800) / "Toucher pour signaler" (13 px, blanc 85 %)
- **3 raccourcis** en bas (flex, gap 10 px) : carte blanche, rayon 12 px, bordure `1px #eee`
  - 🩹 Premiers secours · 👥 Mes contacts · 📞 Numéros utiles (emoji 22 px + label 12 px)

### Écran 2 — Type d'urgence

- Bouton "← Retour" : texte `#C62828`, 16 px, weight 600, sans fond
- **Titre** : "Quel est le problème ?" 24 px/700
- **Grille 2×2** (gap 12 px) : cartes blanches, rayon 16 px, **bordure `2px #eee`**
  - Contenu centré en colonne : emoji **38 px** + libellé 16 px/600
  - État actif : bordure `#C62828` + fond `#FFF5F5`
  - 4 cartes : 🚗 Accident de route · 🔥 Incendie · 🤕 Malaise / blessé · ⚠️ Autre danger
- **Bloc options dépliable** : carte blanche, rayon 12 px, ombre standard
  - Summary "+ Précisions (facultatif)" en `#C62828`/600
  - Select pleine largeur, padding 10 px, bordure `1px #ddd`, rayon 8 px

### Écran 3 — Localisation

- **Carte geo** : blanche, rayon 16 px, padding 20 px, texte centré, min-height 120 px
  - Ligne 1 statut : 15 px `#757575` (vert `#2E7D32` quand ✅ Position trouvée)
  - Ligne 2 coordonnées : **26 px/800 monospace**
  - Ligne 3 précision : 14 px gris
  - Bouton **🔄 Réessayer** : transparent, bordure `1px #C62828`, texte rouge, rayon 8 px, padding 10×18
- **Résumé alerte** : fond `#FFF5F5`, **bordure gauche 4 px `#C62828`**, rayon 8 px, padding 12×14
- **Bouton principal** "📞 APPELER LES SECOURS" : pleine largeur, padding 16 px, fond `#C62828`, blanc, 18 px/700, rayon 12 px
- **Aide** sous le bouton : 13 px gris, centrée
- **Plan B manuel** (détails dépliable) : carte blanche rayon 12 px, champ texte padding 14 px bordure `1px #ddd` rayon 10 px

### Écran 4 — Alerte active

- **Bandeau appel** : fond `#C62828`, texte blanc/700, centré, padding 12 px, rayon 12 px, **animation pulse (opacité 75 % toutes les 1,5 s)**
- **Encadré dictée** : carte blanche, rayon 16 px, centré, padding 20 px
  - Label "DICTEZ AUX SECOURS :" 13 px gris, letter-spacing 1 px
  - **Coordonnées géantes : 34 px/800 monospace**, marge 8 px
  - Bouton 📋 Copier : transparent, bordure `1px #C62828`, texte rouge, rayon 8 px
- **4 actions** empilées (gap 10 px) : cartes blanches, bordure `1px #eee`, rayon 12 px, padding 16 px, texte aligné gauche 16 px/600
  - 🗺 Ouvrir ma position dans Google Maps
  - 📨 Envoyer ma position (SMS)
  - 💬 Prévenir un proche
  - 📷 Ajouter une photo
- **Bouton vert** "🩹 Guide des premiers secours…" : fond `#2E7D32`, blanc, 16 px/700, rayon 12 px
- **Bouton secondaire** "Terminer l'alerte" : transparent, bordure `1px #ddd`, texte gris

### Écran 5 — Premiers secours

- Sous-titre avec badge : **"✓ Disponible hors-ligne"** en `#2E7D32`/600
- **Cartes guides** (gap 12 px) : blanches, rayon 14 px, ombre standard
  - Titre carte : 16 px/700, marge bas 8 px
  - Liste numérotée : 15 px, items gap 6 px
  - **Étapes de danger** : texte `#C62828`/700 (ex : "Ne déplacez PAS une victime")

### Écran 6 — Contacts

- Items de liste : cartes blanches, rayon 12 px, padding 14 px, nom en 700 + numéro en gris 13 px, bouton ✕ rouge à droite
- Formulaire : 2 champs (padding 14 px, rayon 10 px, bordure `1px #ddd`) + bouton "+ Ajouter" (style bouton principal)
- **Texte explicatif** sous le titre (important pour l'utilisateur) : contacts = *ses* proches, alertés quand c'est lui la victime

### Écran 7 — Numéros utiles

- Liste de liens-cards (blanc, rayon 12 px, ombre standard, padding 16 px)
- **Numéro** : 24 px/700 `#C62828` — **Libellé** : 14 px gris
- 112 SAMU · 118 Pompiers · 117 Police · 166 Police secours · 136 Santé publique · 01 68 30 00 00 SAMU direct

---

## 3. Règles de conception (à respecter dans Figma)

1. **Le pouce d'abord** : bouton ALERTE et bouton d'appel dans la moitié basse de l'écran, jamais < 48 px de haut
2. **Zéro défilement sur le parcours critique** (Accueil → Type → Localisation → Alerte)
3. **Hiérarchie de couleur** : le rouge = agir maintenant ; le vert = ressource d'aide ; le gris = information
4. **Cohérence** : un seul style de carte (blanc, rayon 12-16, ombre standard), un seul style de bouton primaire
5. **Mode sombre** : non prévu au MVP — ne pas concevoir les frames dark maintenant

## 4. Structure Figma recommandée

```
📄 Page "Alerte Secours BJ"
├── 🖼 Frame "Accueil" (390×844)
├── 🖼 Frame "Type d'urgence"
├── 🖼 Frame "Localisation"
├── 🖼 Frame "Alerte active"
├── 🖼 Frame "Premiers secours"
├── 🖼 Frame "Contacts"
├── 🖼 Frame "Numéros utiles"
└── 🎨 Section "Design System"
    ├── Swatches de couleurs (7)
    ├── Styles de texte (Titre 24/700, Corps 16/400, Aide 13/400, Mono 34/800)
    ├── Boutons (primaire, vert, secondaire, retour, copier)
    └── Cartes (standard, résumé, guide, contact)
```

Dans Figma : créer les **color styles** et **text styles** d'abord, puis dupliquer les frames écran par écran. Le plus rapide : captures de l'aperçu web comme référence sous les frames, et on redessine par-dessus.
