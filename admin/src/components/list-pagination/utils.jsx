const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const first = ({ pages, activePage }) => {
  return Array.from({ length: clamp(pages, 1, 3) }, (x, i) => ({
    type: 'PageItem',
    label: (i + 1).toString(),
    value: i + 1,
    active: activePage === i + 1,
  }));
};

const middle = ({ pages, activePage }) => {
  const dotsStart = {
    type: 'DotsItem',
    display: false,
    value: 0,
    additional: undefined,
  };

  const dotsEnd = {
    type: 'DotsItem',
    display: false,
    value: 1,
    additional: undefined,
  };

  if (pages < 4) return { dotsStart, dotsEnd, items: [] };

  const arr = Array.from({ length: pages }).map((_value, index) => index + 1);
  arr.splice(0, 3);
  const omega = arr.length > 6 ? arr.splice(arr.length - 3, 3) : [];

  const cursor = { start: 0, end: 0 };
  const midActiveIndex = arr.findIndex((value) => value === activePage);

  if (activePage < 4) {
    cursor.start = 0;
  } else if (midActiveIndex !== -1 && arr.length - 1 === midActiveIndex) {
    cursor.start = midActiveIndex - 2;
  } else if (midActiveIndex !== -1) {
    cursor.start = midActiveIndex !== 0 ? midActiveIndex - 1 : 0;
  } else {
    cursor.start = arr.length > 2 ? arr.length - 3 : 0;
  }

  cursor.end = cursor.start + 3;

  const items = [];

  dotsStart.display = activePage > 5 && pages > 7;
  dotsStart.additional = dotsStart.display ? cursor.start : undefined;
  dotsEnd.display = omega.length > 0 && cursor.end < arr.length;
  dotsEnd.additional = omega.length > 0 && cursor.end < arr.length ? arr.length - cursor.end : undefined;

  items.push(
    ...arr.slice(cursor.start, cursor.end).map((value) => ({
      type: 'PageItem',
      label: value.toString(),
      value,
      active: activePage === value,
    }))
  );

  return {
    dotsStart,
    dotsEnd,
    items,
  };
};

const last = ({ pages, activePage }) => {
  const remainder = clamp(pages - 6, 0, 3);

  return Array.from({ length: remainder }, (x, i) => {
    const value = pages - (remainder - (i + 1));
    return {
      type: 'PageItem',
      label: value.toString(),
      value,
      active: activePage === value,
    };
  });
};

const createPagination = ({ pages, activePage }) => {
  const f = first({ pages, activePage });
  const m = middle({ pages, activePage });
  const l = last({ pages, activePage });

  const result = {
    items: [],
  };

  result.items.push(...f);
  result.items.push(m.dotsStart);
  result.items.push(...m.items);
  result.items.push(m.dotsEnd);
  result.items.push(...l);

  return result;
};

// Export the function to be used in other parts of the app
export { createPagination };
