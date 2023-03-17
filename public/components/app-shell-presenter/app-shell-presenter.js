import {
  html,
  LitElement,
  nothing,
} from 'https://cdn.skypack.dev/lit@2.1.1?min';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.3.0/dist/components/color-picker/color-picker.js';
import { capitalize, checkIsMobile, fullscreen, swapIndex } from './utils.js';
import {
  appStyles,
  tablet,
  mobile,
  mobile_xs,
  desktop,
  clean,
} from './styles.js';

const AVAILABLE_DEVICES = ['mobile', 'tablet', 'desktop', 'mobile_xs'];

const initialState = {
  availableDevices: AVAILABLE_DEVICES,
  currentDevice: null,
  devices: [],
  edit: true,
  // To-Do: use array methods to fill in styles
  styles: {
    tablet: { ...tablet },
    mobile: { ...mobile },
    desktop: { ...desktop },
    mobile_xs: { ...mobile_xs },
  },
  uiState: {
    backgroundcolor: '#333333',
    backgroundcolor_light: '#efefef',
    devices: [],
    url: '',
  },
};

class AppShellPresenter extends LitElement {
  static properties = {
    state: { type: Object },
  };

  constructor() {
    super();
    //this.setState(initialState);
  }

  connectedCallback() {
    super.connectedCallback();
    const params = new URLSearchParams(document.location.search);
    const backgroundcolor = params.get('backgroundcolor') ?? '#333333';
    const backgroundcolor_light = params.get('backgroundcolor_light') ?? '#efefef';
    const url = params.get('url') ?? '';
    const devices = params.get('devices')
      ? params
          .get('devices')
          .split(',')
          .map((device) => device.toLowerCase())
      : [AVAILABLE_DEVICES[0]];

    this.state = { ...initialState };
    console.log(this.state);
    if (params.get('url')) {
      this.state = {
        ...this.state,
        availableDevices: [...new Set([...devices, ...AVAILABLE_DEVICES])],
        currentDevice: devices ? devices[0] : AVAILABLE_DEVICES[0],
        edit: !url,
        uiState: {
          ...this.state.uiState,
          backgroundcolor,
          backgroundcolor_light,
          devices,
          url,
        },
      };
    }
  }

  createRenderRoot() {
    return this;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    if (location.hostname == 'localhost') {
      console.log('State ', this.state);
    }
    history.replaceState(
      null,
      null,
      `${location.pathname}?${new URLSearchParams(
        this.state.uiState,
      ).toString()}`,
    );
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
    const { availableDevices } = this.state;
    const { currentDevice } = this.state.uiState;
    const form = new FormData(event.target);
    const backgroundcolor = form.get('backgroundcolor');
    const url = form.get('url');
    const devices = availableDevices.filter((item) => form.has(item));
    this.setState({
      uiState: {
        ...this.state.uiState,
        backgroundcolor,
        devices,
        url,
      },
      currentDevice: devices.includes(currentDevice)
        ? currentDevice
        : devices[0],
      edit: !url.length,
    });
    // location.search = `url=${url}&backgroundcolor=${backgroundcolor}&device=${devices.join(
    //   ',',
    // )}`;
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

  _handleColorInput(event) {
    this.setState({
      uiState: {
        ...this.state.uiState,
        [event.target.name]: event.currentTarget.value,
      },
    });
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
    const { availableDevices } = this.state;
    const { backgroundcolor, backgroundcolor_light, devices, url } =
      this.state.uiState;
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
          <label>Mobile Background</label>
          <div style="display:grid;grid-auto-flow:column">
            <div>
              <label>Dark Theme</label>
              <sl-color-picker
                name="backgroundcolor"
                .value=${backgroundcolor}
                @sl-change=${this._handleColorInput}
                label="Select a color"
              >
              </sl-color-picker>
            </div>
            <div>
              <label>Light Theme</label>
              <sl-color-picker
                name="backgroundcolor_light"
                .value=${backgroundcolor_light}
                @sl-change=${this._handleColorInput}
                label="Select a color"
              >
              </sl-color-picker>
            </div>
          </div>
        </div>
        <div>
          <button type="submit">Activate Setting</button>
        </div>
      </form>
    `;
  }

  viewHeader() {
    const { currentDevice, edit } = this.state;
    const { devices } = this.state.uiState;
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
    const { currentDevice, edit, styles } = this.state;
    const { backgroundcolor, backgroundcolor_light, url } = this.state.uiState;

    if (edit) {
      return html`
        ${appStyles} ${this.viewHeader()}
        <main>${this.viewEditForm()}</main>
      `;
    }
    // default view
    return html`
      ${appStyles}
      <style>
        iframe {
          background-color: ${backgroundcolor};
        }
        @media (prefers-color-scheme: light) {
          iframe {
            background-color: ${backgroundcolor_light};
          }
        }
      </style>
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
