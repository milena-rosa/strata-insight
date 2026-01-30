'use client'

import type { Data, Layout } from 'plotly.js'
import { useMemo } from 'react'
import Plot from 'react-plotly.js'
import { Skeleton } from '@/components/ui/skeleton'
import type { BarPayload, PiperPayload, ScatterPayload, TrilinearData, Visualization } from '@/data/mockData'

interface DataPlotterProps {
  visualization: Visualization
  isLoading?: boolean
  height?: number
  className?: string
}

const CHART_COLORS = {
  primary: 'hsl(195, 55%, 40%)',
  secondary: 'hsl(160, 60%, 45%)',
  tertiary: 'hsl(40, 80%, 55%)',
  quaternary: 'hsl(280, 50%, 50%)',
  quinary: 'hsl(15, 70%, 55%)',
}

const CHART_LAYOUT_BASE: Partial<Layout> = {
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  font: {
    family: 'Inter, system-ui, sans-serif',
    color: 'hsl(210, 20%, 75%)',
  },
  margin: { t: 50, r: 30, b: 50, l: 60 },
  showlegend: true,
  legend: {
    bgcolor: 'rgba(0,0,0,0)',
    font: { color: 'hsl(210, 20%, 75%)' },
  },
}

export function DataPlotter({ visualization, isLoading = false, height = 400, className = '' }: DataPlotterProps) {
  const { data, layout } = useMemo(() => {
    switch (visualization.type) {
      case 'piper':
        return buildPiperChart(visualization.payload as PiperPayload, visualization.title)
      case 'scatter':
        return buildScatterChart(visualization.payload as ScatterPayload, visualization.title)
      case 'bar':
        return buildBarChart(visualization.payload as BarPayload, visualization.title)
      case 'ternary':
        return buildTernaryChart(visualization.payload as TrilinearData, visualization.title)
      default:
        return { data: [], layout: {} }
    }
  }, [visualization])

  if (isLoading) {
    return (
      <div className={`strata-card p-4 ${className}`}>
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="w-full" style={{ height: height - 40 }} />
      </div>
    )
  }

  return (
    <div className={`strata-card overflow-hidden ${className}`}>
      <Plot
        data={data}
        layout={{
          ...CHART_LAYOUT_BASE,
          ...layout,
          height,
          autosize: true,
        }}
        config={{
          displayModeBar: true,
          displaylogo: false,
          responsive: true,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
        }}
        style={{ width: '100%' }}
        useResizeHandler
      />
    </div>
  )
}

function buildScatterChart(payload: ScatterPayload, title: string): { data: Data[]; layout: Partial<Layout> } {
  const data: Data[] = [
    {
      type: 'scatter',
      mode: 'markers',
      x: payload.x,
      y: payload.y,
      text: payload.point_labels,
      marker: {
        size: 12,
        color: CHART_COLORS.primary,
        line: { color: 'hsl(195, 55%, 60%)', width: 1 },
      },
      hovertemplate: '<b>%{text}</b><br>' + payload.x_label + ': %{x}<br>' + payload.y_label + ': %{y}<extra></extra>',
    },
  ]

  // Add trend line
  const n = payload.x.length
  const sumX = payload.x.reduce((a, b) => a + b, 0)
  const sumY = payload.y.reduce((a, b) => a + b, 0)
  const sumXY = payload.x.reduce((acc, x, i) => acc + x * payload.y[i], 0)
  const sumXX = payload.x.reduce((acc, x) => acc + x * x, 0)
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  const xMin = Math.min(...payload.x)
  const xMax = Math.max(...payload.x)

  data.push({
    type: 'scatter',
    mode: 'lines',
    x: [xMin, xMax],
    y: [slope * xMin + intercept, slope * xMax + intercept],
    line: { color: CHART_COLORS.secondary, width: 2, dash: 'dash' },
    name: 'Tendência',
    hoverinfo: 'skip',
  })

  return {
    data,
    layout: {
      title: { text: title, font: { size: 16 } },
      xaxis: {
        title: payload.x_label,
        gridcolor: 'hsl(215, 20%, 20%)',
        zerolinecolor: 'hsl(215, 20%, 25%)',
      },
      yaxis: {
        title: payload.y_label,
        gridcolor: 'hsl(215, 20%, 20%)',
        zerolinecolor: 'hsl(215, 20%, 25%)',
      },
    },
  }
}

function buildBarChart(payload: BarPayload, title: string): { data: Data[]; layout: Partial<Layout> } {
  const colors = payload.values.map((v, i) => {
    const maxVal = Math.max(...payload.values)
    const threshold = maxVal * 0.8
    return v > threshold ? CHART_COLORS.tertiary : CHART_COLORS.primary
  })

  const data: Data[] = [
    {
      type: 'bar',
      x: payload.categories,
      y: payload.values,
      marker: {
        color: colors,
        line: { color: 'hsl(195, 55%, 60%)', width: 1 },
      },
      hovertemplate: '<b>%{x}</b><br>' + payload.value_label + ': %{y}<extra></extra>',
    },
  ]

  return {
    data,
    layout: {
      title: { text: title, font: { size: 16 } },
      xaxis: {
        tickangle: -45,
        gridcolor: 'hsl(215, 20%, 20%)',
      },
      yaxis: {
        title: payload.value_label,
        gridcolor: 'hsl(215, 20%, 20%)',
        zerolinecolor: 'hsl(215, 20%, 25%)',
      },
      showlegend: false,
    },
  }
}

function buildTernaryChart(payload: TrilinearData, title: string): { data: Data[]; layout: Partial<Layout> } {
  const data: Data[] = [
    {
      type: 'scatterternary',
      mode: 'markers',
      a: payload.a,
      b: payload.b,
      c: payload.c,
      marker: {
        size: 10,
        color: CHART_COLORS.primary,
        line: { color: 'hsl(195, 55%, 60%)', width: 1 },
      },
    },
  ]

  return {
    data,
    layout: {
      title: { text: title, font: { size: 16 } },
      ternary: {
        aaxis: { title: payload.labels[0], color: 'hsl(210, 20%, 75%)', gridcolor: 'hsl(215, 20%, 20%)' },
        baxis: { title: payload.labels[1], color: 'hsl(210, 20%, 75%)', gridcolor: 'hsl(215, 20%, 20%)' },
        caxis: { title: payload.labels[2], color: 'hsl(210, 20%, 75%)', gridcolor: 'hsl(215, 20%, 20%)' },
        bgcolor: 'transparent',
      },
    },
  }
}

function buildPiperChart(payload: PiperPayload, title: string): { data: Data[]; layout: Partial<Layout> } {
  // Piper diagram requires two ternary plots (cations and anions)
  // For a simplified version, we'll show both ternary plots side by side
  const cationData: Data = {
    type: 'scatterternary',
    mode: 'markers',
    a: payload.cation_trilinear.a,
    b: payload.cation_trilinear.b,
    c: payload.cation_trilinear.c,
    text: payload.sample_ids || payload.cation_trilinear.a.map((_, i) => `Amostra ${i + 1}`),
    marker: {
      size: 10,
      color: CHART_COLORS.primary,
      symbol: 'circle',
      line: { color: 'hsl(195, 55%, 70%)', width: 1 },
    },
    name: 'Cátions',
    hovertemplate: '<b>%{text}</b><br>Ca: %{a}%<br>Mg: %{b}%<br>Na+K: %{c}%<extra></extra>',
  }

  const anionData: Data = {
    type: 'scatterternary',
    mode: 'markers',
    a: payload.anion_trilinear.a,
    b: payload.anion_trilinear.b,
    c: payload.anion_trilinear.c,
    text: payload.sample_ids || payload.anion_trilinear.a.map((_, i) => `Amostra ${i + 1}`),
    marker: {
      size: 10,
      color: CHART_COLORS.secondary,
      symbol: 'diamond',
      line: { color: 'hsl(160, 60%, 60%)', width: 1 },
    },
    name: 'Ânions',
    hovertemplate: '<b>%{text}</b><br>Cl: %{a}%<br>SO4: %{b}%<br>HCO3+CO3: %{c}%<extra></extra>',
    subplot: 'ternary2',
  }

  return {
    data: [cationData, anionData],
    layout: {
      title: { text: title, font: { size: 16 } },
      ternary: {
        aaxis: {
          title: { text: payload.cation_trilinear.labels[0] },
          min: 0,
          color: 'hsl(210, 20%, 75%)',
          gridcolor: 'hsl(215, 20%, 25%)',
          linecolor: 'hsl(215, 20%, 30%)',
        },
        baxis: {
          title: { text: payload.cation_trilinear.labels[1] },
          min: 0,
          color: 'hsl(210, 20%, 75%)',
          gridcolor: 'hsl(215, 20%, 25%)',
          linecolor: 'hsl(215, 20%, 30%)',
        },
        caxis: {
          title: { text: payload.cation_trilinear.labels[2] },
          min: 0,
          color: 'hsl(210, 20%, 75%)',
          gridcolor: 'hsl(215, 20%, 25%)',
          linecolor: 'hsl(215, 20%, 30%)',
        },
        bgcolor: 'transparent',
        domain: { row: 0, column: 0 },
      },
      ternary2: {
        aaxis: {
          title: { text: payload.anion_trilinear.labels[0] },
          min: 0,
          color: 'hsl(210, 20%, 75%)',
          gridcolor: 'hsl(215, 20%, 25%)',
          linecolor: 'hsl(215, 20%, 30%)',
        },
        baxis: {
          title: { text: payload.anion_trilinear.labels[1] },
          min: 0,
          color: 'hsl(210, 20%, 75%)',
          gridcolor: 'hsl(215, 20%, 25%)',
          linecolor: 'hsl(215, 20%, 30%)',
        },
        caxis: {
          title: { text: payload.anion_trilinear.labels[2] },
          min: 0,
          color: 'hsl(210, 20%, 75%)',
          gridcolor: 'hsl(215, 20%, 25%)',
          linecolor: 'hsl(215, 20%, 30%)',
        },
        bgcolor: 'transparent',
        domain: { row: 0, column: 1 },
      },
      grid: { rows: 1, columns: 2, pattern: 'independent' },
      annotations: [
        {
          text: 'Diagrama Catiônico',
          x: 0.2,
          y: 1.1,
          xref: 'paper',
          yref: 'paper',
          showarrow: false,
          font: { size: 12, color: 'hsl(210, 20%, 75%)' },
        },
        {
          text: 'Diagrama Aniônico',
          x: 0.8,
          y: 1.1,
          xref: 'paper',
          yref: 'paper',
          showarrow: false,
          font: { size: 12, color: 'hsl(210, 20%, 75%)' },
        },
      ],
    },
  }
}

export default DataPlotter
