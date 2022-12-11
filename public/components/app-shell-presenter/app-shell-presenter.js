import {
  html,
  LitElement,
  nothing,
} from 'https://cdn.skypack.dev/lit@2.1.1?min';
import { capitalize, checkIsMobile, fullscreen, swapIndex } from './utils.js';
import { appStyles, tablet, mobile, desktop, clean } from './styles.js';

const AVAILABLE_DEVICES = ['tablet', 'mobile', 'desktop'];

const initialState = {
  availableDevices: AVAILABLE_DEVICES,
  currentDevice: null,
  devices: [],
  edit: false,
  // To-Do: use array methods to fill in styles
  styles: {
    tablet: { ...tablet },
    mobile: { ...mobile },
    desktop: { ...desktop },
  },
  url: '',
};

class AppShellPresenter extends LitElement {
  static properties = {
    state: { type: Object },
  };

  constructor() {
    super();
    this.setState(initialState);
  }

  connectedCallback() {
    super.connectedCallback();
    const { currentDevice } = this.state;
    const params = new URLSearchParams(document.location.search.substring(1));
    const url = params.get('url') ?? '';
    const devices = params.get('device')
      ? params
          .get('device')
          .split(',')
          .map((device) => device.toLowerCase())
      : [AVAILABLE_DEVICES[0]];
    this.setState({
      availableDevices: [...new Set([...devices, ...AVAILABLE_DEVICES])],
      currentDevice: devices ? devices[0] : AVAILABLE_DEVICES[0],
      edit: !url,
      devices,
      url,
    });
  }

  createRenderRoot() {
    return this;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    if (location.hostname == 'localhost') {
      console.log('State ', this.state);
    }
  }

  _handleClick(event) {
    this.setState({ currentDevice: event.target.getAttribute('data-device') });
  }

  _handleClickEdit(event) {
    this.setState({ edit: !this.state.edit });
  }

  _handleFullscreen() {
    const isFullscreen = document.fullscreenElement ? true : false;
    fullscreen(!isFullscreen);
  }

  async _handleSubmit(event) {
    event.preventDefault();
    const { availableDevices, currentDevice } = this.state;
    const form = new FormData(event.target);
    const url = form.get('url');
    const devices = availableDevices.filter((item) => form.has(item));
    this.setState({
      currentDevice: devices.includes(currentDevice)
        ? currentDevice
        : devices[0],
      devices,
      edit: !url.length,
      url,
    });
    location.search = `url=${url}&device=${devices.join(',')}`;
  }

  _handleDragStart(event) {
    // console.log('Start dragging: ', event.currentTarget.id);
    event.currentTarget.style.opacity = 0.3;
    event.dataTransfer.setData('text/plain', event.currentTarget.id);
    event.dataTransfer.effectAllowed = 'move';
  }

  _handleDragEnd(event) {
    // console.log('End dragging: ', event.currentTarget.id);
    event.currentTarget.style.opacity = 1;
    event.dataTransfer.clearData();
  }

  _handleDragEnter(event) {
    // console.log('Enter: ', event.currentTarget.id);
    event.currentTarget.style.borderStyle = 'dashed';
  }

  _handleDragLeave(event) {
    // console.log("Leave: ", event.currentTarget.id);
    event.currentTarget.style.borderStyle = 'solid';
  }

  _handleDragOver(event) {
    // console.log("Over: ", event.currentTarget.id);
    event.preventDefault();
    event.stopPropagation();
  }

  _handleDrop(event) {
    const { availableDevices } = this.state;
    const target = event.currentTarget;
    const source = event.dataTransfer.getData('text/plain');
    target.style.borderStyle = 'solid';
    console.log(`Dropped ${source} to ${target.id}`);
    const sourceIndex = availableDevices.indexOf(source);
    const targetIndex = availableDevices.indexOf(target.id);
    this.setState({
      availableDevices: swapIndex(availableDevices, sourceIndex, targetIndex),
    });
  }

  viewEditForm() {
    const { availableDevices, devices, url } = this.state;
    return html`
      <form @submit=${this._handleSubmit}>
        <div>
          <label>Enter an URL</label>
          <input
            type="url"
            name="url"
            .value=${url}
            placeholder="https://..."
            pattern="https://.*"
            required
          />
        </div>
        <div>
          <label>Activate and sort devices.</label>
          <span>
            ${availableDevices.map(
              (device) => html`
                <label
                  id="${device}"
                  for="checkbox-${device}"
                  class="${devices.includes(device) ? 'active' : ''}"
                  draggable="true"
                  @dragstart=${this._handleDragStart}
                  @dragend=${this._handleDragEnd}
                  @dragenter=${this._handleDragEnter}
                  @dragleave=${this._handleDragLeave}
                  @dragover=${this._handleDragOver}
                  @drop=${this._handleDrop}
                >
                  <input
                    id="checkbox-${device}"
                    name=${device}
                    type="checkbox"
                    ?checked=${devices.includes(device)}
                  />
                  <span> ${capitalize(device)} </span>
                </label>
              `,
            )}
          </span>
        </div>
        <div>
          <button type="submit">Activate Setting</button>
        </div>
      </form>
    `;
  }

  viewHeader() {
    const { currentDevice, devices, edit } = this.state;
    return html`
      <header>
        <h1><span>App Shell</span> Presenter</h1>
        <nav>
          ${devices.length > 1 && !edit
            ? html`
                ${devices.map(
                  (device) => html` <button
                    @click=${this._handleClick}
                    data-device=${device}
                    ?disabled=${device === currentDevice}
                  >
                    ${capitalize(device)}
                  </button>`,
                )}
              `
            : nothing}
          <button @click=${this._handleFullscreen}>Fullscreen</button>
          <button
            class="${edit ? 'active' : ''}"
            @click=${this._handleClickEdit}
          >
            <svg
              width="21"
              height="7"
              viewBox="0 0 21 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="4.5"
                cy="3.5"
                r="1.5"
                fill="currentColor"
              />
              <circle
                cx="10.5"
                cy="3.5"
                r="1.5"
                fill="currentColor"
              />
              <circle
                cx="16.5"
                cy="3.5"
                r="1.5"
                fill="currentColor"
              />
            </svg>
          </button>
        </nav>
      </header>
    `;
  }

  render() {
    const { currentDevice, edit, styles, url } = this.state;

    if (edit) {
      return html`
        ${appStyles} ${this.viewHeader()}
        <main>${this.viewEditForm()}</main>
      `;
    }
    // default view
    return html`
      ${appStyles}
      ${currentDevice && !checkIsMobile() ? styles[currentDevice] : clean}
      ${this.viewHeader()}
      <main>
        ${url
          ? html`<iframe src="${url}"></iframe>`
          : html`
              <div style="display:grid;place-content:center;height:100%">
                <p style="color:var(--asp-highlight-color)">
                  No Website URL provided!
                </p>
                <button @click=${this._handleClickEdit}>Edit</button>
              </div>
            `}
      </main>
    `;
  }
}

customElements.define('app-shell-presenter', AppShellPresenter);
