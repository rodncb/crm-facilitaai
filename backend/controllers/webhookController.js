import Lead from '../models/Lead.js';

// @desc    Receber lead do formulário do site (público)
// @route   POST /api/webhooks/lead
// @access  Public
export const receiveLeadFromWebsite = async (req, res, next) => {
    try {
        const { nome, email, telefone, empresa, origem, mensagem, cargo } = req.body;

        // Validação básica
        if (!nome || !email || !telefone) {
            return res.status(400).json({
                success: false,
                error: 'Nome, email e telefone são obrigatórios'
            });
        }

        // Validar origem
        const origensValidas = ['lia', 'crm', 'software', 'website', 'outro'];
        const origemFinal = origensValidas.includes(origem) ? origem : 'website';

        // Criar lead automaticamente
        // Como é público, não temos usuário logado
        const lead = await Lead.create({
            nome,
            email,
            telefone,
            empresa: empresa || '',
            cargo: cargo || '',
            origem: origemFinal,
            interesse: mensagem || '',
            observacoes: `Lead capturado automaticamente do site facilitaai.com.br via formulário ${origemFinal}`,
            status: 'novo',
            criadoPor: null, // Público - sem usuário
            responsavel: null // Será atribuído depois
        });

        // TODO: Enviar notificação por email para admin
        // TODO: Enviar confirmação para o lead

        res.status(201).json({
            success: true,
            message: 'Lead recebido com sucesso! Entraremos em contato em breve.',
            data: {
                id: lead._id,
                nome: lead.nome,
                email: lead.email
            }
        });
    } catch (error) {
        // Se for erro de duplicação de email
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Este email já está cadastrado em nosso sistema'
            });
        }

        next(error);
    }
};

// @desc    Receber mensagem do WhatsApp (futuro)
// @route   POST /api/webhooks/whatsapp
// @access  Public (com validação de assinatura)
export const receiveWhatsAppMessage = async (req, res, next) => {
    try {
        // TODO: Implementar integração com WhatsBot
        res.status(501).json({
            success: false,
            error: 'Integração WhatsApp ainda não implementada. Em breve!'
        });
    } catch (error) {
        next(error);
    }
};
