<!-- client/src/components/NavBar.vue -->

<template>
  <nav class="navbar">
    <div class="navbar-left">
      <span class="logo">🎬 MovieSearch</span>
    </div>
    <div class="navbar-right">
      <slot name="status" />
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e1e;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
}

.logo {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
}

.navbar-right {
  font-size: 0.95rem;
}
</style>
