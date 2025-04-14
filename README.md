# iitomo-1of100

[![Version](https://img.shields.io/github/v/release/aKuad/iitomo-1of100)](https://github.com/aKuad/iitomo-1of100/releases)

Waratte iitomo! (A Japanese TV program) 1 of 100 survey system

![Top image](./assets/top-image.webp)

## What is 1of100?

Waratte iitomo! (everyone called it 'iitomo') is a Japanese TV program. 1of100 people is a game in the TV program.

100 audiences are in the studio. Then guest personality ask a true/false question to audiences.

If only 1 audience answered true, it success.

## Usage

### 1. Moderator join

Access to `/` (index). For Deno Deploy, <https://iitomo-1of100.deno.dev/>.

![Screen - Top page](./assets/1-moderator-join.webp)

Input custom ID. Or empty, random generated ID will be applied.

Then press `Moderator` button.

### 2. Survey configuration

`Esc` key to show/hide config panel.

![Screen - Moderator config](./assets/2-moderator-config.webp)

### 3. Participant join

#### By QR (recommended)

Participant join QR is shown on moderator config panel.

![Screen - Participant join QR](./assets/3-participant-join-qr.webp)

By clicking the QR, large view shown.

![Screen - Participant join QR large](./assets/3-participant-join-qr-large.webp)

Just only scan it.

#### By ID

Access to `/` (index).

![Screen - Participant join by ID](./assets/3-participant-join-id.webp)

Input ID (shown on moderator config panel), then press `Participant` button.

### 4. Survey start

`Enter` key to start survey, or press the button.

![Screen - Survey start button](./assets/4-survey-start.webp)

![Screen - Survey waiting](./assets/4-survey-waiting.gif)

During survey, checkbox be enable.

![Screen - Participant response UI](./assets/4-survey-participant.webp)

Finally, count of True of participants will be shown on moderator screen.

![Screen - Survey result](./assets/4-survey-result.webp)

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
