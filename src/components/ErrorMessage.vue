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

<style scoped lang="scss">
.message {
  transform-origin: top center;
  transition-property: opacity, transform;
  transition-duration: .3s;

  &-body {
    padding-left: 15px;
  }

  &--hidden {
    transform: scaleY(0);
    opacity: 0;
    pointer-events: none;
  }
}
</style>
