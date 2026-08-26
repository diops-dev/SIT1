# Solidaire Inca Tour, site 2026

Site statique (HTML, CSS, JavaScript). Aucune base de donnees, aucun serveur applicatif.
Ce dossier est la version destinee a la mise en ligne : il ne contient que les fichiers
publics. Les sources de travail (maquettes, flyers, visuels Instagram, cartes de visite,
photos originales) restent dans `SITE INTERNET SIT 2026 OK`.

## 1. Ce que contient le dossier

| Chemin | Contenu |
|---|---|
| `index.html` | Accueil, avec la meteo en direct sur sept villes |
| `circuits/` | Catalogue et douze fiches d'itineraire |
| `departs/` | Calendrier des departs en petit groupe |
| `le-perou/` | Regions, histoire, gastronomie, carnet de route |
| `engagement.html` | Notre engagement solidaire |
| `contact.html`, `voyage-sur-mesure.html` | Prise de contact et questionnaire |
| `mentions-legales.html`, `confidentialite.html`, `conditions-generales-vente.html` | Pages legales |
| `assets/` | Feuilles de style, scripts, photographies compressees |
| `data/departs-groupe.json` | Dates de depart, modifiable sans toucher au code |
| `.htaccess` | HTTPS, www, compression, cache, en-tetes de securite |

## 2. Reglages a verifier avant la mise en ligne

**Adresse de reception des formulaires.** Les deux formulaires (devis et questionnaire
sur mesure) envoient a `contact@solidaireincatour.fr` via FormSubmit.
A la premiere soumission, FormSubmit envoie un mail d'activation a cette adresse :
il faut cliquer le lien une seule fois, ensuite tout arrive directement dans la boite.
Les constantes se trouvent en tete de `assets/js/devis.js` et `assets/js/voyage-sur-mesure.js`.
Si l'envoi echoue, le formulaire bascule automatiquement sur un mail pre-rempli, rien n'est perdu.

**Prise de rendez-vous.** Tous les boutons pointent vers
`https://calendar.app.google/NsEizZRPr2kRaaeq5`. L'adresse est definie une seule fois,
dans `assets/js/partials.js` (constante `AGENDA`), et propagee a chaque page.

**Nom de domaine.** Les balises canoniques, le sitemap et le fichier `robots.txt`
utilisent `https://www.solidaireincatour.fr`. Si le domaine retenu est different,
lancer un remplacement global avant de publier.

## 3. Publier sur GitHub

Depuis ce dossier, en ligne de commande :

```bash
git add -A
git commit -m "Mise a jour du site"
git push
```

Premier envoi, si le depot distant n'existe pas encore :

```bash
git remote add origin https://github.com/<compte>/solidaire-inca-tour.git
git branch -M main
git push -u origin main
```

## 4. Publier sur Hostinger

Deux methodes, au choix.

**Methode A, retenue le 23/08/2026 : integration Git de hPanel.** Dans hPanel, section Avance puis Git :
ajouter le depot, choisir la branche `main`, indiquer `public_html` comme repertoire,
puis lancer le deploiement. Un bouton permet ensuite de redeployer a la demande, ou
d'activer un webhook pour que chaque `push` declenche la mise a jour.

**Methode B, automatique par GitHub Actions.** Le fichier
`deploiement/github-actions-hostinger.yml.exemple` envoie le site par FTP. Pour l'activer, le copier en
`.github/workflows/deploiement-hostinger.yml` (le jeton GitHub doit alors porter la portee `workflow`). Il a chaque `push`
sur `main`. Il faut d'abord renseigner trois secrets dans le depot GitHub, sous
Settings puis Secrets and variables puis Actions :

- `FTP_SERVEUR` : l'hote FTP indique dans hPanel, section Fichiers puis Comptes FTP
- `FTP_UTILISATEUR` : l'identifiant FTP
- `FTP_MOTDEPASSE` : le mot de passe FTP

Le contenu est deverse dans `/public_html/`.

Dans les deux cas, verifier apres coup dans hPanel que le SSL est actif sur le domaine
et que `.htaccess` a bien ete transfere (c'est un fichier cache).

## 5. Points restes ouverts

- Les bibliotheques Lucide et React sont chargees depuis `unpkg.com`. Les heberger
  dans `assets/vendor/` supprimerait cette dependance externe.
- Les polices viennent de Google Fonts. Pour un site francais, les heberger localement
  evite tout transfert d'adresse IP vers Google et simplifie la conformite RGPD.
- Le bandeau de consentement aux cookies (Tarteaucitron) n'est pas encore integre.
  Le brief se trouve dans `SIT - 08 Site Web & Outils/brief-integration-tarteaucitron-v2.md`.
- Les dates de depart affichees sur les fiches d'itineraire viennent du prototype.
  Le calendrier reel est dans `data/departs-groupe.json`.
