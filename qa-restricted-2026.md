# Rajattu loppukorjaus 20.11.2026

## Korjaukset
- Aiemmat opiskelijan tulotilakorjaukset ja jakolinkit todettiin toimiviksi ja säilytettiin. Toteutuneiden tulojen jälkeen 10 501 €, ennustetun vuositulon jälkeen 8 501 €. Marraskuun 5 250,50 €/kk tarkoittaa kaikkien tulevien tulojen enimmäisarviota, ei ennusteen päälle saatavaa lisätuloa. Ennuste vähennetään kerran.
- Yleistuen erityistilanteen valinnan ja ilmoituksen rajauksia täsmennettiin: vanhempien tulot/työssäoloehto, palvelujaksot, eläke ja päätöspäivä, yrittäjyys, työaika sekä oikeus etuuteen. Erityistilanne estää euromääräisen arvion. Kaavoja ei muutettu.
- Tietosuojaväite korjattiin: laskuri ei tallenna syötteitä tietokantaan tai lähetä niitä laskentapalveluun, mutta jakolinkki sisältää kaikkien välilehtien syötteet. Vastaanottaja näkee ne; osoite voi tallentua selaimen historiaan ja palvelinlokeihin. HTTP-osoitteen kyselyä ei voi pitää salaisena palvelimelta, eikä sitä väitetä sellaiseksi.
- Nykyiset Figtree-/Manrope-kirjasimet toimitetaan paikallisina tiedostoina Google Fonts -pyyntöjen sijaan. Referrer asetettiin arvoon no-referrer. Sovelluksen oma ulkoinen virheraportointi poistettiin tuotantotilassa; kehitystilassa lähetetään vain yleinen virheilmoitus, ei raakoja virheitä, laskurisyötteitä tai URL-sisältöä. Sivun konsolivirhe on myös yleinen ilman raakaa virhettä.

## Lähteet ja asumistuen yksinkertaistukset
Kelan sivu https://www.kela.fi/yleistuki luettiin uudelleen 20.11.2026: 311 €/kk, vanhempien tulot ja ehdollinen 35 % vähimmäismäärä, palveluajan tarveharkintapoikkeus sekä ennen 1.5.2026 myönnetyn osittaisen varhennetun vanhuuseläkkeen rajaus. Ne eivät oikeuta laskemaan palvelujaksoja/eläkkeitä tavallisena tulolajina; käyttäjää ohjataan erityistilanteeseen.

https://www.kela.fi/miten-tulot-ja-menot-vaikuttavat, luettu saman päivän edellisessä tarkistuksessa:
- Eino ja Elisa, Turku: 2 aikuista, tulot 1 800 €, menot 950 €, hyväksytään 652 €, omavastuu 472,50 €, tuki 125,65 €. Testi ja selaimen syöttökoe vastaavat kaikkia laskelman lukuja.
- Pekka: 15 000 € sijoitus, 10 000 € ylittävästä osasta 20 % vuodessa -> 83,33 €/kk. Uusi lähde-esimerkkitesti läpäisi.
- Maija: Helsinki, vuokra 800 €, enimmäismeno 563 €. Uusi testi läpäisi.
- Tommi ja Pauliina: Turku, 2 henkilöä, vuokra 750 €, enimmäismeno 652 €. Uusi testi läpäisi.

Asumistuki edellyttää käyttäjän itse määrittelemää ruokakuntaa ja Kelan huomioitavia tuloja. Talletukset annetaan henkilökohtaisten 2 000 € vähennysten jälkeen; omaisuuden arvostusta, lasten omaisuutta tai todistuksia ei päätellä. Pysyvä/12 kuukauden keskiarvotulo annetaan yhtenä kuukausilukuna. Kelan välipyöristykset, tulon kohdistus, alivuokraus ja muut erityismenot eivät ole täydellisesti mallinnettuja. Erityistilannevalinta estää arvion. Kuvaaja pitää muut syötteet vakioina. Arvio ei ratkaise oikeutta etuuteen.

## Todelliset testitulokset
- `bun run test` (`vitest run`): **112/112 läpäisi, 5 tiedostoa**. 75 laskentatestiä, 28 syöte-/jakolinkkitestiä, 6 käyttöliittymätestiä, 2 virheraportoinnin tietosuojatestiä ja 1 reititystesti. Tuotantotilan raportointikoukkuja ei kutsuta; kehitystilassa raakaa virhettä/syötteitä ei välitetä.
- `bun run lint` (`eslint .`): **0 virhettä, 7 aiempaa Fast Refresh -varoitusta**, komento läpäisi.
- Tuotantorakennusta ei ajettu käsin: Lovable suorittaa automaattisen TypeScript-/tuotantorakennustarkistuksen. Viimeisin havaittu tulos **build OK 20.11.2026 08:22:31 UTC**. Vercelin omaa julkaisurakennusta ei käynnistetty.
- Playwright/Chromium: kolme välilehteä, jakolinkin muokattujen syötteiden palautuminen, rikkinäiset/vanhat/vajaat/erikoismerkkiset linkit ja puhdas osoite, tulotilojen konkreettiset arvot, kuukausisuositus, tyhjän syötteen estämä jakaminen, erityistilanteen estämä tulos, Kelan Turun esimerkki syötteistä tulokseen, suomalainen 404, tulostuskutsu ja A4-PDF:t sekä mobiili 390×844 / työpöytä 1280×1800. Vaakaylivuotoa tai JavaScript-virheitä ei havaittu. Tulostusnäkymän painikkeet ja työkalut piilossa.
- Verkkoliikenne havainnoitiin selaimessa etusivulta muutettuihin taloustietoihin, jakamiseen ja linkin avaamiseen: **0 ulkoista verkkopyyntöä**. Kirjasimet latautuivat omalta sivustolta. Tämä koskee testattua paikallista sovellusta, ei kaikkia hosting-/editorialustan omia mittauksia.

## Tiedostot ja rajoitukset
Muutettiin: `src/routes/index.tsx`, `src/routes/__root.tsx`, `src/components/calc/GeneralSupportTab.tsx`, `src/lib/lovable-error-reporting.ts`, `src/styles.css`, `src/test/calc.test.ts`, `src/test/calculator-ui.test.tsx`, uusi `src/test/privacy.test.ts`, `package.json`, `bun.lock`, `AGENTS.md`, `roadmap.md`, tämä raportti.

Ei muutettu opintotuen/asumistuen kaavoja tai toimivia jakolinkkejä. Sovellusvirhesivun ja palvelimen varavirhesivun suomenkieliset tekstit tarkistettiin lähdekoodista; todellista tuotannon palvelinvirhettä ei aiheutettu. Fyysinen tulostin, Safari/Firefox ja Vercelin julkaisun verkkoliikenne tai lokien säilytysaika eivät ole varmennettuja. Julkaisutoimintoa ei käytetty. Ulkoisen Vercel-palvelun Git-automaattijulkaisun asetuksia ei luettu.