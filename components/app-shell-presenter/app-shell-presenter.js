import { html, LitElement } from 'https://cdn.skypack.dev/lit@2.1.1?min';
import { capitalize, checkIsMobile, fullscreen } from './utils.js';
import { styles, tablet, mobile, desktop, clean } from './styles.js';

class AppShellPresenter extends LitElement {
  static get properties() {
    return {
      devices: { type: Object },
      target: { type: String },
      state: { type: Object },
    };
  }

  constructor() {
    super();
    this.desktop = desktop;
    this.mobile = mobile;
    this.tablet = tablet;
  }

  connectedCallback() {
    super.connectedCallback();
    const params = new URLSearchParams(document.location.search.substring(1));
    params.has('path')
      ? (this.target = `${window.location.origin}/${params.get('path')}`)
      : (this.target = `${params.get('url')}`);
    params.has('device') && params.get('device') !== ''
      ? (this.devices = params
          .get('device')
          .split(',')
          .reduce(
            (acc, curr) => ((acc[curr] = this[curr.toLowerCase()]), acc),
            {}
          ))
      : (this.devices = { Tablet: tablet });
    this.state = {
      device: checkIsMobile() ? undefined : Object.entries(this.devices)[0][0],
    };
  }

  createRenderRoot() {
    return this;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  _handleClick(event) {
    this.setState({ device: event.target.getAttribute('data-device') });
  }

  _handleFullscreen() {
    const isFullscreen = document.fullscreenElement ? true : false;
    fullscreen(!isFullscreen);
  }

  render() {
    return html`
      ${styles} ${this.state.device ? this.devices[this.state.device] : clean}
      <header>
        <h1><span>App Shell</span> Presenter</h1>

        ${Object.entries(this.devices).length > 1
          ? html`
              <nav>
                ${Object.entries(this.devices).map(
                  ([key, value]) => html` <button
                    @click=${this._handleClick}
                    data-device=${key}
                    ?disabled=${key === this.state.device}
                  >
                    ${capitalize(key)}
                  </button>`
                )}
                <button @click=${this._handleFullscreen}>Fullscreen</button>
              </nav>
            `
          : ''}
      </header>
      <main>
        <iframe src="${this.target}"></iframe>
      </main>
    `;
  }
}

customElements.define('app-shell-presenter', AppShellPresenter);
