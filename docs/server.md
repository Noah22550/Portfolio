# Documentation Technique - Projet Infrastructure & Web (BTS SIO / BugsBunker)

## 1. Contexte et Objectifs du Projet
* **Cadre :** Projet BTS SIO (M. Frébourg)
* **Infrastructure :** Machine Virtuelle Debian 13 (Trixie) sous VirtualBox, utilisateur `noah`, session root active.
* **Objectifs :** 
  * Déploiement d'une stack web moderne (Nginx + PHP 8.4-FPM).
  * Résolution des anomalies techniques (flux RSS, module XML, erreurs 502 Bad Gateway).
  * Intégration et gestion des ressources multimédias (photos/assets du portfolio).
  * Exposition sécurisée du portfolio en ligne via un tunnel Cloudflare et un nom de domaine personnalisé (`noahdepagne.fr`).

---

## 2. Bloc A : Stack Web et Correctifs PHP
* **Serveur Web :** Installation et configuration de **Nginx** pour assurer la distribution des pages du portfolio.
* **Moteur PHP :** Installation de **PHP 8.4** avec `php-fpm` (utilisation du socket Unix `/run/php/php8.4-fpm.sock`).
* **Modules critiques :** Installation de `php8.4-xml` pour corriger le blocage et l'erreur 502 Bad Gateway du flux RSS.
* **Gestion des Médias :** Intégration des fichiers statiques et des photos du portfolio dans l'arborescence web sous `/var/www/portfolio/assets/`.

---

## 3. Bloc B : Déploiement Réseau et Cloudflare Tunnel
* **Contournement des clés GPG sur Debian Trixie :** 
  * Abandon des dépôts `apt` tiers bloqués par les signatures de clés sur Debian Trixie.
  * Téléchargement direct et propre du binaire officiel (`cloudflared-linux-amd64`) directement dans `/usr/local/bin/cloudflared` et attribution des droits d'exécution (`chmod +x`).
* **Liaison du Tunnel :** 
  * Authentification du connecteur à l'aide du token unique fourni par le tableau de bord Cloudflare.
  * Enregistrement en tant que service système systemd pour un lancement automatique au démarrage de la VM.
* **Routage Public (Public Hostname) :**
  * Association du nom de domaine `xxxxx.fr` au service local `http://localhost:80` (Nginx).
  * Chiffrage de bout en bout en HTTPS géré par le réseau mondial Cloudflare.

---

## 4. Fonctionnement du Tunnel (Architecture)
* Le service `cloudflared` sur la machine virtuelle initie en permanence une connexion sortante sécurisée vers le réseau Cloudflare.
* Lorsqu'un utilisateur visite `https://noahdepagne.fr`, Cloudflare relaie la requête à travers le tunnel vers le port 80 de la machine virtuelle (`localhost:80`), sans nécessiter d'ouverture de ports sur la box/routeur.