const cron = require('node-cron');
const express = require('express');

const cronJob = () => {
    // Je recupère les 3 dernières league

    /* 
        Pour la ligue ouverte : 
            -Je ne l'ai pas en BDD c'est la nouvelle donc je rentre dans la base les données de la ligue

        Pour la ligue live : 
            -Je l'ai déja en BDD normalement donc je viens juste l'update, modifier les status et rendre l'inscription close 
            (voir quels truc à modifier ou juste dump la ligue en post ou put).

        Pour la ligue close: 
            -Je l'ai en BDD je vais donc modifier celle que j'ai modifier les infos de cette ligue
            -Je vais chercher toutes les cartes des joueurs qui appartiennent à cette ligue.
            -Je vais fetch pour chaque carte du joueur son dernier score j'en fais un score total
            -Je rentre ce score dans la BDD score avec le lien à la GW ainsi que le prix gagné.
            -Je récupère les scores de tous les joueurs de la ligue closed et je fais un tableau de prize

            Une fois les scores en tableau je devrais faire un paiement eth pour chacun des joueurs
    */
}