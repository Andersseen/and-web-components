<template>
  <span and-icon="star" aria-hidden="true"></span>
  <span :and-icon="dynamicIcon" aria-hidden="true"></span>
</template>

<script setup lang="ts">
defineProps<{ dynamicIcon: string }>();
</script>
