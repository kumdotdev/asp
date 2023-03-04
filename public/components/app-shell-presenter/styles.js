import { html } from 'https://cdn.skypack.dev/lit@2.1.1?min';

export const appStyles = html`
  <style>
    :root {
      --asp-h: 0deg;
      --asp-s: 0%;
      --asp-l: 46%;
      --asp-a: 1;
      --asp-text-color: hsla(var(--asp-h), var(--asp-s), var(--asp-l), var(--asp-a));
      --asp-background-color: hsla(var(--asp-h), var(--asp-s), 94%, var(--asp-a));
      --asp-header-height: 40px;
      --asp-iframe-background-color: var(--asp-background-color);
      --asp-highlight-color: hsl(var(--asp-h), var(--asp-s), 6%);
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --asp-l: 64%;
        --asp-background-color: hsla(var(--asp-h), var(--asp-s), 12%, var(--asp-a));
        --asp-highlight-color: hsl(var(--asp-h), var(--asp-s), 99%);
      }
    }
    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }
    body {
      color: var(--asp-text-color);
      background-color: var(--asp-background-color);
      display: grid;
      overflow: hidden;
      margin: 0;
      font-family: sans-serif;
      line-height: 1.5;
      min-height: 100vh;
      min-height: 100dvh;
    }
    body::backdrop {
      background-color: var(--asp-background-color);
    }
    button,
    select,
    textarea,
    input {
      font-family: inherit;
      font-size: inherit;
      color: var(--asp-text-color);
      padding: 1rem 1.5rem;
      border: 1px solid currentColor;
      border-radius: 2px;
      background-color: var(--asp-background-color);
      accent-color: var(--asp-text-color);
    }
    h1 {
      font-size: 0.875rem;
      margin: 0;
      color: var(--asp-text-color);
      font-weight: normal;
      text-transform: uppercase;
    }
    h1 span {
      color: var(--asp-highlight-color);
      font-weight: bolder;
    }
    nav {
      justify-self: end;
      display: flex;
    }
    header button {
      font-size: 0.75rem;
      margin: 0.1rem;
      padding: 0.2rem 0.8rem;
      border-color: transparent;
      cursor: pointer;
    }
    button[disabled],
    button.active {
      color: var(--asp-highlight-color);
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
      padding: 0 1rem;
    }
    main {
      justify-self: center;
      align-self: center;
      position: relative;
      display: block;
      background-repeat: no-repeat;
      background-size: cover;
    }
    form {
      display: grid;
      gap: 1.5rem;
      padding: 2rem;
      min-width: 24rem;
      background-color: hsla(var(--asp-h), var(--asp-s), var(--asp-l),.08);
      border-radius: 12px;
    }
    input[type="url"] {
      width: 100%;
    }
    input[type="url"]:focus {
      outline: 1px solid currentColor;
    }
    label {
      display: block;
      margin-bottom: .5rem;
    }
    label[for^="checkbox-"] {
      border: 1px solid hsla(var(--asp-h), var(--asp-s), var(--asp-l),.3);;
      border-radius: 2px;
      padding: .375rem 1.5rem;
      background-color: var(--asp-background-color);
    }
    input[type="checkbox"]:checked + span {
      color: var(--asp-highlight-color);
    }
    label[for^="checkbox-"] input {
      display: none;
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
      width: 1162px;
      height: 836px;
      background-image: url(tablet-landscape-1024@1x.svg);
    }
    iframe {
      width: 1024px;
      height: 768px;
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
