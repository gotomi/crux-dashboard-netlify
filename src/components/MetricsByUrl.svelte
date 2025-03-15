<script>
    let {data}= $props();
    import Metric from "../components/Metric.svelte";
    import Legend from "../components/Legend.svelte";
    function getMetric(data, metric) {
        return data.metrics[metric];
    }
</script>

{#each ["FCP", "LCP",  "CLS", "TTFB", "INP", "RTT"] as metric}
    <article>
        {metric}
     <Legend {metric} />
           {#each getMetric(data, metric) as p}
            <Metric post={p} />
        {/each}
    </article>
{/each}
