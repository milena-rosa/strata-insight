import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileUploadZone, SchemaMapper } from '@/components/ui-geo'
import { mockColumnMappings } from '@/data/mockData'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type Step = 'upload' | 'details' | 'mapping' | 'confirm'

const steps: { id: Step; label: string }[] = [
  { id: 'upload', label: 'Upload' },
  { id: 'details', label: 'Detalhes' },
  { id: 'mapping', label: 'Mapeamento' },
  { id: 'confirm', label: 'Confirmar' },
]

export function NewProjectPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<Step>('upload')
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id)
    }
  }

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id)
    }
  }

  const handleConfirm = () => {
    toast({
      title: 'Projeto criado com sucesso!',
      description: 'Iniciando processamento dos dados...',
    })
    setTimeout(() => {
      navigate('/projects/proj-001/analysis')
    }, 1000)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'upload':
        return uploadedFiles.length > 0
      case 'details':
        return projectName.trim().length > 0
      case 'mapping':
        return true
      case 'confirm':
        return true
      default:
        return false
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center px-6">
          <Link to="/projects">
            <Button variant="ghost" size="icon" aria-label="Voltar">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="ml-4">
            <h1 className="text-xl font-bold text-foreground">Novo Projeto</h1>
            <p className="text-sm text-muted-foreground">Criar nova análise geológica</p>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border bg-muted/30 px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Progresso" className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex
              const isCurrent = step.id === currentStep

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                        isCompleted && 'bg-accent text-accent-foreground',
                        isCurrent && 'bg-primary text-primary-foreground',
                        !isCompleted && !isCurrent && 'bg-muted text-muted-foreground',
                      )}
                    >
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isCurrent && 'text-foreground',
                        !isCurrent && 'text-muted-foreground',
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn('mx-4 h-0.5 w-16', index < currentStepIndex ? 'bg-accent' : 'bg-border')} />
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-3xl">
          {currentStep === 'upload' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Upload de Dados</h2>
                <p className="text-sm text-muted-foreground">
                  Selecione os arquivos CSV ou Excel com seus dados geológicos
                </p>
              </div>
              <FileUploadZone onUploadComplete={(files) => setUploadedFiles(files)} />
            </div>
          )}

          {currentStep === 'details' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Detalhes do Projeto</h2>
                <p className="text-sm text-muted-foreground">Preencha as informações básicas do projeto</p>
              </div>
              <div className="strata-card p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Nome do Projeto *</Label>
                  <Input
                    id="project-name"
                    placeholder="Ex: Análise Hidrogeoquímica - Bacia do Paraná"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-description">Descrição</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Descreva brevemente o objetivo do projeto..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 'mapping' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Mapeamento de Schema</h2>
                <p className="text-sm text-muted-foreground">Confirme o mapeamento automático das colunas</p>
              </div>
              <SchemaMapper mappings={mockColumnMappings} onConfirm={() => handleNext()} />
            </div>
          )}

          {currentStep === 'confirm' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Confirmar e Processar</h2>
                <p className="text-sm text-muted-foreground">Revise as informações antes de iniciar o processamento</p>
              </div>
              <div className="strata-card p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome do Projeto</p>
                    <p className="text-foreground">{projectName || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Arquivos</p>
                    <p className="text-foreground">{uploadedFiles.length} arquivo(s)</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                    <p className="text-foreground">{projectDescription || 'Não informado'}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    Ao confirmar, seus dados serão processados automaticamente pelo sistema de IA. Isso pode levar
                    alguns minutos dependendo do volume de dados.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-background px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Button variant="outline" onClick={handleBack} disabled={currentStepIndex === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          {currentStep === 'confirm' ? (
            <Button onClick={handleConfirm}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirmar e Processar
            </Button>
          ) : currentStep === 'mapping' ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}

export default NewProjectPage
