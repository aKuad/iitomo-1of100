# iitomo-1of100

[![Version](https://img.shields.io/github/v/release/aKuad/iitomo-1of100)](https://github.com/aKuad/iitomo-1of100/releases)

Waratte iitomo! (A Japanese TV program) 1 of 100 survey system

![Top image](./assets/top-image.webp)

## What is 1of100?

Waratte iitomo! (everyone called it 'iitomo') is a Japanese TV program. 1of100 people is a game in the TV program.

100 audiences are in the studio. Then guest personality ask a true/false question to audiences.

If only 1 audience answered true, it success.

## Deployment

It's available on Deno Deploy: <https://iitomo-1of100.deno.dev/>

If you wish to deploy to own server, follow the step.

> [!NOTE]
>
> As requirements, install [Deno](https://deno.com/) at first.

Just only run `src/main.ts` by Deno:

```sh
cd src
deno run --allow-net --allow-read main.ts
```

## Using libraries/fonts

[qrcode.js](https://davidshimjs.github.io/qrcodejs/) - (c) 2012 davidshimjs

[DSEG](https://www.keshikan.net/fonts-e.html) - (c) 2017, keshikan (<http://www.keshikan.net>)

## License

QRCode.js - MIT License

DSEG - SIL OPEN FONT LICENSE

Other of them - CC0
