<template>
  <article class="message" :class="{ 'message--hidden': !active }">
    <div class="message-header">
      <slot name="header"></slot>
      <button class="delete"></button>
    </div>

    <div class="message-body">
      <slot>Message</slot>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    active: Boolean
  }
};
</script>
