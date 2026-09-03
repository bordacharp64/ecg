# Bibliothèque ECG — IHU Liryc

Site de diffusion gratuite des ouvrages d'interprétation de l'ECG aux étudiants
en médecine. **Vingt pages consultables en ligne sans rien remplir** ; la fiche
d'identification n'est demandée qu'au moment du téléchargement.

Le site reconnaît la langue du visiteur et lui propose d'abord les ouvrages
dans cette langue. La collection démarre en français ; les traductions
s'ajoutent sans toucher au code.

L'apparence reprend les codes du site institutionnel **ihu-liryc.fr** : police
Lato, bleu profond `#044251`, teal `#086D84`, cyan `#47BAD4`, largeur de
contenu 1280 px, base typographique à 15 px.

---

## Ce que le site fait

### Le parcours d'un étudiant

1. Il arrive sur le site. **Sa langue est détectée** (en-tête `Accept-Language`)
   et les ouvrages dans cette langue sont proposés en premier. S'il n'en existe
   aucun, ce sont le français puis l'anglais qui remontent. Un sélecteur permet
   de changer à tout moment, et ce choix prime ensuite sur la détection.
2. Chaque ouvrage est présenté avec **sa couverture**, son sous-titre, sa
   description et son sommaire.
3. Il peut **feuilleter les 20 premières pages directement sur le site**, sans
   rien remplir et sans rien télécharger.
4. Quand il clique sur « Télécharger », et **seulement à ce moment**, une fiche
   lui demande : prénom, nom, e-mail, pays, statut, faculté de médecine.
5. La fiche validée, le téléchargement démarre aussitôt. Sur cet appareil, ses
   téléchargements suivants sont en un clic.

### Côté équipe formation

- Tableau de bord `/admin` : lecteurs identifiés, téléchargements et **aperçus
  consultés par ouvrage** (pour voir quels volumes convertissent la
  consultation en téléchargement), répartition par pays, par statut, par
  faculté et par langue téléchargée.
- Alerte automatique si un ouvrage est annoncé disponible alors que son PDF est
  absent du stockage — la panne la plus courante lors d'une parution.
- Export CSV des lecteurs (séparateur `;`, encodage compatible Excel FR).

### Protection des ouvrages et des données

- Les PDF vivent **hors du dossier public** : aucune URL directe n'existe.
- **L'aperçu est fabriqué côté serveur** : le fichier reconstruit ne contient
  que les 20 pages autorisées. Un visiteur qui inspecte le trafic réseau ne
  voit jamais passer l'ouvrage complet.
- Le lecteur d'aperçu dessine les pages sur un canvas (pdf.js) plutôt que de
  les afficher dans un `<iframe>` : pas de bouton de téléchargement ni
  d'impression dans la visionneuse du navigateur.
- Le PDF complet ne sort que par une route qui vérifie l'identification, puis
  journalise le téléchargement.
- Cookie d'identification signé (HMAC-SHA256), `HttpOnly`, `SameSite=Lax`,
  `Secure` en production. Aucun mot de passe, aucune table de sessions.
- Limitation de débit sur l'identification, l'aperçu et le téléchargement.
- Aucune adresse IP conservée, aucun traceur tiers. Les polices et le moteur
  de rendu PDF sont servis depuis le domaine du site.
- Le lecteur peut exporter ses données et supprimer son compte en autonomie.

---

## Ce qu'il reste à faire avant la mise en ligne

Quatre choses relèvent de vous et de l'IHU, pas du code :

1. **Les titres des volumes 2, 3 et 4.** Ceux en place sont des propositions
   plausibles, pas vos vrais titres. Ils se corrigent dans un seul fichier :
   [`content/livres.ts`](content/livres.ts).
2. **Les PDF.** Aucun n'est dans le dépôt. Voir « Déposer les ouvrages ».
3. **Les listes de facultés.** [`content/universites.ts`](content/universites.ts)
   contient un point de départ établi de bonne foi pour la France, la Belgique,
   la Suisse, le Canada, le Luxembourg, le Maroc, la Tunisie, l'Algérie, le
   Sénégal, la Côte d'Ivoire et le Cameroun. **À faire relire** : les facultés
   fusionnent et changent de nom plus souvent qu'on ne le croit. Les autres
   pays affichent un champ de saisie libre, ce qui vaut mieux qu'une liste
   partielle où l'étudiant choisit au hasard.
4. **Les mentions légales et la politique de confidentialité.** Rédigées
   d'après le fonctionnement réel du site, mais les éléments propres à
   l'institut sont entre crochets et doivent être validés par le délégué à la
   protection des données.

---

## Démarrer en local

Prérequis : Node.js 20 ou plus, et Docker (pour la base de données).

```bash
npm install                  # copie aussi le moteur pdf.js dans public/
cp .env.example .env.local   # puis renseigner SESSION_SECRET
docker compose up -d
npm run db:push
npm run dev
```

Le site répond sur <http://localhost:3000>.

Pour voir le tableau de bord, mettez votre adresse dans `ADMIN_EMAILS`,
téléchargez un ouvrage en la saisissant dans la fiche, puis ouvrez `/admin`.

### Vérifier avant de livrer

```bash
npm test          # 43 tests : langue, validation, référentiels, traductions
npm run lint
npm run build
```

Les tests couvrent les règles qui se cassent silencieusement : ordre de
priorité des langues, cohérence pays/faculté, complétude des traductions,
absence de doublon dans le catalogue, tri des listes déroulantes.

---

## Déposer les ouvrages

Le nom du fichier PDF doit correspondre **exactement** au champ `fileName` de
`content/livres.ts`. Un volume dont `published` vaut `false` s'affiche comme
« à paraître » : ni aperçu, ni téléchargement, même par une URL devinée.

Détails et tableau de correspondance :
[`private/livres/README.md`](private/livres/README.md).

En production sans disque persistant, passez `STORAGE_DRIVER="s3"` : le bucket
doit rester **privé**, le site lit les fichiers avec ses propres identifiants.

---

## Ajouter une langue

Trois niveaux, indépendants les uns des autres.

### 1. Ajouter un ouvrage dans une nouvelle langue

Dupliquez une entrée de `content/livres.ts`, changez `slug`, `language`,
`fileName` et traduisez les textes. **Gardez le même `work` et le même
`volume`** : c'est ce qui relie les traductions entre elles.

Un visiteur hispanophone verra alors les ouvrages espagnols en premier, même
si l'interface n'est pas encore traduite en espagnol.

### 2. Traduire l'interface

Dupliquez le bloc `en` de [`src/lib/i18n.ts`](src/lib/i18n.ts), traduisez, puis
ajoutez le code dans `UI_LANGUAGES` ([`src/lib/langue.ts`](src/lib/langue.ts)).
Le sélecteur de langue se met à jour tout seul, et `npm test` échoue tant qu'il
manque une clef — vous ne pouvez pas livrer une traduction à moitié faite.

Le français fait foi : une clef oubliée s'affiche en français plutôt qu'en
identifiant technique.

### 3. Les pages éditoriales et juridiques

« La collection », « Aide à la lecture », les mentions légales et la politique
de confidentialité restent en français. Ce sont des textes propres à l'institut
et à valider juridiquement : les traduire automatiquement serait imprudent.
Quand vous les traduirez, le plus simple sera de créer une variante par langue.

---

## Modifier le contenu

| Ce que vous voulez changer                     | Fichier                                  |
| ---------------------------------------------- | ---------------------------------------- |
| Titres, sommaires, descriptions des ouvrages   | `content/livres.ts`                      |
| Ajouter un volume ou une traduction            | `content/livres.ts`                      |
| Rendre un volume téléchargeable                | `content/livres.ts` → `published: true`  |
| Nombre de pages de l'aperçu                    | `content/livres.ts` → `previewPages`     |
| Listes de facultés par pays                    | `content/universites.ts`                 |
| Statuts proposés (années, interne, fellow…)    | `content/statuts.ts`                     |
| Tous les libellés de l'interface               | `src/lib/i18n.ts`                        |
| Règles de priorité entre langues               | `src/lib/langue.ts`                      |
| Mentions légales                               | `src/app/mentions-legales/page.tsx`      |
| Politique de confidentialité                   | `src/app/confidentialite/page.tsx`       |
| Couleurs, police, rythme typographique         | `src/app/globals.css`                    |

### Utiliser de vraies couvertures

Les couvertures sont générées en SVG, ce qui évite d'attendre quatre visuels
pour ouvrir le site. Leur typographie s'adapte à la taille d'affichage, donc un
titre long ne déborde jamais. Pour utiliser de vraies images, déposez-les dans
`public/couvertures/` et renseignez `coverImage` dans `content/livres.ts`, puis
affichez-les avec `next/image` à la place du composant `BookCover`.

### Mettre le logo officiel

L'en-tête affiche un pictogramme provisoire. Déposez le logo dans
`public/logo-liryc.svg` et remplacez le bloc `<span aria-hidden>` de
`src/components/site-header.tsx`. L'usage du logo relève de la charte graphique
de l'institut : à valider avec la communication.

---

## Mise en production

### Hébergement

Application Next.js classique : elle tourne partout où Node tourne. Dans
l'ordre :

1. **Clever Cloud** (français, données en France, ISO 27001) — application Node
   + module PostgreSQL + Cellar pour les PDF. Le plus simple à défendre devant
   un DPO d'établissement public.
2. **Scaleway** (français) — Serverless Containers ou Instance, PostgreSQL
   managé, Object Storage.

Vercel fonctionne aussi et demande le moins de travail, mais l'hébergeur est
américain : à arbitrer avec votre DPO. Dans ce cas, gardez au moins la base et
les PDF dans l'Union européenne.

**Une réserve technique sur le serverless** : l'aperçu charge le PDF complet en
mémoire pour en extraire les pages. Sur un manuel de plusieurs centaines de
mégaoctets, cela peut dépasser la limite mémoire d'une fonction serverless. Une
instance classique (Clever Cloud, Scaleway Instance) n'a pas ce problème. Si
vous restez sur du serverless avec de très gros fichiers, il faudra
pré-générer les extraits une fois pour toutes plutôt qu'à la volée.

### Variables d'environnement

Toutes documentées dans [`.env.example`](.env.example). En production :

- `APP_URL` sur le domaine réel, en `https://`
- `SESSION_SECRET` généré aléatoirement (`openssl rand -base64 48`), jamais
  partagé — le changer oblige les lecteurs à remplir la fiche à nouveau
- `ADMIN_EMAILS` avec les adresses de l'équipe formation

### Déploiement

```bash
npm run build   # copie le moteur pdf.js puis construit l'application
npm run start
```

Migrations : `npm run db:push`, ou `npm run db:generate` puis
`npm run db:migrate` si vous préférez versionner les migrations.

---

## Choix techniques, et pourquoi

**Fiche au téléchargement plutôt que compte à créer.** Un compte à créer avant
d'avoir vu la moindre page fait fuir. Ici l'étudiant feuillette vingt pages,
se convainc, et ne donne ses coordonnées qu'ensuite — au moment où il a une
raison de le faire. Les statistiques sont d'autant meilleures que les fiches
remplies correspondent à de vraies intentions de lecture.

**Pas de mot de passe, pas de compte, pas d'e-mail de confirmation.** Un cookie
signé suffit à reconnaître l'appareil. Cela supprime la charge de support (« j'ai
oublié mon mot de passe »), la dépendance à un service d'envoi d'e-mails, et
le risque que les liens de connexion soient filtrés par les messageries
universitaires. Contrepartie assumée : les adresses e-mail ne sont pas
vérifiées. Si vous tenez à les vérifier, ce sera au prix de la conversion.

**Aperçu extrait côté serveur, rendu sur canvas.** Deux garanties plutôt
qu'une : le fichier complet ne transite jamais, et la visionneuse ne propose ni
téléchargement ni impression. Un `<iframe>` aurait été plus court à écrire mais
aurait offert le bouton « télécharger » du navigateur.

**Détection de langue avec priorité au catalogue.** Un visiteur dont le
navigateur demande « es, en » reçoit les livres en espagnol s'ils existent, même
si l'interface n'est pas traduite en espagnol. L'inverse — imposer l'anglais
parce que l'interface le parle — serait absurde pour quelqu'un venu chercher un
livre.

**Listes de facultés seulement là où elles sont fiables.** Une liste mondiale
partielle pousse l'étudiant qui ne trouve pas sa faculté à en choisir une au
hasard, ce qui pollue durablement les statistiques. La saisie libre est moins
élégante mais donne des données exploitables.

**Statistiques agrégées plutôt que suivi individuel.** Ce dont la formation a
besoin, c'est « combien d'étudiants, dans quelles facultés, à quel niveau, dans
quelle langue » — pas le comportement de lecture de chacun. Le journal se
limite au couple ouvrage/date, sans adresse IP.

**Limitation de débit en mémoire.** Suffisante pour une instance unique. Si le
site passe à plusieurs instances, remplacer `src/lib/rate-limit.ts` par un
compteur partagé (Redis) : la signature de la fonction ne change pas.

**pdf.js épinglé en 4.10.** Les versions 6.x utilisent une API JavaScript trop
récente pour beaucoup de navigateurs installés en faculté et à l'hôpital. Avant
toute montée de version, vérifier le rendu de l'aperçu sur un navigateur
ancien.

---

## Pistes pour la suite

Non implémentées, par choix, pour garder cette version simple :

- **Envoi d'un e-mail à chaque nouvelle parution** aux lecteurs ayant coché
  l'option. Le consentement est déjà collecté et horodaté ; il ne manque que
  l'envoi.
- **Suppression automatique des lecteurs inactifs** après la durée retenue par
  le DPO (une tâche planifiée quotidienne).
- **Pré-génération des aperçus** au déploiement, si vous partez sur du
  serverless avec de très gros fichiers.
- **Pages éditoriales traduites**, quand une deuxième langue sera réellement
  publiée.
- **Attestation de lecture** téléchargeable, si la collection sert un jour dans
  un cursus validant.
