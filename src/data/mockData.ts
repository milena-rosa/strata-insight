// Mock data simulating backend Python API responses

export interface AnalysisMetadata {
  universo: string;
  units: string;
  project_name?: string;
  sample_count?: number;
  analysis_date?: string;
}

export interface TrilinearData {
  a: number[];
  b: number[];
  c: number[];
  labels: string[];
}

export interface PiperPayload {
  cation_trilinear: TrilinearData;
  anion_trilinear: TrilinearData;
  sample_ids?: string[];
}

export interface ScatterPayload {
  x: number[];
  y: number[];
  x_label: string;
  y_label: string;
  point_labels?: string[];
}

export interface BarPayload {
  categories: string[];
  values: number[];
  value_label: string;
}

export interface Visualization {
  type: 'piper' | 'scatter' | 'bar' | 'ternary';
  title: string;
  payload: PiperPayload | ScatterPayload | BarPayload | TrilinearData;
}

export interface AIInterpretation {
  summary: string;
  citations: string[];
  confidence?: number;
  key_findings?: string[];
}

export interface AnalysisResponse {
  analysis_metadata: AnalysisMetadata;
  visualizations: Visualization[];
  ai_interpretation: AIInterpretation;
}

// Piper Diagram Mock Data
export const mockPiperAnalysis: AnalysisResponse = {
  analysis_metadata: {
    universo: "Hidrogeologia",
    units: "meq/L",
    project_name: "Análise Hidrogeoquímica - Bacia do Paraná",
    sample_count: 12,
    analysis_date: "2025-01-29"
  },
  visualizations: [
    {
      type: "piper",
      title: "Diagrama de Piper - Amostras P-04",
      payload: {
        cation_trilinear: {
          a: [40, 20, 55, 30, 45, 25, 38, 50, 35, 28, 42, 33],
          b: [30, 50, 25, 40, 30, 45, 32, 28, 40, 42, 33, 37],
          c: [30, 30, 20, 30, 25, 30, 30, 22, 25, 30, 25, 30],
          labels: ["Ca", "Mg", "Na+K"]
        },
        anion_trilinear: {
          a: [50, 10, 60, 35, 55, 20, 45, 65, 40, 25, 48, 38],
          b: [20, 70, 15, 35, 20, 55, 25, 15, 30, 50, 27, 32],
          c: [30, 20, 25, 30, 25, 25, 30, 20, 30, 25, 25, 30],
          labels: ["Cl", "SO4", "HCO3+CO3"]
        },
        sample_ids: ["P-01", "P-02", "P-03", "P-04", "P-05", "P-06", "P-07", "P-08", "P-09", "P-10", "P-11", "P-12"]
      }
    },
    {
      type: "scatter",
      title: "Correlação Na+ vs Cl-",
      payload: {
        x: [12.5, 8.2, 15.6, 10.1, 14.2, 9.8, 11.5, 16.2, 10.8, 8.9, 12.1, 11.2],
        y: [14.2, 9.5, 17.8, 11.5, 15.8, 10.2, 13.1, 18.5, 12.2, 9.8, 13.8, 12.5],
        x_label: "Na+ (meq/L)",
        y_label: "Cl- (meq/L)",
        point_labels: ["P-01", "P-02", "P-03", "P-04", "P-05", "P-06", "P-07", "P-08", "P-09", "P-10", "P-11", "P-12"]
      }
    },
    {
      type: "bar",
      title: "Distribuição de TDS por Poço",
      payload: {
        categories: ["P-01", "P-02", "P-03", "P-04", "P-05", "P-06"],
        values: [450, 280, 520, 680, 390, 310],
        value_label: "TDS (mg/L)"
      }
    }
  ],
  ai_interpretation: {
    summary: `## Análise Hidrogeoquímica - Resumo Executivo

Notei uma **anomalia de Cloretos** no poço P-04, com concentração de 680 mg/L TDS, significativamente acima da média regional (380 mg/L). Esta anomalia pode indicar:

1. **Intrusão salina** na zona de captação
2. **Contaminação antrópica** por efluentes industriais
3. **Dissolução evaporítica** de formações geológicas profundas

### Classificação das Águas
A análise do Diagrama de Piper revela predominância de águas **bicarbonatadas cálcicas** (70% das amostras), típicas de aquíferos sedimentares da Bacia do Paraná.

### Recomendações
- Monitoramento mensal do poço P-04
- Análise isotópica δ18O/δ2H para rastreamento de origem
- Verificação de potenciais fontes de contaminação em raio de 500m`,
    citations: [
      "CONAMA 396/2008 - Classificação de Águas Subterrâneas",
      "Portaria 888/2021 MS - Potabilidade",
      "Feitosa & Manoel Filho (2008) - Hidrogeologia: Conceitos e Aplicações",
      "CETESB (2024) - Valores Orientadores para Solo e Água Subterrânea"
    ],
    confidence: 0.87,
    key_findings: [
      "Anomalia de cloretos em P-04",
      "70% das amostras são bicarbonatadas cálcicas",
      "Correlação positiva Na+/Cl- indica possível intrusão salina",
      "TDS médio dentro dos padrões CONAMA 396"
    ]
  }
};

// Raw sample data for GeoTable
export interface GeoSample {
  id: string;
  sample_id: string;
  collection_date: string;
  depth_m: number;
  ph: number;
  conductivity_us: number;
  tds_mg_l: number;
  ca_meq_l: number;
  mg_meq_l: number;
  na_meq_l: number;
  k_meq_l: number;
  cl_meq_l: number;
  so4_meq_l: number;
  hco3_meq_l: number;
  status: 'valid' | 'warning' | 'error';
}

export const mockSampleData: GeoSample[] = [
  { id: "1", sample_id: "P-01", collection_date: "2025-01-15", depth_m: 45.2, ph: 7.2, conductivity_us: 680, tds_mg_l: 450, ca_meq_l: 2.8, mg_meq_l: 1.5, na_meq_l: 12.5, k_meq_l: 0.8, cl_meq_l: 14.2, so4_meq_l: 1.2, hco3_meq_l: 3.5, status: 'valid' },
  { id: "2", sample_id: "P-02", collection_date: "2025-01-15", depth_m: 38.7, ph: 6.8, conductivity_us: 420, tds_mg_l: 280, ca_meq_l: 1.2, mg_meq_l: 2.8, na_meq_l: 8.2, k_meq_l: 0.5, cl_meq_l: 9.5, so4_meq_l: 4.2, hco3_meq_l: 2.8, status: 'valid' },
  { id: "3", sample_id: "P-03", collection_date: "2025-01-16", depth_m: 52.1, ph: 7.5, conductivity_us: 780, tds_mg_l: 520, ca_meq_l: 3.5, mg_meq_l: 1.2, na_meq_l: 15.6, k_meq_l: 1.2, cl_meq_l: 17.8, so4_meq_l: 0.9, hco3_meq_l: 4.1, status: 'valid' },
  { id: "4", sample_id: "P-04", collection_date: "2025-01-16", depth_m: 61.3, ph: 6.5, conductivity_us: 1020, tds_mg_l: 680, ca_meq_l: 1.8, mg_meq_l: 2.4, na_meq_l: 10.1, k_meq_l: 0.9, cl_meq_l: 11.5, so4_meq_l: 2.1, hco3_meq_l: 3.2, status: 'warning' },
  { id: "5", sample_id: "P-05", collection_date: "2025-01-17", depth_m: 42.8, ph: 7.1, conductivity_us: 590, tds_mg_l: 390, ca_meq_l: 2.9, mg_meq_l: 1.8, na_meq_l: 14.2, k_meq_l: 0.7, cl_meq_l: 15.8, so4_meq_l: 1.4, hco3_meq_l: 3.8, status: 'valid' },
  { id: "6", sample_id: "P-06", collection_date: "2025-01-17", depth_m: 35.5, ph: 7.3, conductivity_us: 465, tds_mg_l: 310, ca_meq_l: 1.5, mg_meq_l: 2.7, na_meq_l: 9.8, k_meq_l: 0.6, cl_meq_l: 10.2, so4_meq_l: 3.3, hco3_meq_l: 2.9, status: 'valid' },
  { id: "7", sample_id: "P-07", collection_date: "2025-01-18", depth_m: 48.9, ph: 7.0, conductivity_us: 545, tds_mg_l: 360, ca_meq_l: 2.4, mg_meq_l: 2.0, na_meq_l: 11.5, k_meq_l: 0.8, cl_meq_l: 13.1, so4_meq_l: 1.5, hco3_meq_l: 3.4, status: 'valid' },
  { id: "8", sample_id: "P-08", collection_date: "2025-01-18", depth_m: 55.2, ph: 7.4, conductivity_us: 820, tds_mg_l: 545, ca_meq_l: 3.2, mg_meq_l: 1.4, na_meq_l: 16.2, k_meq_l: 1.0, cl_meq_l: 18.5, so4_meq_l: 0.8, hco3_meq_l: 4.0, status: 'valid' },
  { id: "9", sample_id: "P-09", collection_date: "2025-01-19", depth_m: 40.1, ph: 6.9, conductivity_us: 510, tds_mg_l: 340, ca_meq_l: 2.1, mg_meq_l: 2.4, na_meq_l: 10.8, k_meq_l: 0.7, cl_meq_l: 12.2, so4_meq_l: 1.8, hco3_meq_l: 3.1, status: 'valid' },
  { id: "10", sample_id: "P-10", collection_date: "2025-01-19", depth_m: 36.8, ph: 6.7, conductivity_us: 398, tds_mg_l: 265, ca_meq_l: 1.4, mg_meq_l: 2.5, na_meq_l: 8.9, k_meq_l: 0.5, cl_meq_l: 9.8, so4_meq_l: 3.0, hco3_meq_l: 2.7, status: 'valid' },
  { id: "11", sample_id: "P-11", collection_date: "2025-01-20", depth_m: 50.4, ph: 7.2, conductivity_us: 630, tds_mg_l: 420, ca_meq_l: 2.6, mg_meq_l: 2.0, na_meq_l: 12.1, k_meq_l: 0.9, cl_meq_l: 13.8, so4_meq_l: 1.6, hco3_meq_l: 3.6, status: 'valid' },
  { id: "12", sample_id: "P-12", collection_date: "2025-01-20", depth_m: 44.6, ph: 7.0, conductivity_us: 565, tds_mg_l: 375, ca_meq_l: 2.0, mg_meq_l: 2.2, na_meq_l: 11.2, k_meq_l: 0.8, cl_meq_l: 12.5, so4_meq_l: 1.9, hco3_meq_l: 3.3, status: 'valid' },
];

// Schema mapping mock
export interface ColumnMapping {
  original_column: string;
  geo_parameter: string | null;
  detected_type: 'numeric' | 'text' | 'date' | 'unknown';
  sample_values: string[];
  confidence: number;
}

export const mockColumnMappings: ColumnMapping[] = [
  { original_column: "ID_Amostra", geo_parameter: "sample_id", detected_type: "text", sample_values: ["P-01", "P-02", "P-03"], confidence: 0.95 },
  { original_column: "Data_Coleta", geo_parameter: "collection_date", detected_type: "date", sample_values: ["2025-01-15", "2025-01-16"], confidence: 0.98 },
  { original_column: "Prof_m", geo_parameter: "depth_m", detected_type: "numeric", sample_values: ["45.2", "38.7", "52.1"], confidence: 0.92 },
  { original_column: "pH", geo_parameter: "ph", detected_type: "numeric", sample_values: ["7.2", "6.8", "7.5"], confidence: 0.99 },
  { original_column: "Cond_uS", geo_parameter: "conductivity_us", detected_type: "numeric", sample_values: ["680", "420", "780"], confidence: 0.88 },
  { original_column: "STD_mg_L", geo_parameter: "tds_mg_l", detected_type: "numeric", sample_values: ["450", "280", "520"], confidence: 0.85 },
  { original_column: "Calcio", geo_parameter: "ca_meq_l", detected_type: "numeric", sample_values: ["2.8", "1.2", "3.5"], confidence: 0.90 },
  { original_column: "Magnesio", geo_parameter: "mg_meq_l", detected_type: "numeric", sample_values: ["1.5", "2.8", "1.2"], confidence: 0.90 },
  { original_column: "Sodio", geo_parameter: "na_meq_l", detected_type: "numeric", sample_values: ["12.5", "8.2", "15.6"], confidence: 0.90 },
  { original_column: "Potassio", geo_parameter: "k_meq_l", detected_type: "numeric", sample_values: ["0.8", "0.5", "1.2"], confidence: 0.88 },
  { original_column: "Cloreto", geo_parameter: "cl_meq_l", detected_type: "numeric", sample_values: ["14.2", "9.5", "17.8"], confidence: 0.92 },
  { original_column: "Sulfato", geo_parameter: "so4_meq_l", detected_type: "numeric", sample_values: ["1.2", "4.2", "0.9"], confidence: 0.91 },
  { original_column: "Bicarbonato", geo_parameter: "hco3_meq_l", detected_type: "numeric", sample_values: ["3.5", "2.8", "4.1"], confidence: 0.89 },
];

// Mock projects
export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'processing' | 'completed' | 'error';
  sample_count: number;
  universe: string;
}

export const mockProjects: Project[] = [
  { id: "proj-001", name: "Bacia do Paraná - Hidrogeoquímica", description: "Análise de qualidade de água subterrânea em poços de monitoramento", created_at: "2025-01-10", updated_at: "2025-01-29", status: "completed", sample_count: 12, universe: "Hidrogeologia" },
  { id: "proj-002", name: "Serra do Curral - Geoquímica de Solo", description: "Mapeamento de anomalias geoquímicas para prospecção mineral", created_at: "2025-01-05", updated_at: "2025-01-28", status: "processing", sample_count: 48, universe: "Geoquímica" },
  { id: "proj-003", name: "Quadrilátero Ferrífero - Classificação Litológica", description: "Identificação automatizada de tipos litológicos via ML", created_at: "2024-12-20", updated_at: "2025-01-25", status: "completed", sample_count: 156, universe: "Petrografia" },
  { id: "proj-004", name: "Bacia Amazônica - Sedimentologia", description: "Análise granulométrica de sedimentos fluviais", created_at: "2025-01-20", updated_at: "2025-01-20", status: "draft", sample_count: 0, universe: "Sedimentologia" },
];

// Tenants mock
export interface Tenant {
  id: string;
  name: string;
  logo_url?: string;
  subscription_tier: 'starter' | 'professional' | 'enterprise';
}

export const mockTenants: Tenant[] = [
  { id: "tenant-001", name: "GeoAnalytics Consultoria", subscription_tier: "professional" },
  { id: "tenant-002", name: "Vale Mineração S.A.", subscription_tier: "enterprise" },
  { id: "tenant-003", name: "Instituto Geológico do Brasil", subscription_tier: "professional" },
];

// Geological parameters for schema mapping
export const geoParameters = [
  { value: "sample_id", label: "ID da Amostra", unit: null },
  { value: "collection_date", label: "Data de Coleta", unit: null },
  { value: "depth_m", label: "Profundidade", unit: "m" },
  { value: "ph", label: "pH", unit: null },
  { value: "conductivity_us", label: "Condutividade", unit: "μS/cm" },
  { value: "tds_mg_l", label: "Sólidos Totais Dissolvidos", unit: "mg/L" },
  { value: "ca_meq_l", label: "Cálcio (Ca²⁺)", unit: "meq/L" },
  { value: "mg_meq_l", label: "Magnésio (Mg²⁺)", unit: "meq/L" },
  { value: "na_meq_l", label: "Sódio (Na⁺)", unit: "meq/L" },
  { value: "k_meq_l", label: "Potássio (K⁺)", unit: "meq/L" },
  { value: "cl_meq_l", label: "Cloreto (Cl⁻)", unit: "meq/L" },
  { value: "so4_meq_l", label: "Sulfato (SO₄²⁻)", unit: "meq/L" },
  { value: "hco3_meq_l", label: "Bicarbonato (HCO₃⁻)", unit: "meq/L" },
  { value: "co3_meq_l", label: "Carbonato (CO₃²⁻)", unit: "meq/L" },
  { value: "no3_meq_l", label: "Nitrato (NO₃⁻)", unit: "meq/L" },
  { value: "fe_mg_l", label: "Ferro (Fe)", unit: "mg/L" },
  { value: "mn_mg_l", label: "Manganês (Mn)", unit: "mg/L" },
  { value: "latitude", label: "Latitude", unit: "°" },
  { value: "longitude", label: "Longitude", unit: "°" },
  { value: "elevation_m", label: "Elevação", unit: "m" },
];
