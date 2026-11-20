# Tuloetuus Laskuri

Rakenna selkeä, moderni ja mobiiliystävällinen suomenkielinen verkkosovellus nimeltä "Sivutulo & Tuet -laskuri 2026". Sovellus auttaa arvioimaan nopeasti, miten sivutulot (esim. keikkatyö, freelance tai alustatyö) vaikuttavat Kelan tukiin vuonna 2026.



Sovelluksessa tulee olla 3 välilehteä (tabia) elämäntilanteen mukaan:



1. Välilehti: Opiskelija (Opintotuki & asumislisä 2026)

- Syötteet: Tukikuukausien määrä kalenterivuodessa (liukusäädin 1–12 kk, oletus 9 kk) ja arvioitu koko vuoden bruttotulo yhteensä (€).

- Laskentalogiikka (vuoden 2026 säännöt): 

  - Vuosituloraja = tukikuukaudet * 1 118 € + tuettomat kuukaudet * 3 355 €.

  - Ylitysvara (vapaa marginaali) = +374 € vuositulorajan päälle.

- Tulokset: Näytä visuaalisella mittarilla (progress bar), paljonko tulorajaa on vielä jäljellä, milloin raja ylittyy, ja suositeltu kuukausittainen sivutulo lopuille kuukausille. Lisää varoitus, jos raja ylittyy (7,5 % korotus takaisinperinnässä).



2. Välilehti: Työtön työnhakija (Yleistuki 2026)

- Syötteet: Nykyinen tuki (oletus täysi yleistuki 37,21 €/pv eli noin 800 €/kk, muokattavissa) ja arvioitu kuukauden sivutulo brutto (€, liukusäädin 0–2 000 €).

- Laskentalogiikka (2026 säännöt):

  - Yleistuessa ei ole erillistä suojaosaa: jokainen tienattu bruttoeuro vähentää tukea 50 senttiä (soviteltu tuki = täysi tuki - 0,5 * bruttotulo, minimi 0 €).

  - Näytä kokonaistulot yhteensä (sivutulo + jäljelle jäävä yleistuki) ja vertaa sitä tilanteeseen ilman sivutuloa ("Paljonko jäät oikeasti plussalle").



3. Välilehti: Yleinen asumistuki (Suuntaa-antava tulovaikutus)

- Syötteet: Nykyinen asumistuki (€/kk) ja kuukausitulojen muutos (€/kk).

- Laskentalogiikka & muistutus: Näytä selkeä muistutus, että Kelaan tulee ilmoittaa, jos tulot nousevat vähintään 400 €/kk tai laskevat vähintään 200 €/kk edelliseen päätökseen verrattuna. Havainnollista, että tulojen nousu pienentää asumistukea portaittain.



Ulkoasu ja lisäominaisuudet:

- Käytä rauhallista, luotettavaa suomalaista fintech-tyyliä (valkoinen tausta, tummansininen ja vihreä korostusväri, suuret selkeät numerot).

- Lisää sivun yläreunaan selkeä ilmoitus: "Suuntaa-antava arvio vuoden 2026 sääntöjen mukaan – tarkista virallinen päätös aina OmaKelasta."

- Lisää sivun alareunaan "Hyödylliset työkalut" -kortit (valmiit paikat kumppanuuslinkeille: Kevytyrittäjyyspalvelu laskutukseen, Ulkomaan maksujen vastaanotto, OmaKela).

- Toteuta ilman tietokantaa tai kirjautumista, kaikki laskenta toimii suoraan selaimessa reaaliajassa.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://tuloetuus-laskuri.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1f9d7bff-0267-4bea-bf98-6639f1e43b1a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
