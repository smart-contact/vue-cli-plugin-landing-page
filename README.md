# Vue CLI Landing Page Plugin

Questo plugin automatizza la creazione del progetto base per la creazione di landing page.

## Installazione
```
yarn add @smart-contact/vue-cli-plugin-landing-page --dev
```

## Invocazione
```
  vue invoke @smart-contact/vue-cli-plugin-landing-page
```

Il plugin chiedere alcune domande:

1. Inserimento dell'url della CDN di livelanding (https://smart-contact-cdn.livelanding.it)
2. Se si vuole utilizzare vue-router (No)
3. Se si vuole utilizzare vuex (No)

### useVuex
Nel caso fosse "si", il plugin provvederà ad implementare la feature products tramite vuex e non con la conposition API.

## Features incluse
- Parametri della landing già predisposti con eventuali valori di default
- Gestione dei prodotti tramite gruppi di parametri
- Gestione apertura/chiusura del CallMeBackModal
- Gestione automatismo per l'aggiunta del suffisso per fuori orario sul sap
- Struttura base per la landing (header, footer, modals ecc)
- Implementazione di vari plugin quali: Bootstrap Vue, Smartify, Smartland ecc.
- Gestione parametri tracciamento da inviare alla success page