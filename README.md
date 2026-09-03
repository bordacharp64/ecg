# Bibliothèque ECG — IHU Liryc

Site de diffusion gratuite des ouvrages d'interprétation de l'ECG aux étudiants
en médecine. Inscription libre, téléchargement des PDF interactifs réservé aux
comptes inscrits.

L'apparence reprend les codes du site institutionnel **ihu-liryc.fr** : police
Lato, bleu profond `#044251`, teal `#086D84`, cyan `#47BAD4`, largeur de
contenu 1280 px, base typographique à 15 px.

---

## Ce que le site fait aujourd'hui

**Côté étudiant**

- Page d'accueil, catalogue des 4 volumes, fiche détaillée par ouvrage
  (présentation, points forts, sommaire) — consultables sans compte
- Inscription en un formulaire : prénom, nom, e-mail, profil, établissement,
  pays, année d'études, consentement RGPD, opt-in actualités séparé
- **Connexion sans mot de passe** : un lien à usage unique, valable 30 minutes,
  envoyé par e-mail. Rien à retenir, rien à réinitialiser, rien à voler
- Bibliothèque privée avec téléchargement et historique
- Page « Aide à la lecture » expliquant pourquoi un PDF interactif doit être
  ouvert dans Acrobat Reader et non dans le navigateur
- Page « Mon compte » : export de ses données (JSON) et suppression définitive
  du compte, en autonomie

**Côté équipe formation**

- Tableau de bord `/admin` : comptes créés, adresses confirmées,
  téléchargements par ouvrage, répartition par profil et par établissement,
  dernières inscriptions
- Alerte automatique si un ouvrage est annoncé comme disponible alors que son
  PDF est absent du stockage — la panne la plus courante lors d'une parution
- Export CSV des inscriptions (séparateur `;`, encodage compatible Excel FR)

**Sécurité et conformité**

- Les PDF ne sont **jamais** servis comme fichiers statiques : ils vivent hors
  du dossier public et chaque téléchargement passe par une route qui vérifie la
  session, puis journalise
- Aucun mot de passe stocké ; jetons de connexion et de session conservés
  uniquement sous forme d'empreinte SHA-256
- Cookie de session `HttpOnly`, `SameSite=Lax`, `Secure` en production
- Limitation de débit sur l'inscription, la connexion et le téléchargement
- La page de connexion répond à l'identique que le compte existe ou non
  (pas d'énumération de comptes)
- Aucune adresse IP conservée, aucun traceur tiers, polices servies depuis le
  site lui-même
- Filtrage facultatif par domaine e-mail, pour réserver l'accès aux adresses
  universitaires

---

## Ce qu'il reste à faire avant la mise en ligne

Trois choses relèvent de vous et de l'IHU, pas du code :

1. **Les titres des volumes 2, 3 et 4.** Ceux en place sont des propositions
   plausibles, pas vos vrais titres. Ils se corrigent dans un seul fichier :
   [`content/livres.ts`](content/livres.ts).
2. **Les PDF.** Aucun n'est dans le dépôt. Voir « Déposer les ouvrages ».
3. **Les mentions légales et la politique de confidentialité.** Les deux pages
   sont rédigées d'après le fonctionnement réel du site, mais les éléments
   propres à l'institut sont entre crochets et doivent être renseignés puis
   validés par le délégué à la protection des données.

---

## Démarrer en local

Prérequis : Node.js 20 ou plus, et Docker (pour la base de données).

```bash
# 1. Dépendances
npm install

# 2. Configuration
cp .env.example .env.local
#    puis générer un secret de session :
#    openssl rand -base64 48
#    et le coller dans SESSION_SECRET

# 3. Base de données + boîte e-mail de test
docker compose up -d
npm run db:push

# 4. Lancer
npm run dev
```

Le site répond sur <http://localhost:3000>.

**Pour recevoir les e-mails en développement**, deux possibilités :

- *Ne rien configurer* : `SMTP_HOST` vide, les e-mails sont écrits dans la
  console du serveur, lien de connexion inclus. Suffisant pour tester.
- *Utiliser Mailpit* (lancé par `docker compose`) : mettre `SMTP_HOST="localhost"`
  et `SMTP_PORT="1025"` dans `.env.local`, puis consulter les messages reçus sur
  <http://localhost:8025>. Plus proche du réel, permet de vérifier la mise en
  forme de l'e-mail.

Pour voir le tableau de bord, mettez votre adresse dans `ADMIN_EMAILS`,
inscrivez-vous avec cette adresse, puis ouvrez `/admin`.

---

## Déposer les ouvrages

Le nom du fichier PDF doit correspondre **exactement** au champ `fileName` de
`content/livres.ts`. Un volume dont `published` vaut `false` s'affiche comme
« à paraître » et n'est pas téléchargeable, même par une URL devinée.

### En développement, et en production sur un serveur avec disque

Déposez les PDF dans `private/livres/` (voir
[`private/livres/README.md`](private/livres/README.md)). Ce dossier est hors du
webroot : aucun fichier n'y est joignable par une URL directe.

Les `.pdf` de ce dossier sont exclus de Git : un manuel de plusieurs dizaines
de mégaoctets n'a pas sa place dans l'historique du code.

### En production sur un hébergement sans disque persistant

Passez `STORAGE_DRIVER="s3"` et renseignez les variables `S3_*`. Le bucket doit
rester **privé** : le site lit les fichiers avec ses propres identifiants et les
transmet à l'étudiant après vérification de la session. Aucune URL publique
n'est jamais exposée.

### Mettre un ouvrage à jour

Remplacez le fichier en gardant le même nom, puis actualisez `updatedAt` dans
`content/livres.ts`. Les étudiants obtiennent la nouvelle version à leur
prochain téléchargement, sans rien avoir à faire.

---

## Mise en production

### Hébergement

Le site est une application Next.js classique : il tourne partout où Node tourne.
Deux recommandations, dans l'ordre :

1. **Clever Cloud** (français, données en France, certifié ISO 27001) —
   application Node + module PostgreSQL + Cellar pour les PDF. C'est le choix
   le plus simple à défendre devant un DPO d'établissement public.
2. **Scaleway** (français) — Serverless Containers ou Instance, base PostgreSQL
   managée, Object Storage pour les PDF.

Vercel fonctionne aussi et demande le moins de travail, mais l'hébergeur est
américain : à arbitrer avec votre DPO. Dans ce cas, gardez au moins la base et
les PDF dans l'Union européenne.

### Variables d'environnement

Toutes sont documentées dans [`.env.example`](.env.example). En production, ne
pas oublier :

- `APP_URL` sur le domaine réel, en `https://` — c'est ce qui construit les
  liens envoyés par e-mail
- `SESSION_SECRET` généré aléatoirement (`openssl rand -base64 48`) et jamais
  partagé
- un vrai service SMTP (voir ci-dessous)
- `ADMIN_EMAILS` avec les adresses de l'équipe formation

### Envoi des e-mails

C'est le point qui décide du taux de réussite des inscriptions. Un lien de
connexion qui part en spam, c'est un étudiant perdu.

Utilisez le serveur SMTP de l'institut si l'informatique l'autorise, sinon un
service d'envoi transactionnel (Brevo, Scaleway Transactional Email et Mailjet
sont français). Dans tous les cas, faites configurer **SPF, DKIM et DMARC** sur
le domaine expéditeur : sans ça, les messageries universitaires filtrent
massivement.

### Déploiement

```bash
npm run build
npm run start        # ou le démarrage propre à l'hébergeur
```

Les migrations de base se poussent avec `npm run db:push` (ou
`npm run db:generate` puis `npm run db:migrate` si vous préférez versionner les
migrations).

---

## Modifier le contenu

| Ce que vous voulez changer                    | Fichier                                  |
| --------------------------------------------- | ---------------------------------------- |
| Titres, sommaires, descriptions des ouvrages  | `content/livres.ts`                      |
| Ajouter ou retirer un volume                  | `content/livres.ts`                      |
| Rendre un volume téléchargeable               | `content/livres.ts` → `published: true`  |
| Textes de la page d'accueil                   | `src/app/page.tsx`                       |
| Page « La collection »                        | `src/app/la-collection/page.tsx`         |
| Page « Aide à la lecture » et sa FAQ          | `src/app/aide/page.tsx`                  |
| Mentions légales                              | `src/app/mentions-legales/page.tsx`      |
| Politique de confidentialité                  | `src/app/confidentialite/page.tsx`       |
| Champs du formulaire d'inscription            | `src/lib/validation.ts` + le formulaire  |
| Couleurs, police, rythme typographique        | `src/app/globals.css`                    |

### Utiliser de vraies couvertures

Les couvertures sont pour l'instant générées en SVG, ce qui évite d'attendre
quatre visuels pour ouvrir le site. Pour utiliser de vraies images, déposez-les
dans `public/couvertures/<slug>.jpg` et remplacez le composant `BookCover` par
une balise `next/image` dans les pages concernées.

### Mettre le logo officiel

L'en-tête affiche un pictogramme provisoire. Déposez le logo dans
`public/logo-liryc.svg` et remplacez le bloc `<span aria-hidden>` de
`src/components/site-header.tsx`. L'usage du logo relève de la charte
graphique de l'institut : à valider avec la communication.

---

## Choix techniques, et pourquoi

**Next.js + PostgreSQL.** Un seul déploiement à maintenir, hébergeable partout,
compétences courantes — un prestataire ou un stagiaire reprend le projet sans
formation particulière.

**Connexion sans mot de passe.** Décision structurante. Un site de
téléchargement gratuit n'a aucune raison de gérer des mots de passe : cela
n'apporte pas de sécurité (les étudiants réutilisent leur mot de passe habituel),
crée une charge de support (« j'ai oublié mon mot de passe ») et fait de la base
une cible. Le lien par e-mail supprime les trois problèmes, et le clic sur le
lien vaut vérification de l'adresse.

**Téléchargement par route authentifiée plutôt que lien signé temporaire.**
Un lien signé s'échange sur un forum ; une route authentifiée demande une
session à chaque fois, journalise de façon fiable, et permet de retirer un
ouvrage instantanément.

**Statistiques agrégées plutôt que suivi individuel.** Ce dont la formation a
besoin, c'est « combien d'étudiants, dans quelles facultés, à quel niveau » —
pas le comportement de lecture de chacun. Le journal se limite au couple
ouvrage/date, sans adresse IP.

**Limitation de débit en mémoire.** Suffisante pour une instance unique, qui
est le cas d'usage. Si le site passe un jour à plusieurs instances, remplacer
`src/lib/rate-limit.ts` par un compteur partagé (Redis) : la signature de la
fonction n'a pas à changer.

---

## Pistes pour la suite

Non implémentées, par choix, pour garder une première version simple :

- **Édition anglaise** : la structure est prête (un champ `locale` par ouvrage
  et une seconde entrée dans le catalogue suffisent). À faire une fois les
  quatre volumes français parus.
- **Envoi automatique d'un e-mail à chaque nouvelle parution** aux étudiants
  ayant coché l'opt-in — quelques dizaines de lignes, à ajouter quand le
  volume 2 sortira.
- **Suppression automatique des comptes inactifs** après la durée retenue par le
  DPO (une tâche planifiée quotidienne).
- **Attestation de lecture** téléchargeable, si la collection sert un jour
  dans un cursus validant.
