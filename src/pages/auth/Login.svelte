<script lang="ts">
  import { Button, PasswordInput, TextInput } from "carbon-components-svelte";
  import Login16 from "carbon-icons-svelte/lib/Login16";
  import { TokenApi } from "../../api";
  import { setTokens } from "../../core/auth";

  const login = async () => {
    if (!valid) return;
    submitting = true;

    try {
      const { data } = await api.tokenCreate({
        tokenObtainPairRequestRequest: { username, password },
      });
      setTokens(data);
      window.location.href = "/orders";
    } catch {
      failed = true;
    } finally {
      submitting = false;
    }
  };

  const api = new TokenApi();
  let username = "";
  let password = "";
  let submitting = false;
  let valid = false;
  let failed = false;
  let passwordRef: HTMLInputElement | null | undefined;

  $: valid = username.trim() !== "" && password.trim() !== "";
</script>

<div class="login">
  <div class="wrapper">
    <TextInput
      labelText="아이디"
      required
      bind:value={username}
      invalid={failed}
      on:keydown={(e) => {
        if (e.key === "Enter" && passwordRef) {
          passwordRef.focus();
        }
      }}
    />
    <PasswordInput
      bind:ref={passwordRef}
      required
      type="password"
      labelText="비밀번호"
      bind:value={password}
      invalid={failed}
      on:keydown={(e) => {
        if (e.key === "Enter") {
          login();
        }
      }}
    />
    <Button icon={Login16} disabled={submitting || !valid} on:click={login}
      >{submitting ? "로그인하는 중..." : "로그인"}</Button
    >
  </div>
</div>

<style>
  .wrapper {
    width: 80%;
    max-width: 500px;
  }
  .login {
    position: absolute;
    height: 100vh;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: grid;
    place-items: center;
  }
</style>
