export const SLASH_REGEX = /^\/?|\/?$/g;

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

export const smartLocationPrefix = (location) => {
  const pathname = location.pathname.replace(SLASH_REGEX, "");
  const paths = pathname.split("/");
  let prefix = "";
  if (pathname.length >= 2) {
    const version = paths[0];
    if (["v2", "v3"].includes(version)) {
      prefix = `/${version}/${paths[1]}/`;
    }
  }
  return prefix;
};
