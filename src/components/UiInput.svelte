<script lang="ts">
  export let label: string;
  export let name: string;
  export let value: string;
  export let placeholder: string = "";
</script>

<label>
  <!-- <span>{label}</span> -->
  <span class="input"
    ><input {name} {value} {placeholder} />
    <button class="remove" on:click>x</button></span
  >
</label>

<style>
  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .input {
    display: flex;
    flex-wrap: nowrap;
    gap: 4px;
  }
  input {
    font-size: medium;
    padding: 2px 4px;
  }
</style>
