import { html } from 'https://cdn.skypack.dev/lit@2.1.1?min';

export const styles = html`
  <style>
    :root {
      --asp-text-color: #444;
      --asp-button-color: var(--asp-text-color);
      --asp-on-button-color: #eee;
      --asp-background-color: gainsboro;
      --asp-header-height: 40px;
      --asp-iframe-background-color: white;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --asp-text-color: #eee;
        --asp-on-button-color: #555;
        --asp-background-color: #222;
      }
    }
    body {
      background-color: var(--asp-background-color);
      display: grid;
      height: 100vh;
      overflow: hidden;
      margin: 0;
      font-family: Helvetica, sans-serif;
    }
    body::backdrop {
      background-color: var(--asp-background-color);
    }
    h1 {
      font-size: 0.875rem;
      margin: 0;
      color: var(--asp-text-color);
      padding: 0 1rem;
      font-weight: normal;
      text-transform: uppercase;
    }
    h1 span {
      font-weight: bolder;
    }
    nav {
      padding: 0 1rem;
      justify-self: end;
      display: flex;
    }
    button {
      border: 0;
      color: var(--asp-on-button-color);
      background-color: var(--asp-text-color);
      border-radius: 4px;
      margin: 0.1rem;
      padding: 0.2rem 0.8rem;
      min-width: 10ch;
    }
    button[disabled] {
      opacity: 0.5;
    }
    app-shell-presenter {
      display: grid;
      grid-template-rows: var(--asp-header-height) 1fr;
      grid-template-columns: 1fr;
      place-content: center;
    }
    header {
      position: sticky;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
    main {
      justify-self: center;
      align-self: center;
      position: relative;
      display: block;
      background-repeat: no-repeat;
      background-size: cover;
    }
    iframe {
      border: 0;
      position: absolute;
      background-color: var(--asp-iframe-background-color);
    }
  </style>
`;

export const tablet = html`
  <style>
    main {
      width: 930px;
      height: 662px;
      background-image: url(tablet-landscape@1x.svg);
    }
    iframe {
      width: 792px;
      height: 594px;
      top: 34px;
      left: 69px;
    }
  </style>
`;

export const mobile = html`
  <style>
    main {
      width: 370px;
      height: 748px;
      background-image: url(mobile-portrait@1x.svg);
    }
    iframe {
      width: 320px;
      height: 570px;
      top: 89px;
      left: 25px;
    }
  </style>
`;

export const desktop = html`
  <style>
    main {
      background-image: none;
    }
    iframe {
      position: static;
      width: 100vw;
      height: calc(100vh - var(--asp-header-height));
    }
  </style>
`;

export const clean = html`
  <style>
    header {
      display: none;
    }
    app-shell-presenter {
      display: block;
    }
    main {
      width: 100vw;
      height: 100vh;
      background-image: none;
    }
    iframe {
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
    }
  </style>
`;
