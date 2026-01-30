import { CheckCircle, FileSpreadsheet, Loader2, Upload, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface UploadedFile {
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

interface FileUploadZoneProps {
  onFilesAccepted?: (files: File[]) => void
  onUploadComplete?: (files: File[]) => void
  acceptedFormats?: string[]
  maxFiles?: number
  maxSize?: number
  className?: string
}

export function FileUploadZone({
  onFilesAccepted,
  onUploadComplete,
  acceptedFormats = ['.csv', '.xlsx', '.xls'],
  maxFiles = 5,
  maxSize = 50 * 1024 * 1024, // 50MB
  className = '',
}: FileUploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        status: 'pending' as const,
        progress: 0,
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])
      onFilesAccepted?.(acceptedFiles)

      // Simulate upload progress
      newFiles.forEach((fileObj, index) => {
        const interval = setInterval(() => {
          setUploadedFiles((prev) =>
            prev.map((f) => {
              if (f.file === fileObj.file) {
                const newProgress = Math.min(f.progress + 10 + Math.random() * 20, 100)
                return {
                  ...f,
                  status: newProgress >= 100 ? 'success' : 'uploading',
                  progress: newProgress,
                }
              }
              return f
            }),
          )
        }, 200)

        setTimeout(
          () => {
            clearInterval(interval)
            setUploadedFiles((prev) =>
              prev.map((f) => (f.file === fileObj.file ? { ...f, status: 'success', progress: 100 } : f)),
            )

            // Check if all files are complete
            setTimeout(() => {
              setUploadedFiles((prev) => {
                const allComplete = prev.every((f) => f.status === 'success')
                if (allComplete) {
                  onUploadComplete?.(prev.map((f) => f.file))
                }
                return prev
              })
            }, 100)
          },
          1500 + index * 500,
        )
      })
    },
    [onFilesAccepted, onUploadComplete],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles,
    maxSize,
  })

  const removeFile = (file: File) => {
    setUploadedFiles((prev) => prev.filter((f) => f.file !== file))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200',
          'hover:border-primary/50 hover:bg-primary/5',
          isDragActive && 'border-primary bg-primary/10 scale-[1.02]',
          isDragReject && 'border-destructive bg-destructive/10',
          !isDragActive && !isDragReject && 'border-border',
        )}
        role="button"
        aria-label="Área de upload de arquivos"
        tabIndex={0}
      >
        <input {...getInputProps()} aria-label="Selecionar arquivos" />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-full transition-colors',
              isDragActive ? 'bg-primary/20' : 'bg-muted',
              isDragReject && 'bg-destructive/20',
            )}
          >
            <Upload
              className={cn(
                'h-8 w-8 transition-colors',
                isDragActive ? 'text-primary' : 'text-muted-foreground',
                isDragReject && 'text-destructive',
              )}
            />
          </div>

          <div>
            <p className="text-lg font-medium text-foreground">
              {isDragActive ? 'Solte os arquivos aqui...' : 'Arraste e solte seus arquivos aqui'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">ou clique para selecionar arquivos</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {acceptedFormats.map((format) => (
              <span key={format} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {format.toUpperCase().replace('.', '')}
              </span>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Máximo {maxFiles} arquivos, até {formatFileSize(maxSize)} cada
          </p>
        </div>
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((uploadedFile) => (
            <div
              key={uploadedFile.file.name}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <FileSpreadsheet className="h-5 w-5 text-accent" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-foreground">{uploadedFile.file.name}</p>
                  <p className="ml-2 text-xs text-muted-foreground">{formatFileSize(uploadedFile.file.size)}</p>
                </div>

                {uploadedFile.status === 'uploading' && (
                  <div className="mt-2">
                    <Progress value={uploadedFile.progress} className="h-1" />
                  </div>
                )}

                {uploadedFile.status === 'success' && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-accent">
                    <CheckCircle className="h-3 w-3" />
                    Upload completo
                  </p>
                )}

                {uploadedFile.status === 'error' && (
                  <p className="mt-1 text-xs text-destructive">{uploadedFile.error || 'Erro no upload'}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {uploadedFile.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-primary" />}

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeFile(uploadedFile.file)}
                  aria-label={`Remover ${uploadedFile.file.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUploadZone
