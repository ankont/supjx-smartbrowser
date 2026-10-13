// A double click must refer to the same resource as its first click, even after a layout change.
export function createResourceClickGuard() {
  let first;
  return {
    click(key, event) {
      if (!event?.detail || event.detail === 1) first = key;
    },
    accepts(key, event) { return event?.type !== 'dblclick' || first === key; },
  };
}
