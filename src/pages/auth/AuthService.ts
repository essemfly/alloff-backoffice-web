import { TokenApi } from "@lessbutter/alloff-backoffice-api";
import { navigate } from "svelte-navigator";

import { apiConfigsTS } from "@app/store";
import Service from "@app/lib/Service";

export default class AuthService extends Service {
  private tokenApi: TokenApi;

  constructor() {
    super();
    this.tokenApi = new TokenApi(apiConfigsTS);
  }

  public async login(username: string, password: string) {
    try {
      const { data } = await this.tokenApi.tokenCreate({
        tokenObtainPairRequestRequest: { username, password },
      });
      this.storageService.setTokens(data);
      navigate("/");
    } catch (e) {
      this.catchError(e);
    }
  }
}

export const useAuthService = () => {
  return new AuthService();
};
