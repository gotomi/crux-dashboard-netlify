<script>
  import Header from "./Header.svelte";
  import UrlsByMetric from "./UrlsByMetric.svelte";
  import MetricsByUrl from "./MetricsByUrl.svelte";
  let isData = false;
  let items = ["url", "url"];
  $: l = items.length;
  function addItem() {
    items[l] = "url";
  }

  const formFactorValues = ["ALL_FORM_FACTORS", "PHONE", "DESKTOP", "TABLET"];

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
      isData = content.params ? true : false;
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
    <li><label><input type="checkbox" name="checkOrigin" />origin</label></li>
    <li>
      <select name="formFactor">
        {#each formFactorValues as formFactor}
          {#if formFactor === "PHONE"}
            <option value={formFactor} selected>{formFactor}</option>
          {:else}
            <option value={formFactor}>{formFactor}</option>
          {/if}
        {/each}
      </select>
    </li>
    {#each items as item}
      <li><input name={item} value="" placeholder="url" /></li>
    {/each}
    <li><button on:click|preventDefault={addItem}>add url</button></li>
    <li><input type="submit" value="get CrUX data" /></li>
  </ul>
</form>

<div class="response">
  {#if isData}
    {#await promise}
      <p class="loader">...waiting</p>
    {:then content}
      <Header data={content} />
      <UrlsByMetric data={content} />
      <MetricsByUrl data={content} />
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  {/if}
</div>

<style>
  ul {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    display: flex
  }

  form {
    padding: 0 0 20px 0;
    margin: 0 0 20px 0;
    border-bottom: 1px solid #aaa;
  }
  .response {
    min-height: 300px;
  }
  .loader {
    margin: 50px auto;
  }
  input,
  select,
  button {
    padding: 4px 8px;
  }
</style>
