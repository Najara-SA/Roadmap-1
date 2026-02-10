
export type Language = 'pt' | 'es' | 'en';

export const translations = {
  pt: {
    // Shared
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    search: 'Buscar...',
    loading: 'Carregando...',

    // Header & Sidebar
    strategyMatrix: 'Matriz de Estratégia',
    featureBoard: 'Quadro de Funcionalidades',
    executionTimeline: 'Linha do Tempo',
    insights: 'Insights',
    infrastructure: 'Infraestrutura',
    newTheme: 'Novo Tema',
    searchPlaceHolder: 'Buscar recursos...',
    supabaseLive: 'Supabase Ativo',
    localSafe: 'Modo Local',
    connError: 'Erro de Conexão',
    syncing: 'Sincronizando...',

    // Views
    backlog: 'Backlog',
    planning: 'Planejamento',
    inDevelopment: 'Em Desenvolvimento',
    completed: 'Concluído',
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
    priority: 'Prioridade',
    effort: 'Esforço',
    value: 'Valor',

    // Modals
    editItem: 'Editar Item',
    addItem: 'Adicionar Item',
    title: 'Título',
    description: 'Descrição',
    product: 'Produto',
    team: 'Time',
    status: 'Status',
    startDate: 'Mês de Início',
    duration: 'Duração (Meses)',
    tags: 'Tags',
    subFeatures: 'Sub-funcionalidades',
    milestones: 'Marcos (Milestones)',
    newProduct: 'Novo Produto',
    noProducts: 'Nenhum Produto Cadastrado',

    // Timeline
    executionRoadmap: 'Roteiro de Execução',
    strategicSequence: 'Sequência Estratégica',
    cascadeDetails: 'Detalhes em Cascata',
    roadmapSubTitle: 'Uma visão detalhada de requisitos e temas cascateados.',

    // Analytics
    totalItems: 'Total de Itens Estratégicos',
    executionRate: 'Taxa de Execução',
    activeDevelopment: 'Desenvolvimento Ativo',
    priorityMatrix: 'Matriz de Prioridade Estratégica',
    devVelocity: 'Velocidade de Desenvolvimento',
    effortComplexity: 'Esforço (Complexidade)',
    businessValue: 'Valor de Negócio',
    lowComplexity: 'Baixa Complexidade',
    highComplexity: 'Alta Complexidade',
  },
  es: {
    // Shared
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    search: 'Buscar...',
    loading: 'Cargando...',

    // Header & Sidebar
    strategyMatrix: 'Matriz de Estrategia',
    featureBoard: 'Tablero de Funciones',
    executionTimeline: 'Línea de Tiempo',
    insights: 'Insights',
    infrastructure: 'Infraestructura',
    newTheme: 'Nuevo Tema',
    searchPlaceHolder: 'Buscar recursos...',
    supabaseLive: 'Supabase Activo',
    localSafe: 'Modo Local',
    connError: 'Error de Conexión',
    syncing: 'Sincronizando...',

    // Views
    backlog: 'Backlog',
    planning: 'Planificación',
    inDevelopment: 'En Desarrollo',
    completed: 'Completado',
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
    priority: 'Prioridad',
    effort: 'Esfuerzo',
    value: 'Valor',

    // Modals
    editItem: 'Editar Item',
    addItem: 'Añadir Item',
    title: 'Título',
    description: 'Descripción',
    product: 'Producto',
    team: 'Equipo',
    status: 'Estado',
    startDate: 'Mes de Inicio',
    duration: 'Duración (Meses)',
    tags: 'Etiquetas',
    subFeatures: 'Sub-funciones',
    milestones: 'Hitos (Milestones)',
    newProduct: 'Nuevo Producto',
    noProducts: 'Ningún Producto Registrado',

    // Timeline
    executionRoadmap: 'Hoja de Ruta de Ejecución',
    strategicSequence: 'Secuencia Estratégica',
    cascadeDetails: 'Detalles en Cascada',
    roadmapSubTitle: 'Una vista detallada de los requisitos y temas en cascada.',

    // Analytics
    totalItems: 'Total de Ítems Estratégicos',
    executionRate: 'Tasa de Ejecución',
    activeDevelopment: 'Desarrollo Activo',
    priorityMatrix: 'Matriz de Prioridad Estratégica',
    devVelocity: 'Velocidad de Desarrollo',
    effortComplexity: 'Esfuerzo (Complejidad)',
    businessValue: 'Valor de Negocio',
    lowComplexity: 'Baja Complejidad',
    highComplexity: 'Alta Complejidad',
  },
  en: {
    // Shared
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search...',
    loading: 'Loading...',

    // Header & Sidebar
    strategyMatrix: 'Strategy Matrix',
    featureBoard: 'Feature Board',
    executionTimeline: 'Execution Timeline',
    insights: 'Insights',
    infrastructure: 'Infrastructure',
    newTheme: 'New Theme',
    searchPlaceHolder: 'Search resources...',
    supabaseLive: 'Supabase Live',
    localSafe: 'Local Safe',
    connError: 'Conn Error',
    syncing: 'Syncing...',

    // Views
    backlog: 'Backlog',
    planning: 'Planning',
    inDevelopment: 'In Development',
    completed: 'Completed',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    priority: 'Priority',
    effort: 'Effort',
    value: 'Value',

    // Modals
    editItem: 'Edit Item',
    addItem: 'Add Item',
    title: 'Title',
    description: 'Description',
    product: 'Product',
    team: 'Team',
    status: 'Status',
    startDate: 'Start Month',
    duration: 'Duration (Months)',
    tags: 'Tags',
    subFeatures: 'Sub-features',
    milestones: 'Milestones',
    newProduct: 'New Product',
    noProducts: 'No Products Registered',

    // Timeline
    executionRoadmap: 'Execution Roadmap',
    strategicSequence: 'Strategic Sequence',
    cascadeDetails: 'Cascade Details',
    roadmapSubTitle: 'A detailed view of cascaded requirements and themes.',

    // Analytics
    totalItems: 'Total Strategic Items',
    executionRate: 'Execution Rate',
    activeDevelopment: 'Active Development',
    priorityMatrix: 'Strategic Priority Matrix',
    devVelocity: 'Development Velocity',
    effortComplexity: 'Effort (Complexity)',
    businessValue: 'Business Value',
    lowComplexity: 'Low Complexity',
    highComplexity: 'High Complexity',
  }
};
