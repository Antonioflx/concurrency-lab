const participantResultSchema = {
  type: 'object',
  properties: {
    participantId: { type: 'string', example: '6698a1b2c3d4e5f6a7b8c9d0' },
    name: { type: 'string', example: 'Participante 1' },
    totalIncome: { type: 'number', example: 8750 },
    membersCount: { type: 'number', example: 3 },
    perCapitaIncome: { type: 'integer', example: 2916 },
    perCapitaIncomeFormatted: { type: 'string', example: 'R$\u00a02.916,00' },
  },
}

const naiveConcurrencyInfoSchema = {
  type: 'object',
  properties: {
    batches: { type: 'integer', example: 8 },
    batchSize: { type: 'integer', example: 5 },
  },
}

const optimizedConcurrencyInfoSchema = {
  type: 'object',
  properties: {
    concurrencyLimit: { type: 'integer', example: 5 },
  },
}

const simulationResponseSchema = {
  type: 'object',
  properties: {
    mode: { type: 'string', enum: ['naive', 'optimized'], example: 'naive' },
    participantsCount: { type: 'integer', example: 40 },
    processingTimeMs: { type: 'integer', example: 8234 },
    concurrencyInfo: {
      oneOf: [naiveConcurrencyInfoSchema, optimizedConcurrencyInfoSchema],
    },
    excelFile: { type: 'string', example: 'consolidado_naive_1720612345678.xlsx' },
    emailSent: { type: 'boolean', example: false },
    resultsPreview: {
      type: 'array',
      items: participantResultSchema,
    },
  },
}

const compareResponseSchema = {
  type: 'object',
  properties: {
    participantsCount: { type: 'integer', example: 40 },
    naive: {
      type: 'object',
      properties: {
        processingTimeMs: { type: 'integer', example: 8234 },
        concurrencyInfo: naiveConcurrencyInfoSchema,
      },
    },
    optimized: {
      type: 'object',
      properties: {
        processingTimeMs: { type: 'integer', example: 1150 },
        concurrencyInfo: optimizedConcurrencyInfoSchema,
      },
    },
    speedup: { type: 'string', example: '7.16x' },
  },
}

const errorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string', example: 'O parâmetro "count" deve ser um inteiro >= 1.' },
  },
}

const countParameter = {
  name: 'count',
  in: 'query',
  description: 'Quantidade de participantes a simular (1–500, padrão: 20)',
  required: false,
  schema: { type: 'integer', default: 20, minimum: 1, maximum: 500 },
}

const simulationResponses = {
  200: {
    description: 'Resultado da simulação',
    content: { 'application/json': { schema: simulationResponseSchema } },
  },
  400: {
    description: 'Parâmetro inválido',
    content: { 'application/json': { schema: errorSchema } },
  },
  401: {
    description: 'Não autorizado',
    content: { 'application/json': { schema: errorSchema } },
  },
  500: {
    description: 'Erro interno do servidor',
    content: { 'application/json': { schema: errorSchema } },
  },
}

const apiKeySecurity = [{ ApiKeyAuth: [] }]

export const openapiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Concurrency Lab — Naive vs Pool-based Batch Processing',
    version: '1.0.0',
    description: [
      'Simulação de um problema real de performance: processamento de N registros com dependência de',
      'múltiplas fontes de dados, comparando uma abordagem sequencial em lotes fixos ("naive") contra',
      'um pool de concorrência dinâmico ("optimized"). Gera planilha Excel consolidada e envia por e-mail.',
    ].join(' '),
    contact: {
      name: 'Concurrency Lab',
    },
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local (desenvolvimento)' }],
  tags: [
    {
      name: 'Simulate',
      description: 'Endpoints de simulação de concorrência',
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description: 'Credencial obrigatória em todas as requisições. Configure via variável de ambiente API_KEY.',
      },
    },
  },
  paths: {
    '/api/simulate/naive': {
      post: {
        tags: ['Simulate'],
        summary: 'Simulação naive',
        description: [
          'Executa o cálculo sem otimizações: buscas sequenciais por fonte de renda dentro de cada participante,',
          'com participantes processados em lotes fixos e pausa de 1 segundo entre lotes.',
          'Demonstra como o tempo cresce em degraus conforme o volume aumenta.',
        ].join(' '),
        operationId: 'runNaiveSimulation',
        security: apiKeySecurity,
        parameters: [countParameter],
        responses: simulationResponses,
      },
    },
    '/api/simulate/optimized': {
      post: {
        tags: ['Simulate'],
        summary: 'Simulação otimizada',
        description: [
          'Executa o cálculo com pool de concorrência constante (p-limit) e Promise.all interno por participante.',
          'Sem lotes fixos nem pausas. Demonstra crescimento quase linear e suave com o volume.',
        ].join(' '),
        operationId: 'runOptimizedSimulation',
        security: apiKeySecurity,
        parameters: [countParameter],
        responses: simulationResponses,
      },
    },
    '/api/simulate/compare/stream': {
      post: {
        tags: ['Simulate'],
        summary: 'Comparação em tempo real (SSE)',
        description: [
          'Roda naive e optimized em **paralelo real** e transmite cada resultado via Server-Sent Events assim que termina.',
          'O cliente recebe três eventos em sequência: `result` (optimized, mais rápido), `result` (naive), `summary` (speedup final).',
          'Útil para feedback progressivo sem esperar os dois processos terminarem.',
          '',
          '**Formato dos eventos:**',
          '```',
          'event: result',
          'data: { "mode": "optimized", ... }',
          '',
          'event: result',
          'data: { "mode": "naive", ... }',
          '',
          'event: summary',
          'data: { "participantsCount": 100, "speedup": "9.81x", ... }',
          '```',
        ].join('\n'),
        operationId: 'compareSimulationsStream',
        security: apiKeySecurity,
        parameters: [countParameter],
        responses: {
          200: {
            description: 'Stream de eventos SSE (`text/event-stream`)',
            content: {
              'text/event-stream': {
                schema: {
                  type: 'string',
                  example: [
                    'event: result',
                    'data: {"mode":"optimized","processingTimeMs":1043,...}',
                    '',
                    'event: result',
                    'data: {"mode":"naive","processingTimeMs":8900,...}',
                    '',
                    'event: summary',
                    'data: {"participantsCount":100,"speedup":"8.53x",...}',
                  ].join('\n'),
                },
              },
            },
          },
          400: simulationResponses[400],
          401: simulationResponses[401],
          500: simulationResponses[500],
        },
      },
    },
    '/api/simulate/compare': {
      post: {
        tags: ['Simulate'],
        summary: 'Comparação naive vs otimizado',
        description: [
          'Roda as duas simulações sequencialmente com o mesmo conjunto de dados',
          'e retorna os tempos lado a lado com o speedup calculado.',
          'Os resultados numéricos (totalIncome, perCapitaIncome) são idênticos entre os modos —',
          'apenas a performance difere.',
        ].join(' '),
        operationId: 'compareSimulations',
        security: apiKeySecurity,
        parameters: [countParameter],
        responses: {
          200: {
            description: 'Comparação entre os dois modos',
            content: { 'application/json': { schema: compareResponseSchema } },
          },
          400: simulationResponses[400],
          401: simulationResponses[401],
          500: simulationResponses[500],
        },
      },
    },
  },
}
