(() => {
  const now = Date.now();

  const f = ((element, seconds, prefix) => {
    if (seconds <= 0) {
      element.innerHTML = '&nbsp;';
      return;
    }
    const days = (seconds / 86400) | 0;
    const hours = ((seconds % 86400) / 3600) | 0;
    const minutes = ((seconds % 3600) / 60) | 0;
    seconds = seconds % 60;

    if (days > 0) {
      element.textContent = prefix + days + ' day' + (days != 1 ? 's' : '') +
          ', ' + hours + ' hour' + (hours != 1 ? 's' : '');
    } else if (hours > 0) {
      element.textContent = prefix + hours + ' hour' + (hours != 1 ? 's' : '') +
          ', ' + minutes + ' minute' + (minutes != 1 ? 's' : '');
    } else if (minutes > 0) {
      element.textContent = prefix + minutes + ' minute' + (minutes != 1 ? 's' : '') +
          ', ' + seconds + ' second' + (seconds != 1 ? 's' : '');
    } else {
      element.textContent = prefix + seconds + ' second' + (seconds != 1 ? 's' : '');
    }
  });

  const elapsed = ((Date.now() - now) / 1000) | 0;
  const startIn = document.getElementsByName("start_in")[0].content - elapsed;
  const endsIn = document.getElementsByName("ends_in")[0].content - elapsed;

  if (startIn <= 0 && endsIn <= 0) {
    const elements = document.getElementsByClassName('ctfd-event-countdown');
    for (let i = 0; i < elements.length; i++) {
      elements[i].innerHTML = '&nbsp;';
    }
    return;
  }

  setInterval(() => {
    const elapsed = ((Date.now() - now) / 1000) | 0;
    const elements = document.getElementsByClassName('ctfd-event-countdown');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      let seconds = document.getElementsByName("start_in")[0].content - elapsed;
      if (seconds > 0) {
        f(element, seconds, "Starts in ");
      } else {
        seconds = document.getElementsByName("ends_in")[0].content - elapsed;
        f(element, seconds, "Ends in ");
      }
    }
  }, 1000);
})();
