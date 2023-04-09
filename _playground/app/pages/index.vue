<template>
  <!-- you will need to handle a loading state -->
  <div v-if="pending">Loading ...</div>
  <div v-else>
    {{ data }}
  </div>
</template>
<script setup>
const { pending, data } = useLazyFetch("http://localhost:8000");
watch(data, (newPosts) => {
  // Because posts starts out null, you will not have access
  // to its contents immediately, but you can watch it.
});
</script>
