<script>
  import { onMount } from "svelte";
  import Header from "./Header.svelte";
  import UrlsByMetric from "./UrlsByMetric.svelte";
  import MetricsByUrl from "./MetricsByUrl.svelte";

  import UiInput from "./UiInput.svelte";

  const formFactorValues = ["ALL_FORM_FACTORS", "PHONE", "DESKTOP", "TABLET"];

  let initialData = $state({
    url: [""],
    checkOrigin: true,
    formFactor: "PHONE",
  });

  let promise = $state(Promise.reject(new Error("")));

  function addItem(e) {
    e.preventDefault();
    const len = initialData.url.length;
    initialData.url[len] = "";
  }
  function removeItem(i) {
    return function() {
      initialData.url.splice(i, 1);
      initialData.url = [...initialData.url];
    }
  }

  onMount(async () => {
    const data = new URL(location.href).searchParams;
    const url = data.getAll("url");
    const checkOrigin = !!data.get("checkOrigin");
    const formFactor = data.get("formFactor");

    if (url.length) {
      initialData.url = url;
      initialData.checkOrigin = checkOrigin;
      initialData.formFactor = formFactor;
      promise = getCrux(data);
    }
  });

  async function getCrux(data) {
    const res = await fetch("/.netlify/functions/getCrux", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: data,
    });
    const content = await res.json();
    if (res.ok) {
      return content;
    } else {
      throw new Error(content);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    const data = new URLSearchParams(new FormData(e.target));
    window.location.href = "/?" + data.toString();
  }
</script>

<form onsubmit={onSubmit}>
  <ul>
    <li>
      <label
        ><input
          type="checkbox"
          name="checkOrigin"
          checked={initialData.checkOrigin}
        />origin</label
      >
    </li>
    <li>
      <select name="formFactor">
        {#each formFactorValues as formFactor}
          {#if formFactor === initialData.formFactor}
            <option value={formFactor} selected>{formFactor}</option>
          {:else}
            <option value={formFactor}>{formFactor}</option>
          {/if}
        {/each}
      </select>
    </li>
    {#each initialData.url as item, i (i)}
      <li>
        <UiInput
          name="url"
          value={item}
          placeholder="url"
          label="url"
          remove={removeItem(i)}
        />
      </li>
    {/each}
    <li><button class="add" onclick={addItem}>add url</button></li>

    <li><input type="submit" value="get CrUX data" /></li>
  </ul>
</form>

<div class="response">
  {#await promise}
    <p class="loader">
      <img src="/loader.svg" alt="loading" />
    </p>
  {:then content}
    {#if content.cruxData.error}
      <p class="error">{content.cruxData.error}</p>
    {:else}
      <Header data={content.cruxData} />
      <UrlsByMetric data={content.cruxData} />
      <MetricsByUrl data={content.byMetric} />
    {/if}
  {:catch error}
    <p class="error">{error.message}</p>
  {/await}
</div>

<style>
  ul {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }
  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    display: flex;
    align-items: center;
    gap: 8px;
  }


</style>
