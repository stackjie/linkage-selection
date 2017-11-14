export function mergeOption (target, ...object) {
  for (let i = 0; i < object.length; i++) {
    const currObj = object[i];
    for (let key in currObj) {
      target[key] = currObj[key];
    }
  }

  return target;
}

export function triggerEvent (eventName, dom, ...opts) {
  const evt = document.createEvent('Events');
  evt.initEvent(eventName, ...opts);
  dom.dispatchEvent(evt);
}
