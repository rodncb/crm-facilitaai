import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaRocket, FaChartLine, FaRobot, FaCheckCircle, FaTasks, FaBell, FaWhatsapp } from 'react-icons/fa';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showWaitlist, setShowWaitlist] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        empresa: '',
        telefone: '',
        planoInteresse: 'free'
    });
    const [submitted, setSubmitted] = useState(false);
    const [position, setPosition] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('create-account') === 'true') {
            setShowWaitlist(true);
        }
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/waitlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setPosition(data.data.posicao);
                setSubmitted(true);
            }
        } catch (error) {
            
            alert('Erro ao cadastrar. Tente novamente.');
        }
    };

    return (
        <div className="landing-page">
            {/* Header */}
            <header className="landing-header">
                <div className="container">
                    <div className="logo">
                        <img
                            src={`${import.meta.env.BASE_URL}images/logo.png`}
                            alt="FacilitaAI"
                            className="logo-img"
                        />
                        <span className="logo-text">
                            <span className="facilita">Facilita</span>
                            <span className="ai">AI</span>
                            <span className="crm">CRM</span>
                        </span>
                    </div>
                    <nav>
                        <Link to="/login" className="btn-login">Entrar</Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="animated-background">
                    <div className="gradient-overlay"></div>
                    <div className="floating-shapes">
                        <div className="shape shape-1"></div>
                        <div className="shape shape-2"></div>
                        <div className="shape shape-3"></div>
                    </div>
                </div>

                <div className="container hero-content">
                    <div className="hero-text">
                        <span className="badge"><FaRocket /> Em Breve</span>
                        <h1>
                            CRM com <span className="gradient-text">Inteligência Artificial</span>
                            <br />
                            que Facilita seu Dia a Dia
                        </h1>
                        <p className="hero-description">
                            Gerencie leads, clientes e vendas com automação inteligente via WhatsApp.
                            Dashboard completo, tarefas automáticas e IA que trabalha por você.
                        </p>
                        <div className="hero-buttons">
                            <button className="btn-primary" onClick={() => setShowWaitlist(true)}>
                                Entrar na Lista de Espera
                            </button>
                            <a href="#features" className="btn-secondary">
                                Ver Funcionalidades
                            </a>
                        </div>
                        <div className="hero-stats">
                            <div className="stat">
                                <div className="stat-number">100+</div>
                                <div className="stat-label">Pessoas na fila</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">24/7</div>
                                <div className="stat-label">Automação ativa</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">3x</div>
                                <div className="stat-label">Mais produtividade</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features">
                <div className="container">
                    <h2 className="section-title">Funcionalidades Poderosas</h2>
                    <p className="section-subtitle">Tudo que você precisa para vender mais</p>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon"><FaChartLine /></div>
                            <h3>Dashboard Inteligente</h3>
                            <p>Visualize métricas em tempo real, taxa de conversão e performance de vendas</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon"><FaRobot /></div>
                            <h3>LIA WhatsApp com IA</h3>
                            <p>Automação de follow-up, qualificação de leads e respostas inteligentes 24/7</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon"><FaCheckCircle /></div>
                            <h3>Gestão de Tarefas</h3>
                            <p>Organize tarefas por cliente, prioridade e prazo. Nunca mais esqueça um follow-up</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon"><FaChartLine /></div>
                            <h3>Pipeline de Vendas</h3>
                            <p>Kanban visual para acompanhar leads em cada etapa do funil</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon"><FaBell /></div>
                            <h3>Notificações Automáticas</h3>
                            <p>Receba alertas de leads quentes, tarefas pendentes e oportunidades</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon"><FaWhatsapp /></div>
                            <h3>Integração WhatsApp</h3>
                            <p>Leads do WhatsApp viram clientes automaticamente no CRM</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="pricing">
                <div className="container">
                    <h2 className="section-title">Planos para Cada Necessidade</h2>
                    <p className="section-subtitle">Comece grátis e escale conforme cresce</p>

                    <div className="pricing-grid">
                        <div className="pricing-card">
                            <div className="plan-name">FREE</div>
                            <div className="plan-price">
                                <span className="currency">R$</span>
                                <span className="amount">0</span>
                                <span className="period">/mês</span>
                            </div>
                            <ul className="plan-features">
                                <li>✅ Até 100 leads</li>
                                <li>✅ 1 usuário</li>
                                <li>✅ Dashboard básico</li>
                                <li>✅ Gestão de tarefas</li>
                                <li>❌ Sem bot WhatsApp</li>
                                <li>❌ Sem IA</li>
                            </ul>
                            <button className="btn-plan" onClick={() => setShowWaitlist(true)}>
                                Começar Grátis
                            </button>
                        </div>

                        <div className="pricing-card">
                            <div className="plan-name">STARTER</div>
                            <div className="plan-price">
                                <span className="currency">R$</span>
                                <span className="amount">49</span>
                                <span className="period">/mês</span>
                            </div>
                            <ul className="plan-features">
                                <li>✅ Até 500 leads</li>
                                <li>✅ 3 usuários</li>
                                <li>✅ Dashboard completo</li>
                                <li>✅ Webhook de leads</li>
                                <li>❌ Sem bot WhatsApp</li>
                                <li>❌ Sem IA</li>
                            </ul>
                            <button className="btn-plan" onClick={() => setShowWaitlist(true)}>
                                Entrar na Lista
                            </button>
                        </div>

                        <div className="pricing-card featured">
                            <div className="badge-popular">Mais Popular</div>
                            <div className="plan-name">PRO</div>
                            <div className="plan-price">
                                <span className="currency">R$</span>
                                <span className="amount">149</span>
                                <span className="period">/mês</span>
                            </div>
                            <ul className="plan-features">
                                <li>✅ Leads ilimitados</li>
                                <li>✅ Usuários ilimitados</li>
                                <li>✅ LIA WhatsApp (Lead Inteligente Automatizado)</li>
                                <li>✅ IA com fallback</li>
                                <li>✅ Automações</li>
                                <li>✅ Suporte prioritário</li>
                            </ul>
                            <button className="btn-plan primary" onClick={() => setShowWaitlist(true)}>
                                Quero Este!
                            </button>
                        </div>

                        <div className="pricing-card">
                            <div className="plan-name">COMBO</div>
                            <div className="plan-price">
                                <span className="currency">R$</span>
                                <span className="amount">199</span>
                                <span className="period">/mês</span>
                            </div>
                            <ul className="plan-features">
                                <li>✅ Tudo do PRO</li>
                                <li>✅ LIA (geral)</li>
                                <li>✅ 2 números WhatsApp</li>
                                <li>✅ IA em ambos</li>
                                <li>✅ Economia de R$ 99</li>
                                <li>✅ Suporte VIP</li>
                            </ul>
                            <button className="btn-plan" onClick={() => setShowWaitlist(true)}>
                                Entrar na Lista
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <h2>Pronto para Transformar suas Vendas?</h2>
                    <p>Entre na lista de espera e seja um dos primeiros a usar!</p>
                    <button className="btn-primary large" onClick={() => setShowWaitlist(true)}>
                        Garantir Minha Vaga
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <p>&copy; 2024 FacilitaAI. Todos os direitos reservados.</p>
                    <div className="footer-links">
                        <a href="https://facilitaai.com.br">FacilitaAI</a>
                        <a href="#privacy">Privacidade</a>
                        <a href="#terms">Termos</a>
                    </div>
                </div>
            </footer>

            {/* Waitlist Modal */}
            {showWaitlist && (
                <div className="modal-overlay" onClick={() => setShowWaitlist(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {!submitted ? (
                            <>
                                <h2>Entrar na Lista de Espera</h2>
                                <p>Preencha os dados abaixo e garanta sua vaga!</p>

                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        placeholder="Nome completo"
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Empresa"
                                        value={formData.empresa}
                                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Telefone (WhatsApp)"
                                        value={formData.telefone}
                                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                        required
                                    />
                                    <select
                                        value={formData.planoInteresse}
                                        onChange={(e) => setFormData({ ...formData, planoInteresse: e.target.value })}
                                    >
                                        <option value="free">FREE - Grátis</option>
                                        <option value="starter">STARTER - R$ 49/mês</option>
                                        <option value="pro">PRO - R$ 149/mês</option>
                                        <option value="combo">COMBO - R$ 199/mês</option>
                                    </select>

                                    <button type="submit" className="btn-submit">
                                        Garantir Minha Vaga
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="success-message">
                                <div className="success-icon">🎉</div>
                                <h2>Você está na Lista!</h2>
                                <div className="position-badge">
                                    Posição #{position}
                                </div>
                                <p>Te avisaremos por email quando liberarmos o acesso!</p>
                                <button className="btn-close" onClick={() => setShowWaitlist(false)}>
                                    Fechar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
