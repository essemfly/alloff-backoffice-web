<script lang="ts">
  import { AspectRatio, SkeletonPlaceholder } from "carbon-components-svelte";

  interface AspectRatioProps {
    ratio?: "2x1" | "16x9" | "4x3" | "1x1" | "3x4" | "3x2" | "9x16" | "1x2";
  }

  export let ratio: AspectRatioProps["ratio"] = "3x4";
</script>

<AspectRatio {ratio}>
  <SkeletonPlaceholder style="width: 100%; height: 100%;" />
</AspectRatio>
