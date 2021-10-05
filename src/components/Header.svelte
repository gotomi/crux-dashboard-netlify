<script>
    export let data;
    const params = data.params;
    const urlType = params.url ? "URL" : "origin";
    const device = params.formFactor === "PHONE" ? "📱" : "🖥️";
</script>

<p>
    {device}
    {!!params.formFactor ? params.formFactor.toLowerCase() : 'all'} 🌐
    {urlType} 📅 {params.date}
</p>
