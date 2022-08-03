<script>
  import Header from "./Header.svelte";
  import UrlsByMetric from "./UrlsByMetric.svelte";
  import MetricsByUrl from "./MetricsByUrl.svelte";
  let isData = false;
  export let content;
  export let params;
  let items = ["url"];
  $: l = items.length;
  function addItem() {
    items[l] = "url";
  }

  const formFactorValues = ["ALL_FORM_FACTORS", "PHONE", "DESKTOP", "TABLET"];


  function onSubmit(e) {
    const data = new FormData(e.target);

    const origin = !!data.get("checkOrigin") ? "origin" : "url";
    const formFactor = data.get("formFactor");
    const urls = data.getAll("url").join(",");

    location.href = `/crux/${origin}/${formFactor}/{${urls}}`;
  }
</script>

<form on:submit|preventDefault={onSubmit}>
  <ul>
    <li>
      <label
        ><input
          type="radio"
          name="checkOrigin"
          value="true"
          checked
        />origin</label
      >
    </li>
    <li>
      <label><input type="radio" name="checkOrigin" value="false" />url</label>
    </li>
    <li>
      {#each formFactorValues as formFactor}
        {#if formFactor === "PHONE"}
          <input
            type="radio"
            name="formFactor"
            value={formFactor}
            checked
          />{formFactor}
        {:else}
          <input
            type="radio"
            name="formFactor"
            value={formFactor}
          />{formFactor}
        {/if}
      {/each}
    </li>
    {#each items as item}
      <li><input name={item} value="" placeholder="url" /></li>
    {/each}
    <li><button on:click|preventDefault={addItem}>add url</button></li>
    <li><input type="submit" value="get CrUX data" /></li>
  </ul>
</form>

<div class="response">
  {JSON.stringify(params, null, 2)}
  {#if Object.keys(content).length > 0}
    <Header data={content} />
    <UrlsByMetric data={content} />
    <MetricsByUrl data={content} />
  {/if}
</div>

<style>
  ul {
    display: block;
  }
  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    display: inline-block;
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
</style>
