# Viimeinen laadunvarmistus – 20.11.2026

## 1. Löydetyt ja korjatut ongelmat

- Opiskelijan kaksi eri tulotilaa esitettiin epäselvästi. Nyt näkyvät erikseen **10 501,00 € ennen tulevien tulojen ennustetta** ja **8 501,00 € ennustetun vuositulon jälkeen**, kun toteutuneet tulot ovat 10 000 € ja tulevat tulot 2 000 €. Molemmat arvot tulevat laskentamoottorista. Kuukausisuositus perustuu ensimmäiseen lukuun ja sisältää myös ennustetut tulot: marraskuussa 10 501 / 2 = 5 250,50 €/kk. Ennustetta ei vähennetä kahdesti.
- Yleistuen kuvaajan vertailuluku ei vastannut hyötylaskelman vertailua silloin, kun suoraan vähennettävät muut etuudet ylittivät täyden tuen. Kuvaaja käyttää nyt laskelman samaa vertailutuloa. Etuuden laskentakaavaa ei muutettu.
- Asumistuen kuvaaja pyöristi summat kokonaisiin euroihin, vaikka tuloskortti käytti senttejä. Kuvaajan arvot näytetään nyt sentteinä; nollamuutoksen pylväs vastaa tuloskortin 229,25 euroa.
- Asumistuen puhelinnäkymän kortit levisivät yli 390 pikselin näytön. Kortit voivat nyt kutistua käytettävään leveyteen; vaakaylivuoto poistui.
- Opintotuen ja asumistuen lähdelinkit olivat siirtyneet tai poistuneet Kelan sivustouudistuksessa. Linkit korjattiin toimiville suomenkielisille sivuille.
- Kaksi aiempaa muotoiluvirhettä esti lint-komennon onnistumisen. Ne korjattiin. Jakolinkin käsittelyn tarpeeton ja puutteellinen riippuvuusmäärittely poistettiin.
- A4-tulostusta tiivistettiin vain tulostustilassa: A4-koko, pienemmät erittelytekstit ja piilotetut liukusäätimen käyttökahvat. Jakamis- ja tulostuspainikkeet, muut välilehdet, UKK ja työkalukortit eivät tulostu. Opiskelija ja yleistuki mahtuivat yhteen A4-sivuun; asumistuen pitkät syötteet jatkuivat toiselle sivulle. Yhden sivun pakotusta ei tehty luettavuuden kustannuksella.

## 2. Jakolinkit ja hakukonetiedot

- Nykyinen jakopainike muodosti jo kelvollisia, validoituja linkkejä. Sitä ei kirjoitettu tarpeettomasti uudelleen.
- Selaimessa testattiin kaikkien kolmen välilehden jakaminen muutetuilla syötteillä, linkin avaaminen ja oikean välilehden sekä arvojen palautuminen.
- `?data=null&invalid=true`, erikoismerkit, vajaa sisältö ja vanha versio puhdistuvat osoitteesta. Suomenkielinen ilmoitus näkyy, ja **Jatka puhtaalla laskurilla** poistaa ilmoituksen.
- Automaattiset testit vertaavat jokaisen kolmen laskurin koko tilan palautumista, eivät vain aktiivisen laskurin yhtä arvoa. Puuttuvat/virheelliset luvut estävät jakamisen eivätkä muutu `data=null`-linkiksi.
- Canonical ja og:url olivat jo oikein Vercel-osoitteessa. Sekä paikallisen sovelluksen että julkaistun Vercel-sivun tiedot tarkistettiin. Otsikko ja kuvaus vastaavat aiemmin pyydettyjä suomenkielisiä tekstejä.
- Vercelin etusivu ja robots.txt vastasivat HTTP 200. Robots.txt sallii hakukoneiden käynnit. Etusivun HTML:ssä ei ole robots-noindex-tunnistetta eikä HTTP-vastauksessa havaittu X-Robots-Tag-kieltoa.
- Tämä osoittaa teknisen indeksoitavuuden, ei sitä, että Google on jo indeksoinut sivun tai nostaa sen hakutuloksiin. Search Consolen indeksointitilaa ei tarkistettu.
- 404-sivu, sovelluksen virhesivu ja palvelimen varavirhesivu ovat suomeksi. 404 avattiin selaimessa; muut tekstit tarkistettiin lähdekoodista, eikä palvelinvirhettä aiheutettu tarkoituksella.

## 3. Todella suoritetut testit

### Automaattitestit

`bun run test` (package.json:n `test`-komento: `vitest run`) suoritettiin alussa ja korjausten jälkeen. Viimeinen ajo: **106/106 testiä läpäisi, 4/4 testitiedostoa läpäisi**.

- `src/test/calc.test.ts`: **72 testiä**. Opintotuen 0–12 tukikuukautta, tulorajat ja ylitysvara, takaisinperintätaulukon kaikki rajat, toteutuneet/tulevat tulot, aloittamis-/päättymisvuoden poikkeukset, puuttuvat ja virheelliset luvut. Yleistuen palkka-, pääoma-, vuokra- ja muut tulot, 311 euron raja, yhteisvähennykset, nollat ja suuret tulot, erityistilanteet. Asumistuen ruokakunta, kuntaryhmät, menokatot, omaisuus, lämmitys, vähimmäismaksu ja rajatapaukset.
- `src/test/input-share.test.ts`: **28 testiä**. Pilkku, välilyönnit, tyhjä/negatiivinen/virheellinen syöte, kaikki laskurisyötteet ja aktiivinen välilehti, puutteet, vanha versio ja erikoismerkit.
- `src/test/calculator-ui.test.tsx`: **5 testiä**. Syötteiden vaikutus tulokseen, virheellisen syötteen estämä arvio, tulolajin vaikutus, kopiointi ja tulostuspainike, kopioinnin epäonnistuminen.
- `src/test/app-routing.test.tsx`: **1 testi**. Etusivu löytyy eikä putoa 404-sivuksi.

Uusia regressiotestejä lisättiin 12: kaksi opiskelijan tulotiloille, yksi yleistuen vertailutulolle, yksi Kelan asumistukiesimerkille sekä kahdeksan jakolinkkien palautumiselle ja virheille.

### Lint ja tuotantorakennus

- `bun run lint` (package.json:n `lint`-komento: `eslint .`) suoritettiin. **Läpäisi: 0 virhettä, 7 varoitusta.** Varoitukset koskevat kehityksen Fast Refresh -vientirakenteita nykyisissä komponenteissa. Niitä ei korjattu laajalla, toimintaan vaikuttamattomalla refaktoroinnilla.
- `npm run build` / `bun run build` -komentoa **ei ajettu käsin**, koska Lovable suorittaa TypeScript-/tuotantorakennustarkistuksen automaattisesti. Automaattisen tarkistuksen viimeisin havaittu tulos: **build OK, 20.11.2026 08:15:17 UTC**. Vercelin omaa tuotantorakennusta ei käynnistetty tai tarkistettu tämän korjauksen julkaisemiseksi.

### Selaintestit

Playwright + Chromium, työpöytä 1280×1800 ja puhelin 390×844:

- Kaksi opiskelijan tulotilaa ja marraskuun kuukausisuositus tarkistettiin konkreettisilla luvuilla.
- Jokaisen välilehden muuttunut syöte ja valittu välilehti palautuivat kopioidusta linkistä.
- Neljä rikkinäistä linkkimuotoa puhdistuivat ja ilmoituksen jatkopainike toimi.
- Asumistuen 229,25 euron tulos löytyi myös nollamuutoksen kuvaajapylväästä.
- Tulostuspainike kutsui selaimen tulostustoimintoa; jokaisesta laskurista luotiin ja tarkastettiin A4-PDF.
- Kaikissa kolmessa puhelinnäkymässä **ei vaakaylivuotoa**; kuvista tarkistettiin tulokset, tekstit ja kuvaaja.
- Suomenkielinen 404 avautui. Testattujen käyttökulkujen JavaScript-virheitä: **0**.

## 4. Viralliset lähteet ja epävarmuudet

Luettu Kelan ajantasaisilta sivuilta 20.11.2026:

- https://www.kela.fi/tulojen-vaikutus-korkeakoulussa — vuoden 2025/2026 tulorajataulukko, 374 euron sallittu ylitys, takaisinperintätaulukko, 7,5 % korotus ja opiskeluaikapoikkeus.
- https://www.kela.fi/yleistuki — 37,21 €/pv, 800,02 €/kk keskiarvo, 311 €/kk tarveharkintaraja ja 50 % vähennys. Palvelujaksot ja muut erityistilanteet pysyvät erillisessä Kelan arvion vaativassa tilassa.
- https://www.kela.fi/miten-tulot-ja-menot-vaikuttavat — Manner-Suomen ja Ahvenanmaan asumistukikaavat, kuntakohtaiset menokatot, omaisuusrajat ja Kelan Turun esimerkki: kaksi aikuista, tulot 1 800 €, hyväksytyt menot 652 €, omavastuu 472,50 €, tuki 125,65 €. Laskuri vastaa esimerkkiä uudessa testissä.
- https://www.kela.fi/yleinen-asumistuki — 70 % korvaus, alle 15 €/kk maksamisen raja ja ilmoitusvelvollisuus.

Toimivia etuuksien laskentakaavoja ei muutettu tällä kierroksella. Tulos on edelleen arvio. Kelan yksilöllinen ruokakunta-, omaisuus-, tulon kohdistus-, maksujakso- ja välipyöristystulkinta voi erota kuukausiarviosta. Opintotuen takaisinperinnän euromäärä vaatii maksettujen tukien määrät, eikä sitä keksitä. Aloittamis-/päättymisvuoden epäselvä perintä ja muut erityistilanteet vaativat Kelan päätöksen.

Fyysistä tulostinta, Safaria/Firefoxia, Googlen indeksointitilaa ja uusien muutosten Vercel-tuotantoversiota ei varmennettu. Vercelin automaattisen Git-julkaisun asetuksia ei luettu; koodin tallentaminen voi käynnistää ulkoisen julkaisun, jos käyttäjän Vercel on niin asetettu.

## 5. Muutetut tiedostot ja julkaisuvalmius

- `src/lib/calc.ts`: yhteiset esitettävät tulotilat ja yleistuen vertailutulo.
- `src/components/calc/StudentTab.tsx`: kaksi johdonmukaisesti nimettyä tulotilaa, kuukausisuosituksen peruste ja toimiva lähdelinkki.
- `src/components/calc/GeneralSupportTab.tsx`: kuvaajan yhteinen vertailutulo.
- `src/components/calc/HousingTab.tsx`: sentintarkat kuvaajaluvut ja toimiva lähdelinkki.
- `src/components/calc/parts.tsx`: korttien kutistuminen puhelimen leveyteen.
- `src/components/calc/ToolCards.tsx`, `src/routes/__root.tsx`: aiempien lint-virheiden muotoilukorjaukset.
- `src/routes/index.tsx`: jakolinkin validoinnin riippuvuudet ja nykyisen painikekomponentin käyttö ilmoituksessa.
- `src/styles.css`: vain tulostustilan A4-tiivistykset.
- `src/test/calc.test.ts`, `src/test/input-share.test.ts`: regressiotestit.
- `roadmap.md`, `qa-final-2026.md`: tehtävälista ja tämä raportti.

**Sovellus on tämän kierroksen tarkistusten perusteella valmis hyväksyttäväksi julkaisuun. Julkaisutoimintoa ei kutsuttu.** Muutokset tulevat julkiselle Vercel-sivulle vasta Vercelin uudessa julkaisussa; sen käynnistämistä ei tehty tässä.