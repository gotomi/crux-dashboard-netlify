<script>
  import Header from "./Header.svelte";
  import UrlsByMetric from "./UrlsByMetric.svelte";
  let isData = false;
  let items = ["url", "url"];
  $: l = items.length;
  function addItem() {
    items[l] = "url";
  }

  async function getCrux(data) {
    const res = await fetch("/.netlify/functions/kruk", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: data,
    });
    const content = await res.json();
    if (res.ok) {
      isData =true;
			return content;
		} else {
			throw new Error(content);
		}
  }
  let promise;
  function onSubmit(e) {
    const data = new URLSearchParams(new FormData(e.target));
    promise = getCrux(data);
  }
</script>


<form on:submit|preventDefault={onSubmit}>
  <ul>
    {#each items as item}
      <li><input name={item} value="" placeholder="url" /></li>
    {/each}
    <li><button on:click|preventDefault={addItem}>+</button></li>
    <li><input type="submit" /></li>
  </ul>
</form>

<div class="response">
  {#if isData}
    {#await promise}
      <p>...waiting</p>
    {:then content}
      <Header data={content} />
      <UrlsByMetric data={content} />
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  {/if}
</div>

<style>
  ul{
    display: block;
  }
  ul, li{
    list-style: none;
  }
  li {
    display: inline-block;
  }
</style>