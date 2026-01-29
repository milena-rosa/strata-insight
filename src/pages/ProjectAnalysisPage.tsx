import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Database, BarChart3, FileText, Download, RefreshCw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { DataPlotter, AnalysisCard, GeoTable, geoSampleColumns } from '@/components/ui-geo';
import { mockPiperAnalysis, mockSampleData, mockProjects } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export function ProjectAnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('charts');
  const [isLoading, setIsLoading] = useState(false);

  const project = mockProjects.find((p) => p.id === id);
  const analysis = mockPiperAnalysis;

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Análise atualizada',
        description: 'Os dados foram sincronizados com sucesso.',
      });
    }, 1500);
  };

  const handleExport = () => {
    toast({
      title: 'Exportação iniciada',
      description: 'O relatório será baixado em instantes.',
    });
  };

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Projeto não encontrado</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link to="/projects">
              <Button variant="ghost" size="icon" aria-label="Voltar para projetos">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">{project.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{analysis.analysis_metadata.universo}</Badge>
                <span>•</span>
                <span>{analysis.analysis_metadata.sample_count || mockSampleData.length} amostras</span>
                <span>•</span>
                <span>Unidades: {analysis.analysis_metadata.units}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
            <Button size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="data" className="gap-2">
              <Database className="h-4 w-4" />
              Dados Brutos
            </TabsTrigger>
            <TabsTrigger value="charts" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Gráficos
            </TabsTrigger>
            <TabsTrigger value="report" className="gap-2">
              <FileText className="h-4 w-4" />
              Relatório IA
            </TabsTrigger>
          </TabsList>

          {/* Raw Data Tab */}
          <TabsContent value="data" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Dados Brutos</h2>
                <p className="text-sm text-muted-foreground">
                  Visualize e ordene os dados originais do seu dataset
                </p>
              </div>
            </div>
            <GeoTable
              data={mockSampleData}
              columns={geoSampleColumns}
              isLoading={isLoading}
              pageSize={10}
              onRowClick={(row) => {
                toast({
                  title: `Amostra ${row.sample_id}`,
                  description: `TDS: ${row.tds_mg_l} mg/L | pH: ${row.ph}`,
                });
              }}
            />
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Visualizações</h2>
                <p className="text-sm text-muted-foreground">
                  Diagramas e gráficos gerados automaticamente
                </p>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="strata-card p-4">
                    <Skeleton className="h-6 w-48 mb-4" />
                    <Skeleton className="h-[350px] w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Piper Diagram - Full Width */}
                <DataPlotter
                  visualization={analysis.visualizations[0]}
                  height={500}
                />
                
                {/* Secondary charts - Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                  {analysis.visualizations.slice(1).map((viz, index) => (
                    <DataPlotter
                      key={index}
                      visualization={viz}
                      height={350}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* AI Report Tab */}
          <TabsContent value="report" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Análise Interpretativa</h2>
                <p className="text-sm text-muted-foreground">
                  Insights gerados por IA com base nos seus dados e normas técnicas
                </p>
              </div>
            </div>
            <AnalysisCard
              interpretation={analysis.ai_interpretation}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProjectAnalysisPage;
