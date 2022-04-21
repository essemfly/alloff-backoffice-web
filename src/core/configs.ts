export const getEnv = () => {
  if (
    import.meta.env.MODE === "production" ||
    import.meta.env.MODE === "prod" ||
    import.meta.env.PROD
  ) {
    return "prod";
  }
  if (import.meta.env.MODE === "local") {
    return "local";
  }
  return "dev";
};

export function getBaseUrl() {
  const env = getEnv();
  switch (env) {
    case "local":
      return "http://localhost:8000";
    case "dev":
      return "https://office-dev.lett.io";
    case "prod":
      return "https://office.lett.io";
  }
}

export function getFirebaseApiKey() {
  const env = getEnv();
  switch (env) {
    case "prod":
      return "AIzaSyA1pk7YM0oExgaxRBxvdpzVEj39W1h4wJ0";
    case "dev":
    default:
      return "AIzaSyAzcMKkMoBjrLVS1OgoaYRxQ270ZFFAZgU";
  }
}

export function getFirebaseUrl() {
  const apiKey = getFirebaseApiKey();
  return `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`;
}

const firebaseSettingDev = {
  apiKey: "AIzaSyAzcMKkMoBjrLVS1OgoaYRxQ270ZFFAZgU",
  domain: "alloff-webhome-dev",
  domainUriPrefix: "https://alloffdev.page.link",
  androidPackageName: "co.alloff.app.dev",
  androidFallbackLink:
    "https://play.google.com/store/apps/details?id=co.alloff.app",
  iosBundleId: "co.alloff.app.dev",
  iosFallbackLink: "https://apps.apple.com/kr/app/1570192380",
};

const firebaseSettingProd = {
  apiKey: "AIzaSyA1pk7YM0oExgaxRBxvdpzVEj39W1h4wJ0",
  domain: "alloff-webhome",
  domainUriPrefix: "https://alloff.page.link",
  androidPackageName: "co.alloff.app",
  androidFallbackLink:
    "https://play.google.com/store/apps/details?id=co.alloff.app",
  iosBundleId: "co.alloff.app",
  iosFallbackLink: "https://apps.apple.com/kr/app/1570192380",
};

export function getDeeplinkSettings() {
  const env = getEnv();
  switch (env) {
    case "prod":
      return firebaseSettingProd;
    default:
      return firebaseSettingDev;
  }
}
