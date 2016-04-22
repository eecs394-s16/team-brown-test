window.appgyverModal = (function () {

  var BACKDROP_CLASS = "appgyver-modal__backdrop";
  var DIALOG_CLASS = "appgyver-modal__dialog";

  var getAvailableZIndex = (function(){
    // Last used high-ish z-index value
    // This is needed to keep the latest modals on top of everything else
    var highestZ = 1000;
    // Find out the highest z-index value under body (modals are appended to body)
    document.addEventListener("DOMContentLoaded", function() {
      var getComputedZIndex = function(el) {
        var zIndex;
        if (window.getComputedStyle) zIndex = document.defaultView.getComputedStyle(el, null).getPropertyValue("z-index");
        else if (el.currentStyle) zIndex = el.currentStyle["zIndex"];
        return (parseInt(zIndex) ? parseInt(zIndex) : 0);
      };
      var bodyChilds = document.querySelectorAll("body > *");
      var zCandidate = 0;
      for (var i=0; i<bodyChilds.length; i++) {
        zCandidate = getComputedZIndex(bodyChilds[i]);
        if (zCandidate >= highestZ) highestZ = zCandidate + 10;
      };
    });
    // Return a function which increments the last used z-index value and return it
    return function() {
      return highestZ = highestZ + 10;
    };
  })();

  /*
   * Private API functionalities
   */

  var openNewBackdrop = function() {
    var backdrop = document.createElement("DIV");
    backdrop.classList.add(BACKDROP_CLASS);
    backdrop.style.zIndex = getAvailableZIndex();
    backdrop.onclick = function(e) {
      e.stopPropagation();
      close();
      return false;
    };
    document.body.appendChild(backdrop);
    return backdrop;
  };

  var openNewModuleIframe = function(backdropElem, pathForIframe) {
    // Dialog DIV
    var dialog = document.createElement("DIV");
    dialog.classList.add(DIALOG_CLASS);
    // Dialog IFRAME
    var iframe = document.createElement("IFRAME");
    iframe.setAttribute("data-module", "");
    iframe.src = pathForIframe;
    // Append and finish
    dialog.appendChild(iframe);
    backdropElem.appendChild(dialog);
    supersonic.module.iframes.register(iframe);
    return dialog;
  };

  /*
   * Public API functionalities.
   */

  var open = function(path) {
    openNewModuleIframe(openNewBackdrop(), path);
  };

  var close = function() {
    var backdrops = document.querySelectorAll("body > *."+BACKDROP_CLASS);
    var dialogs = document.querySelectorAll("body > *."+DIALOG_CLASS);
    if (dialogs.length) dialogs[dialogs.length-1].remove();
    if (backdrops.length) backdrops[backdrops.length-1].remove();
  };

  return {
    open: open,
    close: close
  };

})();
