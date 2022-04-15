<script lang="ts">
  import { Button, PasswordInput, TextInput } from "carbon-components-svelte";
  import Login16 from "carbon-icons-svelte/lib/Login16";

  import { useAuthService } from "./AuthService";

  const authService = useAuthService();

  let username = "";
  let password = "";
  let isSubmitting = false;
  let isValid = false;
  let isFailed = false;
  let passwordRef: HTMLInputElement | null | undefined;

  const handleClick = async () => {
    if (!isValid) return;
    try {
      isSubmitting = true;
      await authService.login(username, password);
    } catch {
      isFailed = true;
    } finally {
      isSubmitting = false;
    }
  };

  $: isValid = username.trim() !== "" && password.trim() !== "";
</script>

<div class="login">
  <div class="wrapper">
    <TextInput
      labelText="아이디"
      required
      bind:value={username}
      invalid={isFailed}
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
      invalid={isFailed}
      on:keydown={(e) => {
        if (e.key === "Enter") {
          handleClick();
        }
      }}
    />
    <Button
      icon={Login16}
      disabled={isSubmitting || !isValid}
      on:click={handleClick}
    >
      {isSubmitting ? "로그인하는 중..." : "로그인"}
    </Button>
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
