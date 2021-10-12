<script lang="ts">
  import {
    Button,
    DatePicker,
    DatePickerInput,
    FileUploaderDropContainer,
    Form,
    FormGroup,
    InlineLoading,
    TextArea,
    TextInput,
    TimePicker,
  } from "carbon-components-svelte";
  import AddComment16 from "carbon-icons-svelte/lib/AddComment16";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";
  import Save16 from "carbon-icons-svelte/lib/Save16";
  import { DateTime } from "luxon";
  import shortid from "shortid";
  import {
    ImageUploadApi,
    PatchedTimedealRequest,
    Timedeal,
    TimedealRequest,
    TimedealsApi,
  } from "../../../api";
  import { getTimedealStatus } from "../../../helpers/timedeal";
  import { newStatus } from "../store";

  export let timedeal: Timedeal | undefined = undefined;
  export let load: (() => Promise<void>) | undefined = undefined;
  export let mobile: boolean;
  export let api: TimedealsApi;
  export let submitting: boolean;

  const imageApi = new ImageUploadApi();

  let { title, shorttitle, starttime, finishtime, imgurl, instruction } =
    timedeal ?? {
      title: "",
      shorttitle: "",
      starttime: undefined,
      finishtime: undefined,
      imgurl: undefined,
      instruction: [] as string[],
    };

  let image: { url: string; key?: string } | undefined = imgurl
    ? { url: imgurl, key: shortid() }
    : undefined;
  let imgRef: HTMLImageElement | null | undefined;
  let uploading = false;

  let newInstructionList: { key: string; body: string }[] = instruction.map(
    (body) => ({ body, key: shortid() })
  );
  let newInstruction = "";
  let newInstructionRef: HTMLInputElement | null | undefined;

  const start = starttime ? DateTime.fromISO(starttime) : undefined;
  const finish = finishtime ? DateTime.fromISO(finishtime) : undefined;

  let startDate = start?.toISODate();
  let finishDate = finish?.toISODate();
  let startTime = start?.toFormat("HH:mm");
  let finishTime = finish?.toFormat("HH:mm");

  let partial: PatchedTimedealRequest = {};
  let complete: TimedealRequest | undefined;

  let valid = true;
  let startTimeValid = true;
  let finishTimeValid = true;

  let touched = false;

  const addNewInstruction = () => {
    newInstructionList = [
      { body: newInstruction, key: shortid() },
      ...newInstructionList,
    ];
    instruction = newInstructionList.map(({ body }) => body);
    newInstruction = "";
    if (newInstructionRef) {
      newInstructionRef.value = "";
    }
  };

  const removeInstruction = (removeKey: string) => {
    newInstructionList = newInstructionList.filter(
      ({ key }) => key !== removeKey
    );
    instruction = newInstructionList.map(({ body }) => body);
  };

  $: {
    const _newStartTime = DateTime.fromISO(startDate + "T" + startTime)
      .toUTC()
      .toISO();
    const _newFinishTime = DateTime.fromISO(finishDate + "T" + finishTime)
      .toUTC()
      .toISO();

    startTimeValid = _newStartTime !== null;
    finishTimeValid = _newFinishTime !== null;

    const newStartTime =
      _newStartTime === start?.toUTC().toISO() ? undefined : _newStartTime;
    const newFinishTime =
      _newFinishTime === finish?.toUTC().toISO() ? undefined : _newFinishTime;

    const titleTouched = title !== (timedeal?.title ?? "");
    const shorttitleTouched = shorttitle !== (timedeal?.shorttitle ?? "");
    const imageurlTouched = image?.url !== imgurl;

    if (newStartTime && newFinishTime) {
      newStatus.set(
        getTimedealStatus(new Date(newStartTime), new Date(newFinishTime))
      );
    }

    if (
      newStartTime ||
      newFinishTime ||
      titleTouched ||
      shorttitleTouched ||
      imageurlTouched
    ) {
      touched = true;
    }

    if (
      newStartTime &&
      newFinishTime &&
      title !== "" &&
      image &&
      image.url !== ""
    ) {
      const newComplete: TimedealRequest = {
        finishtime: newFinishTime,
        starttime: newStartTime,
        imgurl: image.url,
        title,
        instruction,
      };
      complete = newComplete;
    }

    const newPartial = {
      ...partial,
      starttime: newStartTime,
      finishtime: newFinishTime,
      title: titleTouched ? title : undefined,
      shorttitle: shorttitleTouched ? shorttitle : undefined,
      imgurl: imageurlTouched ? image?.url : undefined,
    };

    partial = Object.fromEntries(
      Object.entries(newPartial).filter(([_, val]) => !!val)
    );

    touched = Object.entries(partial).length > 0;

    const formValid =
      startTimeValid && finishTimeValid && title !== "" && image?.url !== "";
    valid = timedeal ? formValid : formValid && !!complete;
  }

  const submit = async () => {
    submitting = true;
    if (timedeal) {
      try {
        await api.timedealsPartialUpdate(timedeal.id, partial);
      } catch (e: any) {
        alert("타임딜 수정 도중 문제가 발생했습니다!");
      } finally {
        submitting = false;
        if (load) return load();
      }
    } else {
      if (complete) {
        try {
          const { data } = await api.timedealsCreate(complete);
          window.location.href = `../timedeals/${data.id}`;
        } catch (e: any) {
          alert("타임딜 저장 도중 문제가 발생했습니다!");
        } finally {
          submitting = false;
          if (load) return load();
        }
      }
    }
  };
</script>

<div style="height: 10px" />
<div class="button-wrapper">
  <Button
    on:click={submit}
    disabled={!touched || !valid}
    icon={timedeal ? Save16 : DocumentAdd16}
    >{timedeal ? "수정" : "추가"}</Button
  >
</div>
<div style="height: 10px" />
<Form>
  <FormGroup>
    <TextArea labelText="제목" bind:value={title} />
    <div style="height: 10px" />
    <TextInput labelText="숏타이틀" bind:value={shorttitle} />
  </FormGroup>
  <FormGroup>
    <DatePicker
      datePickerType="single"
      bind:value={startDate}
      dateFormat="Y-m-d"
    >
      <DatePickerInput
        invalid={!startTimeValid}
        labelText="시작일"
        placeholder="yyyy-mm-dd"
      />
    </DatePicker>
    <div style="height: 10px" />
    <TimePicker
      labelText="시작시간 (24시간 형식)"
      placeholder="hh:mm"
      bind:value={startTime}
      invalidText="형식이 올바르지 않습니다"
      invalid={!startTimeValid}
    />
  </FormGroup>
  <FormGroup>
    <DatePicker
      datePickerType="single"
      bind:value={finishDate}
      dateFormat="Y-m-d"
    >
      <DatePickerInput
        labelText="종료일"
        placeholder="yyyy-mm-dd"
        invalid={!finishTimeValid}
      />
    </DatePicker>
    <div style="height: 10px" />
    <TimePicker
      labelText="종료시간 (24시간 형식)"
      placeholder="hh:mm"
      bind:value={finishTime}
      invalid={!finishTimeValid}
      invalidText="형식이 올바르지 않습니다"
    />
  </FormGroup>
</Form>
<h6>타임딜 설명</h6>
<div class="memo-form">
  <TextInput
    placeholder="새 설명 입력"
    bind:value={newInstruction}
    on:keydown={(e) => {
      if (e.key !== "Enter") return;
      addNewInstruction();
    }}
  />
  <Button
    size="field"
    icon={AddComment16}
    iconDescription="추가"
    on:click={addNewInstruction}
  />
</div>
<div class="memo-items">
  {#each newInstructionList as instruction}
    <div class="memo-item">
      • {instruction.body}
      <div class="memo-user noselect">
        <div
          class="memo-delete"
          on:click={() => removeInstruction(instruction.key)}
        >
          ❌
        </div>
      </div>
    </div>
  {/each}
</div>
<div style="height: 30px" />
<h6>타임딜 이미지</h6>
<div style="height: 10px" />
{#if uploading}
  <InlineLoading status="active" description="이미지를 업로드하는 중..." />
{/if}
{#if image}
  <img
    class="image"
    class:mobile
    bind:this={imgRef}
    src={image.url}
    alt="timedeal"
  />
{/if}
<div style="height: 10px" />
<FileUploaderDropContainer
  labelText="드래그하거나 클릭해서 파일을 선택하세요"
  accept={["image/*"]}
  on:add={(e) => {
    const file = e.detail[0];
    image = undefined;
    uploading = true;
    imageApi.imageUploadUploadCreate(file).then((res) => {
      const { random_key, url } = res.data;
      image = { url, key: random_key };
      uploading = false;
    });
  }}
/>

<style>
  .button-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .image {
    width: auto;
    min-width: 300px;
    max-height: 300px;
    object-fit: contain;
  }

  .image.mobile {
    width: 100%;
  }

  .memo-form {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
  }

  .memo-item {
    margin-top: 8px;
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    line-height: 20px;
    word-break: break-all;
  }

  .memo-user {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .memo-delete {
    margin-left: 3px;
    font-size: 10px;
    cursor: pointer;
  }
</style>
