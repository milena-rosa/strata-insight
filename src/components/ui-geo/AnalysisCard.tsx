import { AlertCircle, BookOpen, CheckCircle, Lightbulb, TrendingUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { AIInterpretation } from '@/data/mockData'

interface AnalysisCardProps {
  interpretation: AIInterpretation
  isLoading?: boolean
  className?: string
}

export function AnalysisCard({ interpretation, isLoading = false, className = '' }: AnalysisCardProps) {
  if (isLoading) {
    return (
      <div className={`strata-card p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
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
              <Lightbulb className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Análise Interpretativa IA</h3>
              <p className="text-sm text-muted-foreground">Gerado por RAG + LLM</p>
            </div>
          </div>
          {interpretation.confidence && (
            <Badge
              variant="outline"
              className="border-accent text-accent"
              aria-label={`Confiança: ${Math.round(interpretation.confidence * 100)}%`}
            >
              <TrendingUp className="mr-1 h-3 w-3" aria-hidden="true" />
              {Math.round(interpretation.confidence * 100)}% confiança
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Key Findings */}
        {interpretation.key_findings && interpretation.key_findings.length > 0 && (
          <div className="mb-6 rounded-lg bg-muted/30 p-4" role="region" aria-label="Principais descobertas">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-accent" aria-hidden="true" />
              Principais Descobertas
            </h4>
            <ul className="space-y-2">
              {interpretation.key_findings.map((finding, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Summary */}
        <div className="prose prose-invert prose-sm max-w-none" role="region" aria-label="Resumo da análise">
          <ReactMarkdown
            components={{
              h2: ({ children }) => <h2 className="mt-0 mb-4 text-lg font-semibold text-foreground">{children}</h2>,
              h3: ({ children }) => <h3 className="mt-4 mb-2 text-base font-medium text-foreground">{children}</h3>,
              p: ({ children }) => <p className="text-muted-foreground leading-relaxed">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-strata-amber">{children}</strong>,
              ul: ({ children }) => <ul className="my-3 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="my-3 space-y-1 list-decimal list-inside">{children}</ol>,
              li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
            }}
          >
            {interpretation.summary}
          </ReactMarkdown>
        </div>

        {/* Citations */}
        {interpretation.citations && interpretation.citations.length > 0 && (
          <div className="mt-6 border-t border-border pt-4" role="region" aria-label="Referências normativas">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Referências Normativas
            </h4>
            <div className="flex flex-wrap gap-2">
              {interpretation.citations.map((citation, index) => (
                <Badge key={index} variant="secondary" className="text-xs font-normal">
                  {citation}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer disclaimer */}
      <div className="border-t border-border bg-muted/20 px-6 py-3">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3" aria-hidden="true" />
          Esta análise é gerada por inteligência artificial e deve ser validada por um profissional qualificado.
        </p>
      </div>
    </div>
  )
}

export default AnalysisCard
