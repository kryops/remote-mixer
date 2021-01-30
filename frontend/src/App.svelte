<!-- App.svelte -->
<script>
  import Component from './Component.svelte'

  let count = 0

  function increment() {
    count++
  }
</script>

<div class="p-6">
  <header class="App-header">
    {count} -
    <a on:click={increment}> ++ </a>
  </header>

  <Component foobar="dd" />

  <button class="btn btn-green">sddd</button>
</div>

<style type="text/postcss">
  div {
    color: green;
  }
  .btn {
    @apply py-2 px-4 font-semibold rounded-lg shadow-md;
  }
  .btn-green {
    @apply text-white bg-red-500 hover:bg-green-700;
  }
</style>
