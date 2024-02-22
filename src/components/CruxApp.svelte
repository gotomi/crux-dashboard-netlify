<script>
  import { onMount } from "svelte";
  import Header from "./Header.svelte";
  import UrlsByMetric from "./UrlsByMetric.svelte";
  import MetricsByUrl from "./MetricsByUrl.svelte";

  const formFactorValues = ["ALL_FORM_FACTORS", "PHONE", "DESKTOP", "TABLET"];

  const initialData = {
    url: [""],
    checkOrigin: true,
    formFactor: "PHONE",
  };

  let promise = Promise.reject(new Error(""));

  function addItem() {
    const len = initialData.url.length;
    initialData.url[len] = "";
  }

  function removeItem(i) {
    initialData.url.splice(i, 1);
    initialData.url = initialData.url;
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
    const data = new URLSearchParams(new FormData(e.target));
    window.location.href = "/?" + data.toString();
  }
</script>

<form on:submit|preventDefault={onSubmit}>
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
        <input name="url" value={item} placeholder="url" />
        <span class="remove" on:click={() => removeItem(i)}>x</span>
      </li>
    {/each}
    <li><button on:click|preventDefault={addItem}>add url</button></li>
  </ul>
  <ul>
    <li><input type="submit" value="get CrUX data" /></li>
  </ul>
</form>

<div class="response">
  {#await promise}
    <p class="loader">...waiting</p>
  {:then content}
    <Header data={content} />
    <UrlsByMetric data={content} />
    <MetricsByUrl data={content} />
  {:catch error}
    <p style="color: red">{error.message}</p>
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

  form {
    padding: 16px;
    margin: 16px 0;
    background-color: #eee;
    width: 100%;
    display: flex;
    justify-content: space-between;
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
    border: 1px solid #ddd;
  }
  button,
  input[type="submit"] {
    background-color: #ccc;
  }
  input[type="checkbox"] {
    vertical-align: middle;
    margin-right: 4px;
  }
  .remove {
    cursor: pointer;
    font-weight: bold;
  }
</style>
