const ABTest = require('../models/ABTest');
const crypto = require('crypto');

class ABTestService {

    // Get assigned variant for a user (deterministic if userId provided)
    async getVariant(key, userId = null) {
        const test = await ABTest.findOne({ key, status: 'active' });

        if (!test) {return null;}

        // If no user tracking, simple random
        let variantIndex = 0;

        if (userId) {
            // Deterministic hash assignment
            const hash = crypto.createHash('md5').update(`${key}:${userId}`).digest('hex');
            const intVal = parseInt(hash.substring(0, 8), 16);
            const roll = intVal % 100; // 0-99

            // Logic based on allocation (assuming simple split for now or stored allocation)
            // For now, assuming equal split logic or weighted
            // Let's implement weighted based on trafficAllocation

            let cumulative = 0;
            for (let i = 0; i < test.variants.length; i++) {
                cumulative += test.variants[i].trafficAllocation;
                if (roll < cumulative) {
                    variantIndex = i;
                    break;
                }
            }
        } else {
            // Random assignment based on weights
            const roll = Math.random() * 100;
            let cumulative = 0;
            for (let i = 0; i < test.variants.length; i++) {
                cumulative += test.variants[i].trafficAllocation;
                if (roll < cumulative) {
                    variantIndex = i;
                    break;
                }
            }
        }

        const selectedVariant = test.variants[variantIndex];

        // Async update view count (fire and forget usually, but here we await)
        // Ideally we track unique views, but for simplicity we increment views
        await ABTest.updateOne(
            { _id: test._id, 'variants._id': selectedVariant._id },
            { $inc: { 'variants.$.views': 1 } }
        );

        return {
            name: selectedVariant.name,
            value: selectedVariant.value,
            testId: test._id,
            variantId: selectedVariant._id
        };
    }

    async trackConversion(key, variantName) {
        const test = await ABTest.findOne({ key });
        if (!test) {return false;}

        // Find the variant by name or ID
        const variantMatch = test.variants.find(v => v.name === variantName);

        if (variantMatch) {
            await ABTest.updateOne(
                { _id: test._id, 'variants._id': variantMatch._id },
                { $inc: { 'variants.$.conversions': 1 } }
            );
            return true;
        }
        return false;
    }

    // Admin Methods
    async createTest(data) {
        return await ABTest.create(data);
    }

    async getAllTests() {
        return await ABTest.find().sort({ createdAt: -1 });
    }

    async updateTest(id, data) {
        return await ABTest.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteTest(id) {
        return await ABTest.findByIdAndDelete(id);
    }

    async getStats(id) {
        return await ABTest.findById(id);
    }
}

module.exports = new ABTestService();
