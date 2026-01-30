import { Download, ExternalLink, FileText, Search, Tag } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface TechnicalStandard {
  id: string
  code: string
  title: string
  description: string
  category: string
  year: number
  status: 'active' | 'revised' | 'superseded'
}

const standards: TechnicalStandard[] = [
  {
    id: '1',
    code: 'CONAMA 396/2008',
    title: 'Classificação e Diretrizes para Águas Subterrâneas',
    description: 'Dispõe sobre a classificação e diretrizes ambientais para o enquadramento das águas subterrâneas.',
    category: 'Hidrogeologia',
    year: 2008,
    status: 'active',
  },
  {
    id: '2',
    code: 'Portaria 888/2021',
    title: 'Padrões de Potabilidade da Água',
    description: 'Estabelece os procedimentos de controle e de vigilância da qualidade da água para consumo humano.',
    category: 'Potabilidade',
    year: 2021,
    status: 'active',
  },
  {
    id: '3',
    code: 'NBR 13895',
    title: 'Construção de Poços de Monitoramento',
    description: 'Fixa as condições exigíveis para a construção de poços de monitoramento e amostragem.',
    category: 'Engenharia',
    year: 1997,
    status: 'revised',
  },
  {
    id: '4',
    code: 'CETESB 195/2005',
    title: 'Valores Orientadores para Solo e Águas Subterrâneas',
    description:
      'Estabelece valores orientadores para proteção da qualidade do solo e águas subterrâneas no Estado de São Paulo.',
    category: 'Contaminação',
    year: 2005,
    status: 'revised',
  },
  {
    id: '5',
    code: 'NBR 15495-1',
    title: 'Poços de Monitoramento de Águas Subterrâneas',
    description: 'Projeto, construção e desativação de poços de monitoramento de águas subterrâneas.',
    category: 'Engenharia',
    year: 2007,
    status: 'active',
  },
  {
    id: '6',
    code: 'ANA Manual',
    title: 'Manual de Outorga de Direito de Uso de Recursos Hídricos',
    description: 'Orientações para outorga de captação e uso de recursos hídricos subterrâneos.',
    category: 'Regulação',
    year: 2013,
    status: 'active',
  },
]

const categoryColors: Record<string, string> = {
  Hidrogeologia: 'bg-strata-petroleum/20 text-strata-petroleum-light border-strata-petroleum/30',
  Potabilidade: 'bg-accent/20 text-accent border-accent/30',
  Engenharia: 'bg-strata-amber/20 text-strata-amber border-strata-amber/30',
  Contaminação: 'bg-destructive/20 text-destructive border-destructive/30',
  Regulação: 'bg-secondary text-secondary-foreground border-secondary',
}

const statusConfig = {
  active: { label: 'Vigente', className: 'bg-accent/20 text-accent' },
  revised: { label: 'Revisada', className: 'bg-strata-amber/20 text-strata-amber' },
  superseded: { label: 'Substituída', className: 'bg-muted text-muted-foreground' },
}

export function StandardsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [...new Set(standards.map((s) => s.category))]

  const filteredStandards = standards.filter((standard) => {
    const matchesSearch =
      standard.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      standard.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || standard.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Normas Técnicas</h1>
            <p className="text-sm text-muted-foreground">Base de conhecimento regulatório para análises</p>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar normas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Todas
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStandards.map((standard) => (
            <Card key={standard.id} className="strata-card group hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <Badge className={statusConfig[standard.status].className}>
                    {statusConfig[standard.status].label}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-base">
                  <span className="text-primary">{standard.code}</span>
                </CardTitle>
                <CardDescription className="line-clamp-2 text-foreground/80">{standard.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{standard.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="outline" className={categoryColors[standard.category]}>
                    <Tag className="mr-1 h-3 w-3" />
                    {standard.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStandards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Nenhuma norma encontrada</h3>
            <p className="mt-1 text-sm text-muted-foreground">Tente ajustar os filtros de busca</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StandardsPage
