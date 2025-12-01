#!/bin/bash

echo "🚀 Configurando Backend CRM FacilitaAI..."
echo ""

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cat > .env << 'EOF'
# Server Configuration
NODE_ENV=development
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/crm_facilitaai

# JWT Configuration
JWT_SECRET=crm_facilitaai_super_secret_key_change_in_production_2024
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Stripe Configuration (para implementação futura)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
EOF
    echo "✅ Arquivo .env criado!"
else
    echo "✅ Arquivo .env já existe!"
fi

echo ""
echo "🔍 Verificando MongoDB..."

# Verificar se MongoDB está rodando
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB está rodando!"
else
    echo "⚠️  MongoDB não está rodando."
    echo "   Para iniciar o MongoDB, execute:"
    echo "   brew services start mongodb-community"
    echo "   ou"
    echo "   mongod --config /usr/local/etc/mongod.conf"
fi

echo ""
echo "✅ Setup completo!"
echo ""
echo "Para iniciar o servidor em modo desenvolvimento:"
echo "  npm run dev"
echo ""
echo "Para iniciar em modo produção:"
echo "  npm start"
echo ""
