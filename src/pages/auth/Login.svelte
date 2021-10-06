<script lang="ts">
  import {
    FluidForm,
    TextInput,
    PasswordInput,
    Button,
  } from "carbon-components-svelte";
  import { TokenApi } from "../../api";
  import Login16 from "carbon-icons-svelte/lib/Login16";

  const login = async () => {
    if (!valid) return;
    submitting = true;

    try {
      await api.tokenCreate({ username, password });
    } catch {
      alert("로그인에 실패했습니다!");
    } finally {
      submitting = false;
    }
  };

  const api = new TokenApi();
  let username = "";
  let password = "";
  let token = "";
  let submitting = false;
  let valid = false;

  $: valid = username.trim() !== "" && password.trim() !== "";
</script>

<div class="login">
  <div class="wrapper">
    {token}
    <FluidForm>
      <TextInput labelText="아이디" required bind:value={username} />
      <PasswordInput
        required
        type="password"
        labelText="비밀번호"
        bind:value={password}
      />
      <Button icon={Login16} disabled={submitting || !valid} on:click={login}
        >{submitting ? "로그인하는 중..." : "로그인"}</Button
      >
    </FluidForm>
  </div>
</div>

<style>
  .wrapper {
    width: 80%;
    max-width: 500px;
  }
  .login {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: grid;
    place-items: center;
  }
</style>
