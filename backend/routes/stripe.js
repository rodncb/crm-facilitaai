import express from 'express';
import Stripe from 'stripe';
import StripeCustomer from '../models/StripeCustomer.js';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Inicializar Stripe (será usado quando implementar)
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Todas as rotas requerem autenticação
router.use(protect);

// @desc    Criar cliente no Stripe
// @route   POST /api/stripe/create-customer
// @access  Private/Admin
router.post('/create-customer', authorize('admin', 'user'), async (req, res, next) => {
  try {
    // TODO: Implementar integração com Stripe
    res.status(501).json({
      success: false,
      error: 'Integração Stripe ainda não implementada. Preparado para implementação futura.'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Criar payment intent
// @route   POST /api/stripe/create-payment-intent
// @access  Private/Admin
router.post('/create-payment-intent', authorize('admin', 'user'), async (req, res, next) => {
  try {
    // TODO: Implementar integração com Stripe
    res.status(501).json({
      success: false,
      error: 'Integração Stripe ainda não implementada. Preparado para implementação futura.'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Webhook do Stripe
// @route   POST /api/stripe/webhook
// @access  Public (mas verificado por assinatura Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    // TODO: Implementar webhook do Stripe
    res.status(501).json({
      success: false,
      error: 'Webhook Stripe ainda não implementado. Preparado para implementação futura.'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Buscar dados Stripe do cliente
// @route   GET /api/stripe/customer/:clienteId
// @access  Private
router.get('/customer/:clienteId', async (req, res, next) => {
  try {
    const stripeCustomer = await StripeCustomer.findOne({ clienteId: req.params.clienteId });

    if (!stripeCustomer) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não possui cadastro no Stripe'
      });
    }

    res.status(200).json({
      success: true,
      data: stripeCustomer
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Buscar transações do cliente
// @route   GET /api/stripe/transactions/:clienteId
// @access  Private
router.get('/transactions/:clienteId', async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ clienteId: req.params.clienteId })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
});

export default router;
