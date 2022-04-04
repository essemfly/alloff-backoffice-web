<script lang="ts">
  import TooltipTag from "@app/components/TooltipTag.svelte";

  export let isClassifiedTouched: boolean = false;
  export let isClassifiedDone: boolean = false;
</script>

{#if isClassifiedTouched}
  <TooltipTag align="start" direction="top" type="teal" label="수동 설정됨">
    <p>
      자동 설정됨: 시스템를 통해 설정된 카테고리<br />
      수동 설정됨: 직접 수정한 카테고리<br />
      설정되지 않음: 카테고리가 지정되지 않음
    </p>
  </TooltipTag>
{:else if isClassifiedDone}
  <TooltipTag align="start" direction="top" type="blue" label="자동 설정됨">
    <p>
      자동 설정됨: 시스템를 통해 설정된 카테고리<br />
      수동 설정됨: 직접 수정한 카테고리<br />
      설정되지 않음: 카테고리가 지정되지 않음
    </p>
  </TooltipTag>
{:else}
  <TooltipTag align="start" direction="top" type="red" label="설정되지 않음">
    <p>
      자동 설정됨: 시스템를 통해 설정된 카테고리<br />
      수동 설정됨: 직접 수정한 카테고리<br />
      설정되지 않음: 카테고리가 지정되지 않음
    </p>
  </TooltipTag>
{/if}
