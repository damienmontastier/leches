<script setup lang="ts">
import { TresLeches, useControls } from '@tresjs/leches'

const uuid = 'fps-demo'
useControls('fpsgraph', {
  uuid,
})
</script>

<template>
  <div class="w-full h-300px bg-gray-200 mb-8 relative flex justify-center items-center">
    <div class="relative w-280px min-h-200px">
      <TresLeches
        class="important-left-0 important-top-8"
        :uuid="uuid"
      />
    </div>
  </div>
</template>
