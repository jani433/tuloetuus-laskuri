# Tarkastus ja korjaukset 2026

## Löydetyt ongelmat ennen korjausta
- Opintotuen takaisinperintä käyttää virheellistä 1 118 euron jakajaa eikä takaisinperintätaulukkoa; nolla tukikuukautta voi silti antaa takaisinperintää.
- Tukikuukausien laskenta pyöristyy eri tavalla tulorajassa ja takaisinperinnässä.
- Opiskelijan tulot oletetaan tasaisesti kertyviksi; toteutuneita tuloja ja opiskeluaikaa ei kysytä.
- Nykyinen kuukausi luetaan jo palvelinrenderöinnissä, jolloin laitteen kuukausi ja palvelimen kuukausi voivat erota.
- Yleistuki sovittelee kaikki tulot palkkana ja ohittaa tarveharkinnan.
- Asumistuki perustuu havainnollistavaan 29,4 prosentin muutokseen eikä ruokakunnan asumistukikaavaan.
- Asumistuen kuvaaja näyttää vain nousut ja voi ylittää sille varatun korkeuden.
- Syötteen virheelliset merkit poistetaan hiljaisesti, tyhjä kenttä muuttuu nollaksi ja negatiivinen arvo positiiviseksi.
- Jakopainike kopioi vain osoitteen eikä laskelman tietoja; epäonnistunut varakopiointi ilmoitetaan onnistuneeksi.
- Tulostettava yhteenveto puuttuu; testit kattavat vain muutaman perusrajan.

## Rajaus
Ulkoasu ja kolme välilehteä säilytetään. Tietoja ei tallenneta palveluun. Erityistilanteet, joita ei voida laskea luotettavasti, näytetään epävarmoina eikä niille keksitä euromäärää.

## Korjatut säännöt ja lähteet
Tarkistettu 20.11.2026 Kelan julkisista sivuista. Kelan englanninkieliset yksityiskohtaiset sivut sisältävät saman laitoksen laskentataulukot.

### Opintotuki
- 1–12 tukikuukauden tuloraja: 1 118 €/tukikuukausi ja 3 355 €/tueton kuukausi; 374 € sallittu ylitys.
- Takaisinperintätaulukko: 374,01–2 237 € = yksi kuukausi; 2 237,01–4 474 € = kaksi, edelleen 2 237 € välein. Ylitysvaraa EI vähennetä ennen pakollisen takaisinperinnän taulukkoa. Perintä ei ylitä saatuja tukikuukausia.
- Nolla tukikuukautta: ei takaisinperittävää opintotukea. 40 260 €:n kaavan jatketta ei esitetä tällöin opintotuen tulorajana.
- Toteutuneet ja tulevat tulot erotellaan; ei oletusta tasaisesta kertymästä eikä keksittyä ylityskuukautta.
- Aloitus-/valmistumis-/enimmäistukiajan vuoden opiskeluajan tarkistus on ehdollinen poikkeus. Opiskelukuukausien määrää ei käytetä tavallisen vuositulorajan alentamiseen. Poikkeuksen epäonnistuessa perintäkuukausia ei arvata.
- Vapaaehtoisen palautuksen määrä erotetaan pakollisesta perinnästä. Koko kuukauden palautus viimeistään 30.4.2027; perintäkorotus 7,5 %. Perinnän euromäärä edellyttää maksettuja tukimääriä.
- Lähteet: https://www.kela.fi/opintotuki ; https://www.kela.fi/impact-of-income-higher-education ; https://www.kela.fi/cancelling-or-paying-back-financial-aid-upper-secondary

### Yleistuki
- Voimassa 1.5.2026 alkaen, ei sovelleta tätä edeltäviin työttömyysetuusjaksoihin. 37,21 €/pv; 800,02 €/kk on 21,5 päivän keskiarvo, ei vakio maksuerä.
- Palkkatulot: vähennys 50 % ensimmäisestä eurosta. Tarveharkintatulot: yhteisen 311 €/kk rajan ylittävästä osasta 50 %. Pääoma-, vuokra- ja muut tarveharkintatulot summataan, palkat erikseen.
- Kelan suoraan vähennettäväksi vahvistamat muut etuudet vähennetään erikseen. Vanhempien tulot, palvelujaksot, eläke ja epäselvät etuudet merkitään erityistilanteiksi ilman keksittyä arviota.
- Ei oletettua yleistä 35 % vähimmäistukea. Tuki ei mene alle nollan tai yli syötetyn täyden tuen.
- Lähteet: https://www.kela.fi/yleistuki ; https://www.kela.fi/unemployment-general-social-security-benefit ; https://www.kela.fi/did-you-find-a-job

### Yleinen asumistuki
- Manner-Suomi: 70 % × max(0, hyväksytyt menot − omavastuu); omavastuu = max(0, 50 % × [tulot − (667 + 94 × aikuiset + 296 × lapset)]).
- Ahvenanmaa: 80 % korvaus, 42 % omavastuu ja kertoimet 667 + 111 × aikuiset + 246 × lapset. Tämä ei ole tuleva muutos vaan aluekohtainen sääntö.
- Menokatot: pääkaupunkiseutu 563/808/1019/1188 € (+148 €), nimetyt muut kunnat 447/652/828/981 € (+134 €), muut Manner-Suomen kunnat 394/574/734/875 € (+129 €), Ahvenanmaa 470/687/871/1032 € (+141 €).
- Vesi enintään 20 €/henkilö. Lämmitys 46+16 €/lisähenkilö; itäisillä määritellyillä alueilla 48+17 €, pohjoisilla 50+17 €; vain erikseen maksetut menot.
- Nettovarallisuus: velat vähennetään, talletuksista tehdään ensin henkilökohtainen 2 000 € vähennys. 10 000 € (yksi aikuinen) / 20 000 € (useampia aikuisia) ylittävästä osasta 20 % vuodessa tuloksi; vähintään 50 000 € nettovarallisuus estää tuen.
- Alle 15 €/kk ei makseta. Ilmoitusrajat +400/−200 €/kk säilyvät. Kuvaajan jokainen pylväs käyttää koko kaavaa, myös tulojen laskussa.
- Vanhat 29,4 % ja 50 € portaat poistettu todellisesta laskennasta. Omistusasunto ei kuulu yleiseen asumistukeen.
- Lähteet: https://www.kela.fi/yleinen-asumistuki ; https://www.kela.fi/yleinen-asumistuki-maara-ja-maksaminen ; https://www.kela.fi/housing-allowance-income-and-assets ; https://www.kela.fi/documents/d/guest/selkokielinen-esite-yleinen-asumistuki (2026)

## Uudet toiminnot
- Puuttuva numeerinen arvo on null, ei nolla. Pilkku, senttien tarkkuus ja suomalaiset välilyönnit toimivat. Virheelliset merkit, negatiiviset rahamäärät ja liian suuret arvot torjutaan. Kuukausia ei pyöristetä hiljaa.
- Yhteinen laskuritila säilyy välilehtiä vaihdettaessa. Versioitu jakolinkki sisältää kaikkien kolmen laskurin syötteet ja aktiivisen välilehden. Kaikki URL-arvot, tulolajit, kuntaryhmät ja ristiriidat tarkistetaan. Virheellinen linkki näyttää ilmoituksen ja oletusarvot.
- Kopioinnin onnistuminen vahvistetaan vain oikean onnistumisen jälkeen. Tulostus sisältää aktiivisen laskelman syötteet ja erittelyt; muut välilehdet, UKK ja työkalut eivät tulostu.
- Laitteen kuukausi tunnistetaan selaimessa; jaetun laskelman kuukausi säilyy muuttumattomana.
- Suomalaiset SEO-metat ja Search Console -tagi säilytetty; canonical ja og:url korjattu julkisen sivun absoluuttiseksi osoitteeksi.

## Testaus ja laadunvarmistus
- Lähtötilanne: 12 testiä läpäisi. Laajennettu kokonaisuus: 94 testiä, neljä tiedostoa, kaikki läpäisseet.
- `bunx vitest run`: 68 laskentatestiä, 20 syöte-/jakolinkkitestiä, 5 käyttöliittymätestiä ja yksi reititystesti.
- Opintotuki: 0–12 kk, kaikki 11 takaisinperinnän rajaa tasan ja sentin yli, 374/374,01 €, poikkeukset, puuttuvat syötteet ja toteutunut tulokertymä.
- Yleistuki: ei tuloja, palkka, pääoma, vuokra, muut tulot, 311 € alitus/tasatulo/ylitys, yhteisvähennykset, etuudet, nolla/enimmäismäärä ja erityistilanteet.
- Asumistuki: 1–5 henkilöä, aikuiset/lapset, kaikki kuntaryhmät, nousut/laskut, kulukatot, lämmitysalueet, omaisuuden rajat, velat, maksamisen alaraja ja puuttuvat tiedot.
- Käyttöliittymä: muutetut syötteet päivittyvät, virhe estää tuloksen, kopiointivirhe ei näytä onnistumista, jakolinkki sisältää arvot ja tulostuspainike käynnistää tulostuksen.
- Playwright/Chromium: kolme välilehteä, pilkkusyöte, tyhjä ja negatiivinen arvo, opiskelija- ja asumistukijakolinkin palautus samoilla tuloksilla, manipuloitu linkki, tulostuksen PDF. Sivun JavaScript-virheitä: 0.
- Näyttökoot 1280×1800 ja 390×844; kaikissa kolmessa puhelinnäkymässä ei vaakaylivuotoa. Tuloskorttien ja asumistuen kuvaajan kuvat tarkistettu.
- Lovablen automaattinen TypeScript-/tuotantorakennustarkistus onnistui (`build OK`). Rakennusta ei ajettu erikseen toiseen kertaan käsin.

## Manuaalisesti varmistettavat rajaukset
- Kelan julkiset sivut eivät määrittele kaikkien yhdistelmätilanteiden välipyöristyksiä tai yleistuen yleistä pienimmän maksun alarajaa. Tulokset ovat kuukausiarvioita, eivät virallisia maksupäätöksiä.
- Yleistuen vanhempien tulot, työaika/oikeus etuuteen, palvelujaksot ja osittaisen vanhuuseläkkeen siirtymäsäännön täsmällinen voimaantulo vaativat erillisen päätöstiedon. Niitä ei esitetä laskettuina tavallisella kaavalla.
- Opintotuen opiskeluajan alku/loppu, tulon kohdistus ja maksettujen kuukausien tukimäärät on varmistettava. Tulorajan ylitys ei automaattisesti kerro perinnän euromäärää.
- Asumistuen ruokakunnan oikea koostumus, lasten varallisuus, yritysomaisuuden arvostus, sähkön sisältävä vuokra, alivuokraus ja erityiset tulolajit on tarkistettava. Niitä varten on erityistilannevalinta.
- Talletukset syötetään henkilökohtaisten vähennysten jälkeen; ruokakunnan tulot syötetään kaikkien Kelan huomioitavien tulolajien yhteissummana. Laskuri ei tulkitse vero-/palkkatodistuksia eikä päättele puuttuvia tietoja.
- Julkinen sivu ei ole automaattisesti julkaistu tämän korjauksen mukana. Fyysisen tulostimen, Safari-/Firefox-selainten ja julkaistun sivun lopullinen tarkistus jää julkaisemisen jälkeen tehtäväksi.

## Muutetut tiedostot
- `src/lib/calc.ts`, uusi `src/lib/input.ts`, uusi `src/lib/calculator-state.ts`
- `src/components/calc/StudentTab.tsx`, `GeneralSupportTab.tsx`, `HousingTab.tsx`, `parts.tsx`, `Faq.tsx`, uusi `CalculatorContext.tsx`
- `src/routes/index.tsx`, `src/routes/__root.tsx`, `src/styles.css`
- `src/test/calc.test.ts`, `src/test/setup.ts`, uudet `input-share.test.ts` ja `calculator-ui.test.tsx`
- `AGENTS.md`, `roadmap.md`, tämä tarkastusraportti