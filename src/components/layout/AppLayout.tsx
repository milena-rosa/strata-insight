import {
  Building2,
  ChevronDown,
  FileText,
  FolderKanban,
  HelpCircle,
  Layers,
  LogOut,
  Menu,
  Plus,
  Settings,
} from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { NavLink } from '@/components/NavLink'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockProjects, mockTenants } from '@/data/mockData'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Projetos', href: '/projects', icon: FolderKanban },
  { name: 'Normas Técnicas', href: '/standards', icon: FileText },
  { name: 'Configurações', href: '/settings', icon: Settings },
]

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState(mockTenants[0])
  const location = useLocation()

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'sticky top-0 h-screen flex-shrink-0 border-r border-sidebar-border bg-sidebar transition-all duration-300',
          sidebarCollapsed ? 'w-16' : 'w-64',
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Layers className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-gradient-petroleum">Strata</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Tenant Selector */}
          {!sidebarCollapsed && (
            <div className="border-b border-sidebar-border p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-sidebar-border bg-sidebar-accent/50 text-sidebar-foreground hover:bg-sidebar-accent"
                    aria-label="Selecionar empresa"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Building2 className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{selectedTenant.name}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 flex-shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Empresas</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {mockTenants.map((tenant) => (
                    <DropdownMenuItem
                      key={tenant.id}
                      onClick={() => setSelectedTenant(tenant)}
                      className={cn(tenant.id === selectedTenant.id && 'bg-accent')}
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      <span className="truncate">{tenant.name}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Empresa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3" aria-label="Navegação principal">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href)
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    isActive && 'bg-sidebar-accent text-sidebar-primary',
                  )}
                  activeClassName="bg-sidebar-accent text-sidebar-primary"
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </NavLink>
              )
            })}
          </nav>

          {/* Quick Stats */}
          {!sidebarCollapsed && (
            <div className="border-t border-sidebar-border p-4">
              <div className="rounded-lg bg-sidebar-accent/30 p-3">
                <p className="text-xs font-medium text-sidebar-foreground/70">Projetos Ativos</p>
                <p className="mt-1 text-2xl font-bold text-sidebar-primary">
                  {mockProjects.filter((p) => p.status !== 'draft').length}
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-sidebar-border p-3">
            <div className={cn('flex', sidebarCollapsed ? 'flex-col gap-2' : 'items-center gap-2')}>
              <Button
                variant="ghost"
                size={sidebarCollapsed ? 'icon' : 'sm'}
                className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                aria-label="Ajuda"
              >
                <HelpCircle className="h-4 w-4" />
                {!sidebarCollapsed && <span className="ml-2">Ajuda</span>}
              </Button>
              <Button
                variant="ghost"
                size={sidebarCollapsed ? 'icon' : 'sm'}
                className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                aria-label="Sair"
              >
                <LogOut className="h-4 w-4" />
                {!sidebarCollapsed && <span className="ml-2">Sair</span>}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

export default AppLayout
