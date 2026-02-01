const mongoose = require('mongoose');
const { premiumPlanSchema, subscriptionSchema } = require('../services/PremiumService');

module.exports = {
    PremiumPlan: mongoose.model('PremiumPlan', premiumPlanSchema),
    Subscription: mongoose.model('Subscription', subscriptionSchema)
};
