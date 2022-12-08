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

export const smartLocationParts = (location) => {
  const pathname = location.pathname.replace(SLASH_REGEX, "");
  const paths = pathname.split("/");
  let version = null;
  let network = null;
  if (pathname.length >= 2) {
    if (["v2", "v3"].includes(paths[0])) {
      version = paths[0];
      network = paths[1];
    }
  }
  return { version, network };
};

export const smartLocationPrefix = (location) => {
  const { version, network } = smartLocationParts(location);
  if (version || network) {
    return `/${version}/${network}/`;
  }
  return "";
};

export const smartEtherscanUrl = (location) => {
  const { network } = smartLocationParts(location);

  let url = "";
  switch (network) {
    case "optimism": {
      url = "https://optimistic.etherscan.io/";
      break;
    }
    case "arbitrum": {
      url = "https://arbiscan.io/";
      break;
    }
    case "avalanche": {
      url = "https://snowtrace.io/";
      break;
    }
    case "polygon": {
      url = "https://polygonscan.com/";
      break;
    }
    default: {
      url = "https://etherscan.io/";
      break;
    }
  }
  return url;
};
