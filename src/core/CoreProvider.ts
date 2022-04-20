import { Configuration } from "@lessbutter/alloff-backoffice-api";
import { getBaseUrl } from "./configs";

import AuthService, { useAuthService } from "./services/AuthService";
import StorageService, { useStorageService } from "./services/StorageService";

export default class CoreProvider {
  public apiConfig: Configuration;
  public auth: AuthService;
  public storage: StorageService;

  constructor(
    config: Configuration,
    auth: AuthService,
    storage: StorageService,
  ) {
    this.apiConfig = config;
    this.auth = auth;
    this.storage = storage;
  }
}

export const useCore = () => {
  const storageService = useStorageService();
  const config = new Configuration({
    basePath: getBaseUrl(),
    accessToken: storageService.getTokens().access,
  });
  const authService = useAuthService(config, storageService);
  return new CoreProvider(config, authService, storageService);
};
