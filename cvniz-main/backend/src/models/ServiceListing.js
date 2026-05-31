const mongoose = require('mongoose');
const { serviceListingSchema, marketplaceOrderSchema } = require('../services/MarketplaceService');

module.exports = {
    ServiceListing: mongoose.model('ServiceListing', serviceListingSchema),
    MarketplaceOrder: mongoose.model('MarketplaceOrder', marketplaceOrderSchema)
};
