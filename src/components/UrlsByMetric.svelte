<script>
    let {data} = $props();
    function imgIcon(url) {
        return (
            "https://www.google.com/s2/favicons?sz=16&domain_url=" +
            url.replace("https://", "")
        );
    }

    function getMetric() {
        if (!data.metrics) return [];
        return data.metrics.map((item) => {
            let obj = [];
            obj.push({
                url: item.url,
                minimal: item.minimalGood,
            });
            ["FCP", "LCP",  "CLS", "TTFB", "INP", "RTT"].forEach((metric) => {
                obj.push({
                    p75: item[metric].p75,
                    rank: item[metric].rank,
                });
            });

            return obj;
        });
    }
    const table = [["url", "FCP", "LCP",  "CLS", "TTFB", "INP", "RTT"]].concat(
        getMetric(),
    );

    const tableHeading = table[0];
</script>

<div class="wrapper">
    <table>
        <thead>
        <tr>
            {#each tableHeading as cell}
                <td>{cell}</td>
            {/each}
        </tr>
        </thead>     <tbody>
        {#each table.slice(1, table.length) as row}

            <tr>
                {#each row as cell}
                    {#if cell.p75}
                        <td class={cell.rank}>{cell.p75}</td>
                    {:else}
                        <td>
                            <div class="url">
                                <img
                                    src={imgIcon(cell.url)}
                                    class="icon"
                                    width="12"
                                    height="12"
                                    alt={cell.url}
                                />
                                <span title={cell.url}>{cell.url}</span>
                            </div>
                            <div class="all-good">
                                <div style={"width:" + cell.minimal + "%"}>
                                    {cell.minimal}%
                                </div>
                            </div>
                        </td>
                    {/if}
                {/each}
                <!-- <td class={metric.rank}>{metric.p75}</td>  -->
            </tr>
        {/each}
        </tbody>
    </table>
</div>

<style>
    .wrapper {
        max-width: 100%;
        overflow: auto;
    }

    table {
        width: 100%;
    }
    thead  td {
        background: #333;
        color: #fff;
        font-weight: bold;
    }
    table,
    tr,
    td {
        border: 1px solid #ddd;
        border-collapse: collapse;
    }
    td {
        padding: 10px 20px;
        border: 1px solid #ddd;
        border-collapse: collapse;
    }

    tr td:first-child {
        padding: 10px;
    }
    .all-good {
        background-color: #ddd;
        font-size: 60%;
    }
    .all-good div {
        background-color: #34a853;
        padding: 1px 3px;
        color: #000;
    }
    .icon {
        max-width: 12px;
        margin: 0 3px 0 0;
    }

    @media (max-width: 1022px) {
        .url {
            max-width: 400px;
        }
    }
    .url {
        max-width: 160px;
        overflow: hidden;
        white-space: nowrap;
    }

    span {
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-align: left;
        margin-right: 10px;
    }
    .good {
        background-color: #34a85385;
    }

    .average {
        background-color: #fbbc0485;
    }

    .poor {
        background-color: #ea433590;
    }
</style>
