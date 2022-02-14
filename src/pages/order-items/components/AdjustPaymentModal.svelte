<script lang="ts">
  import {
    ComposedModal,
    ContentSwitcher,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Switch,
    TextInput,
  } from "carbon-components-svelte";
  import PiggyBank16 from "carbon-icons-svelte/lib/PiggyBank16";
  import Purchase16 from "carbon-icons-svelte/lib/Purchase16";

  import { MethodEnum } from "@api";
  import { numberWithCommas } from "@app/helpers/number";

  export let adjustPayment: (
    reason: string,
    method: MethodEnum,
    bank_account_info?: string,
  ) => Promise<void>;

  export let open = false;
  export let amount: number;
  let reason = "환불";
  let method = MethodEnum.CardCancel;
  let bank_account_info = "";

  let valid = false;
  let methodIndex = 0;
  $: {
    valid =
      reason !== "" &&
      (method === MethodEnum.Cash ? bank_account_info !== "" : true);
  }
  $: method = methodIndex === 0 ? MethodEnum.CardCancel : MethodEnum.Cash;
</script>

<ComposedModal
  bind:open
  on:submit={async () => {
    await adjustPayment(
      reason,
      method,
      bank_account_info.trim() === "" ? undefined : bank_account_info,
    );
    open = false;
  }}
>
  <ModalHeader label="결제정보수정" title="환불 실행" />
  <ModalBody hasForm>
    <div class="modal-wrapper">
      <p>
        환불 가능 금액 <strong>{numberWithCommas(amount)}</strong>원에 대한
        환불을 진행합니다.
      </p>
      <ContentSwitcher bind:selectedIndex={methodIndex}>
        <Switch>
          <div style="display: flex; align-items: center;">
            <Purchase16 style="margin-right: 0.5rem;" />
            카드 취소
          </div>
        </Switch>
        <Switch>
          <div style="display: flex; align-items: center;">
            <PiggyBank16 style="margin-right: 0.5rem;" />
            현금 환급
          </div>
        </Switch>
      </ContentSwitcher>
      <TextInput bind:value={reason} labelText="적요" required />
      {#if method === MethodEnum.Cash}
        <TextInput
          bind:value={bank_account_info}
          labelText="환불 계좌 정보"
          placeholder="신한 123-456-123456"
          required
        />
      {/if}
    </div>
  </ModalBody>
  <ModalFooter
    primaryButtonText="환불정보 저장하기"
    primaryButtonDisabled={!valid}
    secondaryButtonText="취소"
    on:click:button--secondary={() => {
      open = false;
    }}
  />
</ComposedModal>

<style>
  .modal-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 15px;
  }
</style>
