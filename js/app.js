/* ======================================================
   Alerte Secours Bénin — logique de l'app
   Écrans : accueil → type → localisation → alerte active
   ====================================================== */

// ---------- Configuration ----------
const NUMERO_SAMU_DIRECT = '+2290168300000'; // Ligne directe SAMU (secours = appeler le 112)

// ---------- État de l'app (mémoire vive) ----------
const etat = {
  type: null,        // 'accident' | 'incendie' | 'malaise' | 'autre'
  numero: '112',     // numéro à appeler selon le type
  latitude: null,
  longitude: null,
  precision: null,
  positionManuelle: null, // saisie à la main si pas de GPS
};

// ---------- Navigation entre écrans ----------
function allerVers(idEcran) {
  document.querySelectorAll('.screen').forEach(e => e.classList.remove('active'));
  document.getElementById(idEcran).classList.add('active');
  window.scrollTo(0, 0);
}

// Tous les boutons avec data-aller naviguent vers leur écran
document.querySelectorAll('[data-aller]').forEach(btn => {
  btn.addEventListener('click', () => allerVers(btn.dataset.aller));
});

// ---------- Écran 1 → 2 : bouton ALERTE ----------
// Le GPS démarre DÈS maintenant : la demande de permission apparaît immédiatement
// pendant que l'utilisateur choisit son type d'urgence.
document.getElementById('btn-alerte').addEventListener('click', () => {
  allerVers('type-urgence');
  demarrerGeoloc();
});

// ---------- Écran 2 : choix du type ----------
document.querySelectorAll('.type').forEach(btn => {
  btn.addEventListener('click', () => {
    etat.type = btn.dataset.type;
    etat.numero = btn.dataset.numero;
    allerVers('localisation');
    // Relance la recherche seulement si on n'a pas encore de position
    if (!etat.latitude && !etat.positionManuelle) demarrerGeoloc();
  });
});

// ---------- Géolocalisation ----------
function demarrerGeoloc() {
  const statut = document.getElementById('statut-geo');
  statut.textContent = '📍 Recherche de votre position…';
  document.getElementById('coords').textContent = '';
  document.getElementById('adresse').textContent = '';

  // Diagnostic : le GPS exige une page sécurisée (HTTPS ou localhost)
  if (!window.isSecureContext) {
    statut.innerHTML = '🔒 <strong>Page non sécurisée (HTTP)</strong> : le navigateur bloque le GPS.<br>' +
      'Utilisez la saisie manuelle ci-dessous.';
    document.getElementById('saisie-manuelle').open = true;
    return;
  }

  if (!navigator.geolocation) {
    statut.textContent = '❌ Géolocalisation non disponible sur cet appareil';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      etat.latitude = position.coords.latitude;
      etat.longitude = position.coords.longitude;
      etat.precision = position.coords.accuracy;

      etat.positionManuelle = null; // le GPS prime sur une saisie manuelle
      statut.textContent = '✅ Position trouvée';
      document.getElementById('coords').textContent =
        `${etat.latitude.toFixed(5)}, ${etat.longitude.toFixed(5)}`;
      document.getElementById('adresse').textContent =
        `Précision : ~${Math.round(etat.precision)} m`;

      majResume();
    },
    erreur => {
      const messages = {
        1: '❌ <strong>Permission refusée</strong> — cliquez sur l\'icône 🔒 à gauche de la barre d\'adresse → autorisez la localisation → Réessayer',
        2: '❌ Position indisponible — réessayez à l\'extérieur (ou saisissez à la main)',
        3: '⏳ Délai dépassé — Réessayez (ou saisissez à la main)',
      };
      statut.innerHTML = messages[erreur.code] || '❌ Erreur de géolocalisation';
      // On ouvre le plan B manuel pour ne jamais bloquer l'alerte
      document.getElementById('saisie-manuelle').open = true;
      majResume();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

// Bouton Réessayer
document.getElementById('btn-retry-geo').addEventListener('click', demarrerGeoloc);

// Saisie manuelle de secours (pas de GPS / permission bloquée)
document.getElementById('form-position-manuelle').addEventListener('submit', e => {
  e.preventDefault();
  etat.positionManuelle = document.getElementById('position-manuelle').value.trim();
  const statut = document.getElementById('statut-geo');
  statut.textContent = '✍️ Position saisie à la main';
  document.getElementById('coords').textContent = etat.positionManuelle;
  document.getElementById('adresse').textContent = 'À dicter aux secours';
  majResume();
});

function majResume() {
  const libelles = {
    accident: '🚗 Accident de route',
    incendie: '🔥 Incendie',
    malaise: '🤕 Malaise / blessé',
    autre: '⚠️ Autre danger',
  };
  const coords = etat.latitude
    ? `📍 ${etat.latitude.toFixed(5)}, ${etat.longitude.toFixed(5)}`
    : etat.positionManuelle
      ? `📍 ${etat.positionManuelle}`
      : '📍 Position non disponible (à dicter manuellement)';
  document.getElementById('resume-alerte').innerHTML =
    `<strong>${libelles[etat.type] || ''}</strong><br>${coords}`;
}

// ---------- Texte d'alerte standardisé ----------
// Lien de carte universel : n'importe qui (secours, proche) peut cliquer
// et voir le point exact — sans installer l'app, sans clé API.
function lienCarte() {
  if (etat.latitude) {
    return `https://www.google.com/maps?q=${etat.latitude.toFixed(6)},${etat.longitude.toFixed(6)}`;
  }
  if (etat.positionManuelle) {
    return `https://www.google.com/maps/search/${encodeURIComponent(etat.positionManuelle)}`;
  }
  return '';
}

function texteAlerte() {
  const libelles = {
    accident: 'ACCIDENT DE ROUTE',
    incendie: 'INCENDIE',
    malaise: 'MALAISE/BLESSÉ',
    autre: 'DANGER',
  };
  let txt = `URGENCE ${libelles[etat.type] || ''} - `;
  txt += etat.latitude
    ? `Position: ${etat.latitude.toFixed(5)}, ${etat.longitude.toFixed(5)} (prec ~${Math.round(etat.precision || 0)}m)`
    : etat.positionManuelle
      ? `Position: ${etat.positionManuelle}`
      : 'Position: non disponible';
  const nb = document.getElementById('nb-victimes').value;
  if (nb) txt += ` - ${nb} victime(s)`;
  if (document.getElementById('victime-consciente').checked) txt += ' - victime consciente';
  const carte = lienCarte();
  if (carte) txt += ` - Carte: ${carte}`;
  return txt;
}

// ---------- Écran 3 → 4 : appel des secours ----------
document.getElementById('btn-appeler').addEventListener('click', () => {
  if (!etat.latitude && !etat.positionManuelle) {
    const confirmer = confirm('Position non trouvée. Appeler quand même le ' + etat.numero + ' ?');
    if (!confirmer) return;
  }
  allerVers('alerte-active');
  document.getElementById('gros-coords').textContent = etat.latitude
    ? `${etat.latitude.toFixed(5)}, ${etat.longitude.toFixed(5)}`
    : etat.positionManuelle || 'NON DISPONIBLE — dictez la commune/quartier';

  // IMPORTANT : un seul saut à la fois. Lancer tel: puis sms: d'affilée
  // fait que le composeur SMS écrase l'appel — l'appel ne part jamais.
  // Donc : on appelle MAINTENANT, le SMS se déclenche au retour dans l'app
  // (bouton très visible) ou manuellement depuis l'écran d'alerte.
  appelLance = false;
  window.location.href = `tel:${etat.numero}`;
  preparerRappelEtSms();
});

// Au retour dans l'app (fin ou abandon de l'appel), on met en avant le SMS
let appelLance = false;
function preparerRappelEtSms() {
  const bandeau = document.getElementById('bandeau-appel');
  bandeau.innerHTML = `📞 Appel vers le ${etat.numero} — <strong>le téléphone ne compose pas ?</strong>`;
  const rappel = document.getElementById('btn-rappel');
  rappel.hidden = false;
  rappel.textContent = `🔁 Rappeler le ${etat.numero}`;
  rappel.onclick = () => { window.location.href = `tel:${etat.numero}`; };

  document.addEventListener('visibilitychange', function auRetour() {
    if (document.visibilityState !== 'visible') return;
    document.removeEventListener('visibilitychange', auRetour);
    if (!appelLance) {
      appelLance = true;
      document.getElementById('btn-sms').classList.add('a-faire');
    }
  });
}

function envoyerSmsPosition() {
  const corps = encodeURIComponent(texteAlerte());
  // Le lien sms: pré-remplit un SMS — l'utilisateur n'a qu'à appuyer sur Envoyer
  window.location.href = `sms:${NUMERO_SAMU_DIRECT}?body=${corps}`;
}

function prevenirContact(contact) {
  const corps = encodeURIComponent(`⚠️ ALERTE SECOURS\n${texteAlerte()}\nContactez-moi !`);
  window.open(`https://wa.me/${contact.tel.replace(/[^0-9]/g, '')}?text=${corps}`, '_blank');
}

// ---------- Actions écran 4 ----------
document.getElementById('btn-carte').addEventListener('click', () => {
  const carte = lienCarte();
  if (carte) window.open(carte, '_blank');
  else alert('Position non disponible. Réessayez la localisation ou saisissez-la à la main.');
});

document.getElementById('btn-copier').addEventListener('click', async () => {
  const txt = texteAlerte();
  try {
    await navigator.clipboard.writeText(txt);
    document.getElementById('btn-copier').textContent = '✅ Copié !';
    setTimeout(() => document.getElementById('btn-copier').textContent = '📋 Copier les coordonnées', 2000);
  } catch {
    alert(txt); // repli si le presse-papiers est bloqué
  }
});

document.getElementById('btn-sms').addEventListener('click', envoyerSmsPosition);

document.getElementById('btn-whatsapp').addEventListener('click', () => {
  const contacts = lireContacts();
  if (!contacts.length) {
    alert('Ajoutez d\'abord un contact d\'urgence (écran Mes contacts).');
    allerVers('contacts');
    return;
  }
  // Menu simple : on prend le premier, on pourra affiner plus tard
  prevenirContact(contacts[0]);
});

document.getElementById('btn-photo').addEventListener('click', () => {
  document.getElementById('input-photo').click();
});

document.getElementById('input-photo').addEventListener('change', event => {
  const fichier = event.target.files[0];
  if (!fichier) return;
  const apercu = document.getElementById('apercu-photo');
  apercu.hidden = false;
  apercu.innerHTML = '';
  const img = document.createElement('img');
  img.src = URL.createObjectURL(fichier);
  apercu.appendChild(img);
});

document.getElementById('btn-terminer').addEventListener('click', () => {
  if (confirm('Terminer l\'alerte ?')) allerVers('accueil');
});

// ---------- Contacts d'urgence (stockés en local) ----------
function lireContacts() {
  try { return JSON.parse(localStorage.getItem('contacts') || '[]'); }
  catch { return []; }
}

function sauverContacts(liste) {
  localStorage.setItem('contacts', JSON.stringify(liste));
  afficherContacts();
}

function afficherContacts() {
  const ul = document.getElementById('liste-contacts');
  const contacts = lireContacts();
  if (!contacts.length) {
    ul.innerHTML = '<li class="vide">Aucun contact pour l\'instant</li>';
    return;
  }
  ul.innerHTML = '';
  contacts.forEach((c, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span><strong>${c.nom}</strong><br><small>${c.tel}</small></span>`;
    const btn = document.createElement('button');
    btn.className = 'supprimer';
    btn.textContent = '✕';
    btn.addEventListener('click', () => {
      contacts.splice(i, 1);
      sauverContacts(contacts);
    });
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

document.getElementById('form-contact').addEventListener('submit', e => {
  e.preventDefault();
  const contacts = lireContacts();
  contacts.push({
    nom: document.getElementById('contact-nom').value.trim(),
    tel: document.getElementById('contact-tel').value.trim(),
  });
  sauverContacts(contacts);
  e.target.reset();
});

// ---------- Guides de premiers secours ----------
const GUIDES = {
  accident: {
    titre: '🚗 Accident de route',
    etapes: [
      'Sécurisez la zone : warnings, triangle ou objets visibles à 50 m.',
      '<span class="danger">Ne déplacez PAS une victime</span> (sauf danger immédiat : feu, feu de circulation).',
      'Vérifiez la conscience : parlez-lui, secouez doucement les épaules.',
      'Respiration ? Si oui : position latérale de sécurité. Si non : massage cardiaque si formé, alertez le 112.',
      'Saignement : compressez avec un tissu propre, sans retirer l\'objet.',
      'Restez au téléphone avec les secours, ne raccrochez pas.',
    ],
  },
  incendie: {
    titre: '🔥 Incendie',
    etapes: [
      '<span class="danger">Ne retournez JAMAIS dans le bâtiment</span> pour récupérer des affaires.',
      'Appelez les pompiers : 118, avec l\'adresse précise.',
      'Vêtements en feu : ARRÊTEZ-ROULEZ-COUVREZ (rouler par terre, étouffer la flamme).',
      'Brûlure : refroidir 15 min à l\'eau claire, ne pas percer les cloques, couvrir d\'un linge propre.',
      'Fumées : restez au sol, mouchez-vous avec un tissu humide.',
    ],
  },
  malaise: {
    titre: '🤕 Malaise / blessé',
    etapes: [
      'Parlez à la victime, rassurez-la, déverrouillez son téléphone.',
      '<span class="danger">Ne donnez ni à boire ni à manger</span> (sauf ordre médical).',
      'Perte de conscience mais respiration : position latérale de sécurité.',
      'Saignement : compression directe avec un tissu propre.',
      'Malaise cardiaque suspecté : aidez-la à s\'asseoir, gardez-la au calme.',
      'Restez avec elle jusqu\'à l\'arrivée des secours.',
    ],
  },
  autre: {
    titre: '⚠️ Autre danger',
    etapes: [
      'Éloignez-vous de la zone dangereuse sans vous mettre en risque.',
      'Décrivez précisément le danger aux secours (adresse + nature).',
      'Prévenez les personnes autour, sans vous exposer.',
      'Photographiez de loin si utile pour les secours.',
      'Attendez les instructions des secours au téléphone.',
    ],
  },
};

function afficherGuides(typeChoisi) {
  const conteneur = document.getElementById('guides');
  const aAfficher = typeChoisi && GUIDES[typeChoisi]
    ? [GUIDES[typeChoisi]] // le guide du type choisi en premier
    : Object.values(GUIDES);

  conteneur.innerHTML = '';
  aAfficher.forEach(g => {
    const div = document.createElement('div');
    div.className = 'guide';
    div.innerHTML = `<h3>${g.titre}</h3><ol>${g.etapes.map(e => `<li>${e}</li>`).join('')}</ol>`;
    conteneur.appendChild(div);
  });
}

// Rafraîchir les guides à chaque visite de l'écran
document.querySelectorAll('[data-aller="premiers-secours"]').forEach(btn => {
  btn.addEventListener('click', () => afficherGuides(etat.type));
});

// ---------- Initialisation ----------
afficherContacts();
afficherGuides(null);
