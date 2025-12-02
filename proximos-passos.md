# 🚀 Roadmap - Próximos Passos CRM Facilita AI + LIA

## 📋 Contexto do Projeto

**Produtos:**
- **LIA** (Bot WhatsApp com IA) - Produto principal já funcionando para Daniela Carvalho
- **CRM** - Dashboard de gerenciamento interno (precisa melhorias)

**Objetivo:** Integrar LIA com CRM, tornar multi-tenant e adicionar sistema de agenda completo.

---

## ✅ CONCLUÍDO

### 0.1 Correção de Cores nos Inputs
- ✅ Corrigido `src/index.css` - cores globais (branco em branco)
- ✅ Corrigido `src/pages/Leads.css` - inputs visíveis
- ✅ Corrigido `src/pages/Clientes.css` - inputs visíveis
- ✅ Corrigido `src/pages/Propostas.css` - inputs visíveis
- **Status:** Pronto para commit

---

## 🔥 FASE 0: Correções Críticas (1-2 dias)

### 0.2 Eliminar Scroll Múltiplo
**Problema:** 3-4 barras de rolagem aninhadas no mobile
**Solução:**
- Remover `overflow-y: auto` de `.app`, `.content`, `.content-collapsed`
- Manter scroll apenas em `.main-content`
- Usar `position: sticky` nos headers das páginas
- **Arquivos:** `src/App.jsx`, `src/App.css`, todos os `*.css` de páginas

### 0.3 Redesign ClientesAdmin
**Problema:** Layout de 2 colunas não funciona bem
**Nova estrutura:**
- Dropdown de seleção no topo (abaixo do header)
- Card colorido com info do cliente selecionado
- Kanban em largura total (3 colunas responsivas)
- **Arquivos:** `src/pages/ClientesAdmin.jsx`, `src/pages/ClientesAdmin.css`

### 0.4 Integração Backend - Propostas
**Problema:** Propostas salvam só no localStorage
**Solução:**
- Importar `propostasAPI` em `Propostas.jsx`
- Criar função `loadPropostas()` que busca do backend
- Substituir `setPropostas()` por chamadas API
- **Arquivos:** `src/pages/Propostas.jsx`

### 0.5 Integração Backend - Assinatura de Proposta
**Problema:** Assinatura salva base64 no localStorage
**Solução:**
- Upload de assinatura como arquivo de imagem
- Chamar `propostasAPI.aprovar(id, { assinaturaUrl })`
- Salvar URL da imagem no documento da proposta
- **Arquivos:** `src/pages/PropostaCliente.jsx`

---

## 📱 FASE 1: UI/UX Mobile Responsivo (2-3 dias)

### 1.1 Sidebar Mobile com Hamburger Menu
- Adicionar botão hamburger no header mobile
- Sidebar sobreposta (overlay) ao invés de fixa
- Fechar sidebar ao clicar fora ou selecionar item
- **Arquivos:** `src/components/Sidebar.jsx`, `src/components/Sidebar.css`

### 1.2 Bottom Navigation Bar (Opcional)
- Navegação inferior para mobile (4-5 itens principais)
- Ícones grandes e touch-friendly
- Indicador visual da página ativa
- **Arquivos:** `src/components/BottomNav.jsx` (novo)

### 1.3 Tabelas → Card View Mobile
- Media query para transformar tabelas em cards
- Cards empilhados verticalmente
- Todas as informações visíveis sem scroll horizontal
- **Páginas:** Leads, Clientes, Propostas, Contratos, Pagamentos

### 1.4 Formulários Fullscreen Mobile
- Modais ocupam 100% da tela no mobile
- Inputs maiores e mais espaçados (touch-friendly)
- Botões fixos no rodapé
- **Todos os modais de formulário**

### 1.5 Kanban Mobile
- Transformar 3 colunas em lista vertical no mobile
- Cada status vira um section expansível (accordion)
- Drag & drop desabilitado no mobile (usar botões)
- **Páginas:** Leads (kanban), ClientesAdmin (kanban)

---

## 🔌 FASE 2: Integrações Backend (2-3 dias)

### 2.1 Verificar Endpoints Faltantes
- Auditoria completa: todas as telas salvam no backend?
- Testar fluxo: Lead → Proposta → Cliente → Atividades
- Verificar se `leadsAPI.convert()` funciona corretamente

### 2.2 Upload de Assinatura (Imagem)
- Backend: Criar endpoint `POST /uploads/assinatura`
- Usar Multer ou similar para upload
- Armazenar em `/uploads/assinaturas/` ou S3
- Retornar URL pública da imagem

### 2.3 Webhook LIA → CRM
- Endpoint já existe: `POST /api/webhooks/lead`
- Testar integração: LIA envia lead para CRM
- CRM recebe e cria lead automaticamente
- Notificação de novo lead no dashboard

---

## 📅 FASE 3: Sistema de Agenda Completo (3-4 dias)

### 3.1 Backend - Modelo e API de Agenda
**Modelo `Agendamento`:**
```javascript
{
  clienteId: ObjectId,
  empresaId: ObjectId, // multi-tenant
  servico: String,
  dataHora: Date,
  duracao: Number, // minutos
  status: ['pendente', 'confirmado', 'cancelado', 'concluido'],
  observacoes: String,
  origem: ['manual', 'whatsapp', 'site'],
  criadoPor: ObjectId
}
```

**Modelo `DisponibilidadeAgenda`:**
```javascript
{
  empresaId: ObjectId,
  diaSemana: Number, // 0-6
  horaInicio: String, // "09:00"
  horaFim: String, // "18:00"
  intervaloMinutos: Number, // 30
  bloqueios: [{ data: Date, motivo: String }]
}
```

**Endpoints:**
- `GET /api/agendamentos` - Listar agendamentos
- `POST /api/agendamentos` - Criar agendamento
- `GET /api/agendamentos/disponiveis` - Horários disponíveis
- `PUT /api/agendamentos/:id` - Atualizar
- `DELETE /api/agendamentos/:id` - Cancelar

### 3.2 Backend - Serviços de Agenda
- Função para calcular horários disponíveis
- Validar conflitos de horário
- Enviar notificações (email/WhatsApp) de confirmação
- Webhook para LIA consultar horários

### 3.3 Frontend - Página de Agenda (Admin)
- Visualização de calendário (mensal/semanal/diária)
- Criar/editar/cancelar agendamentos
- Gerenciar disponibilidade (horários de funcionamento)
- Criar bloqueios (férias, feriados)
- **Nova página:** `src/pages/Agenda.jsx`

### 3.4 Frontend - Página Pública de Agendamento
- URL pública: `/agendamento/:empresaSlug`
- Cliente escolhe serviço e horário disponível
- Formulário simples: nome, telefone, email
- Confirmação visual após agendar
- **Nova página:** `src/pages/AgendamentoPublico.jsx`

---

## 🤖 FASE 4: Integração LIA + CRM (2-3 dias)

### 4.1 LIA Salva Leads no CRM
- LIA detecta novo contato interessado
- Envia POST para `/api/webhooks/lead` com dados
- CRM cria lead automaticamente
- Dashboard mostra notificação de novo lead

### 4.2 LIA Busca Horários do CRM
- LIA pergunta "qual dia/horário você prefere?"
- Faz GET para `/api/agendamentos/disponiveis?data=2025-12-10`
- Apresenta horários disponíveis ao cliente
- **Atualizar:** `/Users/rodrigobezerra/whatsbot/src/ai-agent-vps.js`

### 4.3 LIA Cria Agendamento no CRM
- Cliente confirma horário
- LIA envia POST para `/api/agendamentos`
- CRM salva agendamento e associa ao lead
- LIA recebe confirmação e informa cliente

### 4.4 LIA Envia Link Público do CRM
- LIA envia: "Você também pode agendar pelo site: https://crm.facilitaai.com/agendamento/daniela-sobrancelha"
- Cliente acessa página pública e agenda diretamente
- **Substituir:** link do minhaagendaapp.com.br

### 4.5 Configurar Multi-Empresa no LIA
- LIA identifica qual empresa está conversando
- Busca configurações específicas da empresa
- Usa prompt personalizado (prompts-daniela.js)
- Busca agenda da empresa correta

---

## 🏢 FASE 5: Multi-tenant (3-4 dias)

### 5.1 Backend - Modelo de Empresa
**Modelo `Empresa`:**
```javascript
{
  nome: String,
  slug: String, // "daniela-sobrancelha"
  cnpj: String,
  email: String,
  telefone: String,
  whatsapp: String,
  logo: String,
  cores: {
    primaria: String,
    secundaria: String
  },
  configuracoes: {
    servicosDisponiveis: [String],
    duracaoPadrao: Number,
    horarioFuncionamento: Object
  },
  stripeCustomerId: String,
  plano: String, // "basico", "pro", "enterprise"
  ativo: Boolean
}
```

### 5.2 Isolamento de Dados por Empresa
- Adicionar `empresaId` em TODOS os modelos
- Middleware para filtrar queries por empresa
- Verificar permissões: usuário só vê dados da sua empresa
- Admin pode ver todas as empresas

### 5.3 Sistema de Convites/Usuários por Empresa
- Adicionar campo `empresaId` no modelo `User`
- Endpoint para convidar usuários para empresa
- Roles por empresa: admin, vendedor, atendente
- Tela de gerenciamento de equipe

### 5.4 Dashboard Multi-tenant
- Seletor de empresa (se usuário tiver acesso a múltiplas)
- Estatísticas isoladas por empresa
- Filtros e relatórios por empresa

---

## 🎨 FASE 6: White Label (2-3 dias)

### 6.1 Sistema de Personalização
- Página de configurações: logo, cores, domínio
- Upload de logo da empresa
- Seletor de cores (primária/secundária)
- Preview em tempo real

### 6.2 Aplicar Branding Dinâmico
- Carregar logo e cores da empresa do banco
- CSS customizado por empresa (CSS variables)
- Remover "Facilita AI" das telas de cliente
- Login page com branding da empresa

### 6.3 Domínio Customizado (Opcional)
- Cliente pode usar `agenda.seudominio.com.br`
- Configurar CNAME no DNS
- SSL automático (Let's Encrypt)
- Verificação de domínio

### 6.4 Email Transacional Personalizado
- Templates de email com logo da empresa
- Remetente: `noreply@seudominio.com.br`
- Personalização de mensagens de confirmação

---

## 🔧 FASE 7: Melhorias e Polimento (2-3 dias)

### 7.1 Notificações em Tempo Real
- WebSocket ou Server-Sent Events
- Notificação de novo lead
- Notificação de novo agendamento
- Badge de contagem no ícone

### 7.2 Relatórios e Analytics
- Dashboard com gráficos (Chart.js/Recharts)
- Conversão de leads (funil de vendas)
- Agendamentos por período
- Receita e pagamentos

### 7.3 Exportação de Dados
- Exportar leads para CSV/Excel
- Exportar relatórios em PDF
- Backup de dados da empresa

### 7.4 Testes e QA
- Testar fluxo completo em mobile
- Testar multi-tenant (dados isolados)
- Testar integração LIA + CRM + Agenda
- Performance (lazy loading, otimizações)

### 7.5 Documentação
- README atualizado
- Guia de instalação
- Guia de uso para clientes
- API documentation (Swagger)

---

## 🚀 FASE 8: Deploy e Infraestrutura (1-2 dias)

### 8.1 Preparar Deploy de Produção
- Variáveis de ambiente (.env.production)
- Build otimizado do frontend
- Configurar CORS e segurança
- Backup automático do MongoDB

### 8.2 CI/CD
- GitHub Actions ou GitLab CI
- Deploy automático ao fazer push
- Testes automáticos antes do deploy

### 8.3 Monitoramento
- Logs centralizados (PM2 logs)
- Alertas de erro (Sentry opcional)
- Uptime monitoring
- Backup diário do banco

---

## 📊 Estimativa Total de Tempo

| Fase | Descrição | Tempo Estimado |
|------|-----------|----------------|
| 0 | Correções Críticas | 1-2 dias |
| 1 | UI/UX Mobile | 2-3 dias |
| 2 | Integrações Backend | 2-3 dias |
| 3 | Sistema de Agenda | 3-4 dias |
| 4 | Integração LIA + CRM | 2-3 dias |
| 5 | Multi-tenant | 3-4 dias |
| 6 | White Label | 2-3 dias |
| 7 | Melhorias e Polimento | 2-3 dias |
| 8 | Deploy e Infra | 1-2 dias |
| **TOTAL** | | **18-27 dias** |

---

## 🎯 Prioridades Imediatas (Pós-Almoço)

1. ✅ **Commitar correção de cores** (já feito)
2. 🔄 **Eliminar scroll múltiplo** (crítico para mobile)
3. 🔄 **Redesign ClientesAdmin** (dropdown + kanban)
4. 🔄 **Propostas salvar no backend** (completar fluxo)
5. 🔄 **Assinatura salvar no backend** (completar fluxo)

---

## 📝 Notas Importantes

- **LIA-Daniela** está funcionando perfeitamente, não mexer
- **Multi-tenant** é essencial para escalar o produto
- **Mobile-first** é prioridade (maioria dos clientes usa celular)
- **White-label** diferencia o produto no mercado
- **Agenda** é o coração da integração LIA + CRM

---

## 🤝 Próximos Passos Hoje

1. Commitar as correções de cores
2. Deploy das correções
3. Continuar após almoço/amanhã com FASE 0 restante

---

**Última atualização:** 2025-12-02
