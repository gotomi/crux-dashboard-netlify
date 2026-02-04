<script>
    const {data} = $props();
    const params = $derived(data.params);
    const urlType = $derived(params.url ? "URL" : "ORIGIN");
    const {firstDate, lastDate} = $derived(data.params.collectionPeriod);
    const firstDay = $derived(new Date(Date.UTC(firstDate.year ,firstDate.month - 1,firstDate.day)).toLocaleDateString('en-UK',{format: 'short'}));
    const lastDay = $derived(new Date(Date.UTC(lastDate.year ,lastDate.month - 1,lastDate.day)).toLocaleDateString('en-UK',{format: 'short'}));

</script>

<p>

  <strong> {!!params.formFactor ? params.formFactor : 'ALL DEVICES'}</strong>
  🌐 <strong>{urlType}</strong> 📅 {firstDay} - {lastDay}
</p>
