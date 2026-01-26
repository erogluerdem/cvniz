const aiService = require('./src/services/AIService');

async function test() {
    console.log('--- Testing Generate Summary ---');
    const summary = await aiService.generateSummary('Software Engineer', 'Senior');
    console.log(JSON.stringify(summary, null, 2));

    console.log('\n--- Testing Generate Experience ---');
    const experience = await aiService.generateExperience('Product Manager');
    console.log(JSON.stringify(experience, null, 2));

    console.log('\n--- Testing Improve Text ---');
    const improvement = await aiService.improveText('I worked efficiently.');
    console.log(JSON.stringify(improvement, null, 2));
}

test();
