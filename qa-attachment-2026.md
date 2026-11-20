# Liitteen rajattu loppukorjaus – 20.11.2026

## Löydös ja korjaus
- 9 tukikuukauden raja on 20 127 €, sallittu ylitys mukaan lukien 20 501 €.
- Oletustuloilla 10 000 € toteutuneita + 2 000 € ennustettuja tuloja vuositulo on 12 000 €. Tulotilat ovat 10 501 € ennen ennustetta ja 8 501 € ennusteen jälkeen. Aiemmat eri luvut eivät olleet kaksinkertainen vähennys, vaan kaksi eri vertailua epäselvillä nimillä.
- Tuloskortissa käytetään nyt liitteen kahta täsmällistä nimikettä. Molemmat tulotilat rajataan laskentamoottorissa nollaan; ennusteen ylitys sallittu ylitys huomioiden näytetään erikseen.
- Ensimmäinen tulotila näkyy myös opintojen aloitus-/päättymisvuonna, vaikka kuukausibudjettia ei erityistilanteessa lasketa.
- Kuukausibudjetti = toteutuneiden tulojen jälkeinen tulotila / jäljellä olevat kuukaudet. Mukana on valittu kuluva kuukausi: tammikuu 12 kk, joulukuu 1 kk. Se kattaa kaikki tulevat tulot, myös jo ennustetut, eikä tarkoita ennusteen lisäksi saatavaa summaa. Tammikuun oletusarvo on 875,08 €/kk.
- `invalid=true` myös yksinään hylätään nyt. `data=null`, `undefined`, `NaN`, rikkoutunut JSON ja virheelliset tilat hylätään. Osoite puhdistetaan ja käyttäjälle näytetään suomenkielinen ilmoitus. Jakopainike poistaa vanhat parametrit ja muodostaa validoidun tilan sisältävän linkin.
- Kelan etuuskaavoja, värejä tai asettelua ei muutettu.

## Kelan lähteet, haettu 20.11.2026
- [Opintotuen tulojen vaikutus](https://www.kela.fi/tulojen-vaikutus-korkeakoulussa): vuosien 2025–2026 rajat, 9 kk = 20 127 €, 374 € sallittu ylitys, takaisinperintätaulukko ja opiskeluajan poikkeus.
- [Yleistuki](https://www.kela.fi/yleistuki): 37,21 €/pv, 311 €/kk muiden tulojen tarveharkinta ja 50 % ylimenevästä osasta. Vanhempien tulot, työllistymistä edistävät palvelut ja osittaisen varhennetun vanhuuseläkkeen päätöspäivä on rajattu erityistilanteiksi; nykyiset tekstit vastaavat tarkistettua ohjetta. Oikeutta etuuteen, työaikaa, yrittäjyyttä tai karensseja ei ratkaista.
- [Yleisen asumistuen tulot ja menot](https://www.kela.fi/miten-tulot-ja-menot-vaikuttavat): Manner-Suomi 70 %, Ahvenanmaa 80 % ja eri omavastuukaava, kuntakohtaiset menokatot sekä omaisuuden laskennallinen tulo.
- Kelan Eino ja Elisa -esimerkki: Turku, kaksi aikuista, 1 800 €/kk tulot, 950 € menot → hyväksytään 652 €, omavastuu 472,50 €, tuki 125,65 €. Tämä läpäisi sekä yksikkötestin että selaimen oikeiden kenttien kautta tehdyn tarkistuksen.
- Kelan Maija: Helsingissä 800 € vuokrasta hyväksytään 563 €. Tommi ja Pauliina: Turussa 750 € vuokrasta hyväksytään 652 €. Pekka: 15 000 € omaisuudesta laskennallinen tulo 83,33 €/kk. Nykyiset testit läpäisivät nämä esimerkit.

## Todella suoritetut tarkistukset
- `bunx vitest run`: **123/123 testiä**, 5 testitiedostoa. Laskenta 79, syötteet/jakolinkit 35, käyttöliittymän toiminta 6, tietosuoja 2, reititys 1.
- Uudet laskentatestit: 10 501 / 8 501 €, ennusteylitys 1 499 €, toteutuneiden tulojen ylitys, tammikuun 12 kk ja joulukuun 1 kk budjetti. Uudet URL-testit torjuvat virheelliset data-arvot sekä invalid-parametrin.
- `bun run lint`: **0 virhettä, 7 olemassa olevaa Fast Refresh -varoitusta**.
- Automaattisen rakennustarkistuksen loki: **build OK**, 20.11.2026 klo 08.32.30 UTC. Tuotantorakennuskomentoa tai erillistä TypeScript-tarkistusta ei ajettu käsin tässä työssä; automaattista lokia ei esitetä erillisen manuaalisen tuotantorakennuksen todisteena.
- Chromium 1280×1800 ja 390×844: kaikki kolme laskuria; 10 501 / 8 501 € eri riveillä; kuukausibudjetti; ylitysrivi; yleistuen 411 € pääomatulo → 750,02 € tuki; asumistuen esimerkki → 125,65 €.
- Leikepöytäkopiointi ja linkin avaaminen: kaikkien kolmen välilehden näkyvät kentät ja valinnat palautuivat. Yksikkötestit tarkistavat lisäksi koko kolmen välilehden tilan.
- Viisi virheellisen URL:n muotoa: osoite puhdistui ja ilmoituksen sai suljettua.
- Tyhjä ja negatiivinen tulo: laskelma estyi, negatiivinen merkittiin virheelliseksi. `10 000,00` hyväksyttiin.
- Saavutettavuuden rajattu tarkistus: laskurin kentillä on nimet, näppäimistön Tab siirtyy tulokentästä seuraavaan, vuositulomittari on nimetty. Ei täydellinen WCAG-auditointi.
- Mobiilissa ei vaakaylivuotoa. Tietokone- ja mobiilikuvat tarkistettu.
- A4-PDF tuotettiin kaikista kolmesta laskurista: 2 sivua / laskuri, noin 595×842 pistettä. Sisältöä ei kadonnut, työkalut ja UKK piilotettiin. Opintotuen PDF:n ensimmäinen sivu ja asumistuen toinen sivu tarkistettiin myös kuvina.
- Canonical ja og:url säilyvät osoitteessa https://tuloetuus-laskuri.vercel.app. Suomenkielinen 404 tarkistettiin selaimessa. Yleisen virhesivun suomenkielisyys tarkistettiin lähdekoodista, mutta varsinaista palvelinvirhettä ei aiheutettu.
- Selaintestin aikana **0 JavaScript-virhettä ja 0 ulkoista verkkopyyntöä**. Jakolinkin tietojen mahdollinen näkyminen selaimen historiassa ja palvelinlokeissa kerrotaan edelleen sivulla.

## Muutetut tiedostot
`src/lib/calc.ts`, `src/components/calc/StudentTab.tsx`, `src/lib/calculator-state.ts`, `src/routes/index.tsx`, `src/test/calc.test.ts`, `src/test/input-share.test.ts`, `AGENTS.md`, `roadmap.md`, `qa-attachment-2026.md`.

## Jäljelle jäävät rajaukset
- Vercelin julkaistua versiota ja palvelinlokeja ei tarkistettu eikä päivitetty tässä työssä.
- Safari, Firefox, ruudunlukijakäyttö ja fyysinen tulostin ovat tarkistamatta. PDF voi jatkua toiselle sivulle; opintotuen ja yleistuen alatunniste jakautuu sivuille.
- Asumistuki edellyttää käyttäjän oikein määrittelemiä tuloja, ruokakuntaa, varallisuutta ja henkilökohtaisia talletusvähennyksiä. Kelan välipyöristykset ja omaisuuden arvostaminen eivät ole täydellisesti mallinnettuja. Yleistuki on keskimääräinen kuukausiarvio, ei todellinen maksuerä.
- Ei automaattijulkaisua. Mahdollinen ulkoisen Vercel-palvelun Git-automaattijulkaisuasetus ei ole tässä työssä varmistettu.