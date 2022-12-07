export const checkIsMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
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
