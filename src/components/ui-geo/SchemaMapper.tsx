import { AlertCircle, Check, HelpCircle, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { ColumnMapping } from '@/data/mockData'
import { geoParameters } from '@/data/mockData'
import { cn } from '@/lib/utils'

interface SchemaMapperProps {
  mappings: ColumnMapping[]
  onMappingChange?: (originalColumn: string, geoParameter: string | null) => void
  onConfirm?: (mappings: ColumnMapping[]) => void
  isLoading?: boolean
  className?: string
}

export function SchemaMapper({
  mappings: initialMappings,
  onMappingChange,
  onConfirm,
  isLoading = false,
  className = '',
}: SchemaMapperProps) {
  const [mappings, setMappings] = useState(initialMappings)

  const handleMappingChange = (originalColumn: string, geoParameter: string | null) => {
    setMappings((prev) =>
      prev.map((m) => (m.original_column === originalColumn ? { ...m, geo_parameter: geoParameter } : m)),
    )
    onMappingChange?.(originalColumn, geoParameter)
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) {
      return <Badge className="bg-accent/20 text-accent border-accent/30">Alta</Badge>
    } else if (confidence >= 0.7) {
      return <Badge className="bg-strata-amber/20 text-strata-amber border-strata-amber/30">Média</Badge>
    }
    return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Baixa</Badge>
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'numeric':
        return <span className="text-xs font-mono text-strata-petroleum-light">#</span>
      case 'text':
        return <span className="text-xs font-mono text-accent">Aa</span>
      case 'date':
        return <span className="text-xs font-mono text-strata-amber">📅</span>
      default:
        return <span className="text-xs font-mono text-muted-foreground">?</span>
    }
  }

  const unmappedCount = mappings.filter((m) => !m.geo_parameter).length
  const isComplete = unmappedCount === 0

  if (isLoading) {
    return (
      <div className={`strata-card overflow-hidden ${className}`}>
        <div className="border-b border-border p-4">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-48" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`strata-card overflow-hidden ${className}`}>
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-primary/10 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Mapeamento de Schema</h3>
              <p className="text-sm text-muted-foreground">
                Confirme o mapeamento entre colunas originais e parâmetros geológicos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isComplete && (
              <Badge variant="outline" className="border-strata-amber text-strata-amber">
                <AlertCircle className="mr-1 h-3 w-3" />
                {unmappedCount} não mapeados
              </Badge>
            )}
            {isComplete && (
              <Badge variant="outline" className="border-accent text-accent">
                <Check className="mr-1 h-3 w-3" />
                Mapeamento completo
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" aria-label="Mapeamento de colunas">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="p-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Coluna Original
              </th>
              <th className="p-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Tipo
              </th>
              <th className="p-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Valores de Exemplo
              </th>
              <th className="p-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Confiança IA
              </th>
              <th className="p-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Parâmetro Geológico
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {mappings.map((mapping) => (
              <tr
                key={mapping.original_column}
                className={cn('transition-colors hover:bg-muted/20', !mapping.geo_parameter && 'bg-strata-amber/5')}
              >
                <td className="p-3">
                  <code className="rounded bg-muted px-2 py-1 font-mono text-sm">{mapping.original_column}</code>
                </td>
                <td className="p-3 text-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded border border-border bg-muted/50">
                        {getTypeIcon(mapping.detected_type)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tipo detectado: {mapping.detected_type}</p>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {mapping.sample_values.slice(0, 3).map((val, i) => (
                      <span
                        key={i}
                        className="inline-block max-w-[80px] truncate rounded bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {val}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3 text-center">{getConfidenceBadge(mapping.confidence)}</td>
                <td className="p-3">
                  <Select
                    value={mapping.geo_parameter || ''}
                    onValueChange={(value) => handleMappingChange(mapping.original_column, value || null)}
                  >
                    <SelectTrigger
                      className={cn('w-[220px]', !mapping.geo_parameter && 'border-strata-amber/50')}
                      aria-label={`Selecionar parâmetro para ${mapping.original_column}`}
                    >
                      <SelectValue placeholder="Selecione um parâmetro..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">
                        <span className="text-muted-foreground">— Ignorar coluna —</span>
                      </SelectItem>
                      {geoParameters.map((param) => (
                        <SelectItem key={param.value} value={param.value}>
                          <div className="flex items-center gap-2">
                            <span>{param.label}</span>
                            {param.unit && <span className="text-xs text-muted-foreground">({param.unit})</span>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
          <span>O mapeamento pode ser ajustado manualmente para corrigir detecções automáticas.</span>
        </div>
        <Button onClick={() => onConfirm?.(mappings)} disabled={!isComplete} className="gap-2">
          <Check className="h-4 w-4" />
          Confirmar Mapeamento
        </Button>
      </div>
    </div>
  )
}

export default SchemaMapper
