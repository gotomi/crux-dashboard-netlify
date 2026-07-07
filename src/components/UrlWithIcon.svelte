<script>
let { url } = $props();
const icon = $derived(
	"https://www.google.com/s2/favicons?sz=16&domain_url=" +
		url.replace("https://", ""),
);

const displayUrl = $derived(url.replace(/^https?:\/\//, ""));
</script>

<span class="url-wrapper" title={url}>
    <img src={icon} class="icon" width="12" height="12" alt="Favicon for {displayUrl}" />
    <span class="url-text">{url}</span>
</span>

<style>
    .url-wrapper {
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        width: 200px;
        gap: 4px;
        margin-right: 10px;
    }

    .icon {
        width: 12px;
        height: 12px;
        flex-shrink: 0;
    }

    .url-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: right;
    }
</style>
