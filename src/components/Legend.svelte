<script>
  export let metric;

  const metricsMap = {
    CLS: { range: [0.1, 0.25], name: "Cumulative Layout Shift" },
    FCP: { range: [1800, 3000], name: "First Contentful Paint" },
    FID: { range: [100, 300], name: "First Input Delay" },
    LCP: { range: [2500, 4000], name: "Largest Contentful Paint" },
    TTFB: { range: [800, 1800], name: "Time to First Byte" },
    INP: { range: [200, 500], name: "Interaction To Next Paint" },
  };

  const metricData = metricsMap[metric];
  const unit = metric === "CLS" ? "" : "ms";
</script>

<div>
  <h2 title={metricData.name}>
    <span class="mobile">
      {metric}
    </span>
    <span class="desktop">{metricData.name} </span>
    </h2>
  <p class="legend">
    <span>🟢 good (&lt; {metricData.range[0]} {unit}) </span>
    <span>🟠 needs improvement</span>
    <span>🔴 poor (&gt; {metricData.range[1]}{unit})</span>
  </p>
</div>

<style>
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 32px;
  }
  .legend {
    text-align: right;
    padding: 10px 0;
  }

  .legend span {
    white-space: nowrap;
  }
  .desktop{
    display: inline-block;
  }
  .mobile{
    display: none;
  }

  @media (max-width: 1022px) {
    .legend {
      text-align: left;
      font-size: 80%;
    }
    .desktop{
      display: none;
    }
    .mobile{
    display: inline-block;
  }

  }
</style>
