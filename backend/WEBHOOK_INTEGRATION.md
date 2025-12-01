# 🔗 Integração de Formulários - FacilitaAI CRM

## Webhook para Captura de Leads

Este documento explica como integrar os formulários do site **facilitaai.com.br** com o CRM para captura automática de leads.

---

## 📡 Endpoint do Webhook

**URL:** `https://api.facilitaai.com.br/api/webhooks/lead`  
**Método:** `POST`  
**Autenticação:** Não requerida (endpoint público)  
**Content-Type:** `application/json`

---

## 📋 Formato dos Dados

### Request Body

```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "(11) 98765-4321",
  "empresa": "Empresa XYZ",
  "cargo": "Gerente",
  "origem": "lia",
  "mensagem": "Gostaria de saber mais sobre o CRM"
}
```

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `nome` | string | ✅ Sim | Nome completo do lead |
| `email` | string | ✅ Sim | Email válido |
| `telefone` | string | ✅ Sim | Telefone com DDD |
| `empresa` | string | ❌ Não | Nome da empresa |
| `cargo` | string | ❌ Não | Cargo/função |
| `origem` | string | ❌ Não | Origem do lead: `lia`, `crm`, `software`, `website`, `outro` |
| `mensagem` | string | ❌ Não | Mensagem/interesse do lead |

### Response Success (201)

```json
{
  "success": true,
  "message": "Lead recebido com sucesso! Entraremos em contato em breve.",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "nome": "João Silva",
    "email": "joao@example.com"
  }
}
```

### Response Error (400)

```json
{
  "success": false,
  "error": "Nome, email e telefone são obrigatórios"
}
```

---

## 💻 Exemplos de Integração

### JavaScript Vanilla

```javascript
// No formulário do site facilitaai.com.br
const form = document.getElementById('contact-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    telefone: document.getElementById('telefone').value,
    empresa: document.getElementById('empresa').value,
    origem: 'lia', // ou 'crm', 'software'
    mensagem: document.getElementById('mensagem').value
  };

  try {
    const response = await fetch('https://api.facilitaai.com.br/api/webhooks/lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
      // Mostrar mensagem de sucesso
      alert('Obrigado! Entraremos em contato em breve.');
      form.reset();
    } else {
      // Mostrar erro
      alert(result.error);
    }
  } catch (error) {
    console.error('Erro ao enviar formulário:', error);
    alert('Erro ao enviar. Tente novamente.');
  }
});
```

### jQuery

```javascript
$('#contact-form').on('submit', function(e) {
  e.preventDefault();
  
  const formData = {
    nome: $('#nome').val(),
    email: $('#email').val(),
    telefone: $('#telefone').val(),
    empresa: $('#empresa').val(),
    origem: 'crm',
    mensagem: $('#mensagem').val()
  };

  $.ajax({
    url: 'https://api.facilitaai.com.br/api/webhooks/lead',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(formData),
    success: function(response) {
      alert('Obrigado! Entraremos em contato em breve.');
      $('#contact-form')[0].reset();
    },
    error: function(xhr) {
      const error = xhr.responseJSON?.error || 'Erro ao enviar';
      alert(error);
    }
  });
});
```

### React

```javascript
import { webhookAPI } from './services/api';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    mensagem: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await webhookAPI.sendLead({
        ...formData,
        origem: 'software'
      });

      if (response.success) {
        alert('Obrigado! Entraremos em contato em breve.');
        setFormData({ nome: '', email: '', telefone: '', empresa: '', mensagem: '' });
      }
    } catch (error) {
      alert('Erro ao enviar. Tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* inputs do formulário */}
    </form>
  );
};
```

---

## 🔒 Segurança

### Proteção contra Spam

O endpoint possui proteção básica contra spam:
- Validação de formato de email
- Limite de requisições por IP (rate limiting - futuro)
- Verificação de campos obrigatórios

### CORS

O endpoint aceita requisições de qualquer origem (CORS habilitado) para facilitar integração.

---

## 📊 O que acontece após o envio?

1. **Lead criado automaticamente** no CRM
2. **Status inicial:** "novo"
3. **Notificação** enviada para admin (futuro)
4. **Email de confirmação** para o lead (futuro)
5. **Lead aparece** no dashboard do CRM imediatamente

---

## 🧪 Testando o Webhook

### cURL

```bash
curl -X POST https://api.facilitaai.com.br/api/webhooks/lead \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Lead",
    "email": "teste@example.com",
    "telefone": "(11) 99999-9999",
    "origem": "lia",
    "mensagem": "Teste de integração"
  }'
```

### Postman

1. Criar nova requisição POST
2. URL: `https://api.facilitaai.com.br/api/webhooks/lead`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "nome": "Teste Lead",
  "email": "teste@example.com",
  "telefone": "(11) 99999-9999",
  "origem": "crm",
  "mensagem": "Teste via Postman"
}
```

---

## 📝 Notas Importantes

1. **Email duplicado:** Se o email já existir no CRM, retornará erro 400
2. **Origem padrão:** Se não informar origem, será `website`
3. **Validação:** Campos obrigatórios são validados no backend
4. **Timeout:** Aguarde até 5 segundos para resposta
5. **Retry:** Em caso de erro 500, tente novamente após alguns segundos

---

## 🚀 Próximas Melhorias

- [ ] Notificação por email para admin
- [ ] Email de confirmação automático para lead
- [ ] Integração com WhatsApp (enviar mensagem automática)
- [ ] Webhook de resposta (callback URL)
- [ ] Analytics de conversão por origem

---

## 📞 Suporte

Em caso de dúvidas ou problemas:
- Email: suporte@facilitaai.com.br
- WhatsApp: (11) 99999-9999

---

**Última atualização:** 18/11/2024
