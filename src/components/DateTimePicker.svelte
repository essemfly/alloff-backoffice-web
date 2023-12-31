<script lang="ts">
  import { DateTime } from "luxon";
  import {
    DatePicker,
    TimePicker,
    DatePickerInput,
  } from "carbon-components-svelte";

  export let label: string = "";
  export let value: string | undefined = undefined;
  export let size: "sm" | "xl" | undefined = undefined;
  export let disabled: boolean = false;

  let timeInputRef: HTMLInputElement | null | undefined;

  const parseDate = (originDate: string) => {
    if (!value) {
      return undefined;
    }
    const parsedFromIso = DateTime.fromISO(originDate);
    if (parsedFromIso.isValid) {
      return parsedFromIso;
    }
    const utcRemovedOriginDate = originDate.replace(" UTC", "");
    const parsedFromSql = DateTime.fromSQL(utcRemovedOriginDate);
    if (parsedFromSql.isValid) {
      return parsedFromSql;
    }
    return undefined;
  };

  const dateTimeValue = parseDate(value ?? "");

  let dateValue = dateTimeValue?.toISODate();
  let timeValue = dateTimeValue?.toFormat("HH:mm");
  let isTouched = false;
  let isValid = true;

  $: if (dateValue || timeValue) {
    const _newDateTime = DateTime.fromISO(dateValue + "T" + timeValue)
      .toUTC()
      .toISO();

    isValid = _newDateTime !== null;
    isTouched =
      (_newDateTime === null && (!!dateValue || !!timeValue)) ||
      (_newDateTime !== null && _newDateTime !== value);

    value = _newDateTime;
  }

  const handleFocus = (event: FocusEvent) => {
    const { value } = event.target as HTMLInputElement;
    timeValue = value.replace(":", "");
  };

  const handleBlur = (event: FocusEvent) => {
    const { value } = event.target as HTMLInputElement;
    if (value.length > 2) {
      const [hh, mm] = value.match(/.{1,2}/g) as string[];
      timeValue = [hh, mm].join(":");
    }
  };

  const handleDateChange = () => {
    timeInputRef?.focus();
  };
</script>

<div class="column">
  <div class="bx--label">{label}</div>
  <div class="row">
    <DatePicker
      datePickerType="single"
      bind:value={dateValue}
      dateFormat="Y-m-d"
      on:change={handleDateChange}
    >
      <DatePickerInput
        {size}
        {disabled}
        hideLabel
        labelText={"날짜"}
        placeholder="yyyy-mm-dd"
        invalid={isTouched && !isValid}
      />
    </DatePicker>
    <TimePicker
      bind:ref={timeInputRef}
      {size}
      hideLabel
      labelText={"시간 (24시간 형식)"}
      placeholder="hh:mm"
      bind:value={timeValue}
      invalid={isTouched && !isValid}
      on:focus={handleFocus}
      on:blur={handleBlur}
      {disabled}
    />
  </div>
  {#if isTouched && !isValid}
    <div class="bx--form-requirement">형식이 올바르지 않습니다</div>
  {/if}
</div>

<style>
  .column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .row {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .row > :global(.bx--form-item) {
    display: block;
    width: 100%;
  }

  .row :global(.bx--time-picker__input-field) {
    width: 100%;
  }
</style>
