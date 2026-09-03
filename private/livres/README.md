# Dossier des PDF (stockage local)

Ce dossier reçoit les fichiers PDF des ouvrages **lorsque
`STORAGE_DRIVER="local"`**. Il est volontairement placé hors de `public/` :
aucun fichier qui s'y trouve n'est accessible par une URL directe. Tout
téléchargement passe par `/api/telechargement/<slug>`, qui vérifie la session.

## Nommer les fichiers

Le nom du fichier déposé ici doit correspondre **exactement** au champ
`fileName` défini dans `content/livres.ts`. Par exemple :

| `fileName` dans `content/livres.ts`         | Fichier à déposer ici                        |
| ------------------------------------------- | -------------------------------------------- |
| `semiologie-electrocardiographique.pdf`     | `semiologie-electrocardiographique.pdf`      |
| `troubles-du-rythme.pdf`                    | `troubles-du-rythme.pdf`                     |
| `troubles-de-la-conduction.pdf`             | `troubles-de-la-conduction.pdf`              |
| `ecg-et-ischemie-myocardique.pdf`           | `ecg-et-ischemie-myocardique.pdf`            |

## Mettre un ouvrage à jour

Remplacez le fichier par la nouvelle version en conservant le même nom, puis
mettez à jour le champ `updatedAt` dans `content/livres.ts`. Les étudiants
téléchargeront la nouvelle version à leur prochain passage, sans rien avoir à
faire.

## Important

Les fichiers `.pdf` de ce dossier sont exclus du dépôt Git (voir
`.gitignore`) : un manuel de plusieurs dizaines de mégaoctets n'a pas sa place
dans l'historique du code. En production, déposez-les sur le volume monté du
serveur, ou basculez sur `STORAGE_DRIVER="s3"`.
