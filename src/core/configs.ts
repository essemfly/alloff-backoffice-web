export const getEnv = () => {
  if (import.meta.env.MODE === "production" || import.meta.env.PROD) {
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
