const appendQueryParameter = (location, queryParameters) => {
  const params = new URLSearchParams(location.search);

  for (let key in queryParameters) {
    params.set(key, queryParameters[key]);
  }

  return { ...location, search: params.toString() };
};

export { appendQueryParameter };
