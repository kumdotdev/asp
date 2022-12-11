export const checkIsMobile = () =>
  // read https://web.dev/migrate-to-ua-ch/
  navigator.userAgentData
    ? navigator.userAgentData.mobile
    : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

export const capitalize = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

if (!Element.prototype.requestFullscreen) {
  Element.prototype.requestFullscreen =
    Element.prototype.mozRequestFullscreen ||
    Element.prototype.webkitRequestFullscreen ||
    Element.prototype.msRequestFullscreen;
}

if (!document.exitFullscreen) {
  document.exitFullscreen =
    document.mozExitFullscreen ||
    document.webkitExitFullscreen ||
    document.msExitFullscreen;
}

export const fullscreen = (mode = true, element = 'body') =>
  mode
    ? document.querySelector(element).requestFullscreen()
    : document.exitFullscreen();

// https://stackoverflow.com/a/69574526
export const swapIndex = (array, from, to) =>
  from < to
    ? [
        ...array.slice(0, from),
        ...array.slice(from + 1, to + 1),
        array[from],
        ...array.slice(to + 1),
      ]
    : [
        ...array.slice(0, to),
        array[from],
        ...array.slice(to, from),
        ...array.slice(from + 1),
      ];
