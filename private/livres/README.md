# Dossier des PDF (stockage local)

Ce dossier reçoit les fichiers PDF des ouvrages **lorsque
`STORAGE_DRIVER="local"`**. Il est volontairement placé hors de `public/` :
aucun fichier qui s'y trouve n'est accessible par une URL directe.

- Le **PDF complet** ne sort que par `/api/telechargement/<slug>`, qui vérifie
  que la fiche d'identification a été remplie.
- L'**aperçu** sort par `/api/apercu/<slug>`, qui reconstruit à la volée un PDF
  ne contenant que les premières pages. Le fichier complet ne quitte jamais le
  serveur avant identification.

## Nommer les fichiers

Le nom du fichier déposé ici doit correspondre **exactement** au champ
`fileName` défini dans `content/livres.ts`. Le suffixe de langue évite de
confondre un volume et sa traduction :

| `fileName` dans `content/livres.ts`          | Fichier à déposer ici                          |
| -------------------------------------------- | ---------------------------------------------- |
| `semiologie-electrocardiographique-fr.pdf`   | `semiologie-electrocardiographique-fr.pdf`     |
| `troubles-du-rythme-fr.pdf`                  | `troubles-du-rythme-fr.pdf`                    |
| `troubles-de-la-conduction-fr.pdf`           | `troubles-de-la-conduction-fr.pdf`             |
| `ecg-et-ischemie-myocardique-fr.pdf`         | `ecg-et-ischemie-myocardique-fr.pdf`           |
| `semiologie-electrocardiographique-en.pdf`   | `semiologie-electrocardiographique-en.pdf`     |

En cas d'oubli, la page `/admin` affiche une alerte nommant les fichiers
manquants : c'est le premier endroit à regarder si un téléchargement échoue.

## Mettre un ouvrage à jour

Remplacez le fichier par la nouvelle version **en conservant le même nom**,
puis mettez à jour le champ `updatedAt` dans `content/livres.ts`. L'aperçu est
mis en cache trente minutes : au-delà, il reflète automatiquement la nouvelle
version. Pour le rafraîchir tout de suite, redémarrez l'application.

## Important

Les fichiers `.pdf` de ce dossier sont exclus du dépôt Git (voir
`.gitignore`) : un manuel de plusieurs dizaines de mégaoctets n'a pas sa place
dans l'historique du code. En production, déposez-les sur le volume monté du
serveur, ou basculez sur `STORAGE_DRIVER="s3"`.
