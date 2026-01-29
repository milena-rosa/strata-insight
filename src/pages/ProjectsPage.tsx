import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, FolderKanban, Clock, FlaskConical, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { FileUploadZone } from '@/components/ui-geo';
import { cn } from '@/lib/utils';
import { mockProjects, type Project } from '@/data/mockData';

const statusConfig = {
  draft: { label: 'Rascunho', icon: Clock, className: 'text-muted-foreground border-muted' },
  processing: { label: 'Processando', icon: Loader2, className: 'text-strata-amber border-strata-amber/50 animate-pulse' },
  completed: { label: 'Concluído', icon: CheckCircle, className: 'text-accent border-accent/50' },
  error: { label: 'Erro', icon: AlertCircle, className: 'text-destructive border-destructive/50' },
};

export function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isLoading] = useState(false);

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projetos</h1>
            <p className="text-sm text-muted-foreground">Gerencie seus projetos de análise geológica</p>
          </div>
          <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Projeto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Projeto</DialogTitle>
                <DialogDescription>
                  Faça upload de seus dados para iniciar uma nova análise geológica
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <FileUploadZone
                  onUploadComplete={(files) => {
                    console.log('Files uploaded:', files);
                    // Navigate to schema mapping
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar projetos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Buscar projetos"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="strata-card">
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FolderKanban className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-foreground">Nenhum projeto encontrado</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery ? 'Tente uma busca diferente' : 'Crie seu primeiro projeto para começar'}
            </p>
            {!searchQuery && (
              <Button className="mt-4 gap-2" onClick={() => setIsNewProjectOpen(true)}>
                <Plus className="h-4 w-4" />
                Criar Projeto
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const status = statusConfig[project.status];
  const StatusIcon = status.icon;

  return (
    <Link to={`/projects/${project.id}/analysis`}>
      <Card className="strata-card group cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-glow-petroleum">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg group-hover:text-gradient-petroleum transition-colors">
              {project.name}
            </CardTitle>
            <Badge variant="outline" className={cn('gap-1', status.className)}>
              <StatusIcon className={cn('h-3 w-3', project.status === 'processing' && 'animate-spin')} />
              {status.label}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FlaskConical className="h-4 w-4" />
              <span>{project.sample_count} amostras</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {project.universe}
            </Badge>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Atualizado em {new Date(project.updated_at).toLocaleDateString('pt-BR')}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default ProjectsPage;
