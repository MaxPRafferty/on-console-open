/** @format */

module.exports = function onConsoleOpen(onOpenCb, onCloseCb, setupRemoval) {
  onOpenCb =
    onOpenCb ||
    function() {
      return null;
    };
  onCloseCb =
    onCloseCb ||
    function() {
      return null;
    };
  setupRemoval =
    setupRemoval ||
    function() {
      return null;
    };
  const onOpen = document.createEvent('CustomEvent');
  onOpen.initCustomEvent('console-open', true, true, {});
  const onClose = document.createEvent('CustomEvent');
  onClose.initCustomEvent('console-close', true, true, {});
  let devtools = /./;
  devtools.toString = function() {
    this.opened = true;
  };
  let lastState = !!devtools.opened;

  document.addEventListener('console-open', () => {});

  return new Promise(function(s, f) {
    let hasFired = false;
    let hasFailed = false;
    setupRemoval(
      setInterval(function() {
        try {
          if (lastState !== !!devtools.opened) {
            if (lastState) {
              document.dispatchEvent(onClose);
              onOpenCb();
            } else {
              document.dispatchEvent(onOpen);
              onCloseCb();
              if (!hasFired) {
                hasFired = true;
                s();
              }
            }
          }
        } catch (err) {
          hasFailed = true;
          if (!hasFailed) {
            f(err);
          }
        }
        lastState = !!devtools.opened;
      }, 100),
    );
  });
};
