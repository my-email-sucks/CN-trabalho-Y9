# Atlas de Hábitos - Interactive Health Visualization

Uma aplicação web interativa que visualiza como os hábitos de vida afetam os órgãos humanos e métricas de saúde em tempo real.

## 🎯 Funcionalidades Principais

### Sistema de Sliders Avançado
- **17 hábitos categorizados** (9 prejudiciais, 8 benéficos)
- **Calibração realista** baseada no impacto real na saúde
- **Efeitos visuais dramáticos** para hábitos de alto impacto (álcool, drogas, tabaco, pornografia)
- **Conexões específicas órgão-hábito** com feedback visual imediato

### Métricas de Saúde Abrangentes
- **Saúde Geral** e **Felicidade** (medidores principais)
- **Qualidade de Vida** e **Saúde Mental**
- **Esperança de Vida** e **Risco de Doença**
- **Forma Física** e **Bem-estar Geral**
- **8 métricas detalhadas**: Tensão cardíaca, inflamação, qualidade do sono, carga de stress, capacidade de recuperação, função cognitiva, sistema imunitário, saúde metabólica

### Mapa Corporal 3D Interativo
- **7 órgãos clicáveis**: Pulmões, coração, cérebro, fígado, rins, intestino, pele
- **Visualização em tempo real** com mudanças de cor e opacidade
- **Animações suaves** e feedback visual responsivo
- **Design anatómico limpo** e profissional

### Sistema de Órgãos Interativo
- **Informação contextual personalizada** baseada nos hábitos atuais
- **Conselhos específicos** para cada órgão
- **Análise de impacto** dos hábitos individuais
- **Recomendações de recuperação** adaptadas ao perfil do utilizador

### Perfil de Utilizador Inteligente
- **Resumo de saúde em tempo real** com categorização automática
- **Equilíbrio de hábitos** com contadores visuais
- **Recomendações prioritárias** baseadas no perfil atual
- **Métricas principais** com código de cores intuitivo

## 🛠️ Tecnologias Utilizadas

- **React 18** + **TypeScript** + **Vite**
- **Zustand** para gestão de estado
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **html2canvas** para exportação PNG
- **SVG inline** para o mapa corporal

## 🚀 Instalação e Configuração

```bash
# Clonar o repositório
git clone [repository-url]
cd atlas-de-habitos

# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Pré-visualizar build de produção
npm run preview
```

## 📊 Estrutura de Dados

### Hábitos (habits.json)
```json
{
  "id": "smoking",
  "name": "Tabagismo",
  "kind": "bad",
  "category": "Substâncias",
  "intensity": {
    "min": 0,
    "max": 3,
    "labels": ["Nunca", "Ocasional", "Diário", "Intenso"]
  },
  "affects": ["lungs", "heart", "brain", "skin"],
  "mechanisms": [
    {
      "organ": "lungs",
      "tags": ["tar", "cilia_damage", "inflammation"],
      "weight": 0.40
    }
  ],
  "pairs": [
    {"with": "sedentary", "multiplier": 1.15}
  ]
}
```

### Órgãos (organs.json)
```json
{
  "id": "lungs",
  "name": "Pulmões",
  "system": "Respiratório",
  "svgId": "organ-lungs",
  "weight": 0.18,
  "metrics": ["oxygen_uptake", "cilia_health", "inflammation"],
  "narration": {
    "what_happens": "Descrição dos efeitos negativos...",
    "what_helps": "Descrição das estratégias de recuperação..."
  }
}
```

## 🧮 Lógica de Cálculo

### Mapeamento de Intensidade
- **Nível 0**: Sem impacto (0)
- **Nível 1**: Impacto ligeiro (0.5)
- **Nível 2**: Impacto moderado (0.8)
- **Nível 3**: Impacto máximo (1.0)

### Multiplicadores de Impacto
- **Hábitos de alto impacto**: 1.5x (tabaco, álcool, drogas, pornografia)
- **Hábitos padrão**: 1.0x
- **Hábitos benéficos**: 0.8x (para evitar sobrecompensação)

### Cálculo de Saúde dos Órgãos
```typescript
organHealth = 100 - Σ(mechanism.weight × intensityScalar × impact × multiplier)
```

### Métricas Globais
- **Saúde Geral**: Média ponderada da saúde de todos os órgãos
- **Felicidade**: Baseada em conexão social, exercício e stress
- **Esperança de Vida**: 78 anos base ± impactos dos hábitos
- **Risco de Doença**: Acumulação de fatores de risco

## ♿ Acessibilidade

- **Navegação por teclado** completa
- **Suporte para leitores de ecrã** com ARIA labels
- **Modo de alto contraste** para utilizadores com deficiência visual
- **Redução de movimento** para utilizadores sensíveis a animações
- **Conformidade WCAG AA**

## 📱 Design Responsivo

- **Layout adaptativo** para desktop, tablet e mobile
- **Breakpoints otimizados** para diferentes tamanhos de ecrã
- **Interações touch-friendly** para dispositivos móveis
- **Performance otimizada** com lazy loading e memoização

## 🎨 Características de Design

- **Paleta de cores médica** com tons suaves e profissionais
- **Tipografia hierárquica** com 3 pesos máximos
- **Sistema de espaçamento 8px** consistente
- **Animações micro-interativas** para feedback do utilizador
- **Estados hover e focus** bem definidos

## 📈 Funcionalidades Avançadas

### Modo de Comparação
- **Antes/Depois** para visualizar mudanças
- **Alternância visual** entre estados
- **Métricas comparativas** lado a lado

### Exportação
- **Captura PNG** de alta qualidade
- **Resolução 2x** para clareza
- **Nome de ficheiro automático** com data

### Perfil Personalizado
- **Análise em tempo real** dos hábitos
- **Recomendações inteligentes** baseadas no perfil
- **Categorização automática** do estado de saúde

## 🔬 Base Científica

A aplicação baseia-se em evidências científicas sobre:
- **Impactos fisiológicos** dos diferentes hábitos
- **Mecanismos biológicos** de dano e recuperação
- **Fatores de risco** para doenças crónicas
- **Benefícios comprovados** de hábitos saudáveis

## ⚠️ Disclaimer

Esta aplicação destina-se **apenas a fins educativos** e não substitui aconselhamento médico profissional. Consulte sempre um profissional de saúde qualificado para orientação personalizada.

## 🤝 Contribuições

Contribuições são bem-vindas! Por favor:
1. Fork o projeto
2. Crie uma branch para a sua funcionalidade
3. Commit as suas alterações
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o ficheiro [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- Dados baseados em literatura científica sobre saúde pública
- Design inspirado em aplicações médicas profissionais
- Ícones fornecidos pela biblioteca Lucide React
- Comunidade React e TypeScript pelo suporte contínuo