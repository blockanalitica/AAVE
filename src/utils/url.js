export const getAllQueryParams = (queryParams) => {
  const qParams = {};
  queryParams.forEach((value, key) => {
    if (key in qParams) {
      if (Array.isArray(qParams[key])) {
        qParams[key].push(value);
      } else {
        qParams[key] = [qParams[key], value];
      }
    } else {
      qParams[key] = value;
    }
  });
  return qParams;
};
