# Phase 2 Step 2: Job Recommendations Engine

## Overview
Intelligent job recommendation system using ML-based matching algorithm. Provides personalized job suggestions based on user's CV, experience, skills, and preferences.

## Architecture

### Backend Services

#### RecommendationService.js
Main recommendation engine with ML matching algorithm.

**Key Methods:**

1. **calculateMatchScore(cvData, job)**
   - Returns 0-100 match percentage
   - Factors:
     - 40% Skills matching (Levenshtein distance algorithm)
     - 20% Experience level compatibility
     - 15% Location preference
     - 15% Salary alignment
     - 10% Job type preference

2. **getRecommendations(userId, limit, filters)**
   - Returns top N personalized job suggestions
   - Filters: experienceLevel, location, locationType, jobType, minSalary
   - Caches results for 1 hour (Redis)
   - Includes match scores and explanations

3. **getTrendingJobs(skills, limit)**
   - Returns most popular jobs by application/view count
   - Can filter by specific skills
   - Great for market research

4. **getSalaryPrediction(jobTitle, experienceLevel, location)**
   - Estimates salary ranges
   - Based on historical job data
   - Returns min/max/average/percentiles

5. **recordJobInteraction(userId, jobId, type)**
   - Tracks user actions: view, apply, save, dismiss, click
   - Used for analytics and improving recommendations
   - Updates job application/view counts

6. **getMatchedSkills(cvSkills, jobSkills)**
   - Identifies matching skills
   - Returns matched, missing, and completion percentage

7. **getLearningPath(missingSkills)**
   - Recommends courses for skill gaps
   - Returns learning resources and estimated time

8. **getSkillRecommendations(currentSkills, targetRole)**
   - Suggests trending skills for target role
   - Identifies priority skills to learn

### API Endpoints

```
GET  /api/recommendations/jobs
     Query: limit, experienceLevel, location, locationType, jobType, minSalary
     Response: { jobs: [], total, matchScores }

GET  /api/recommendations/trending
     Query: skills (comma-separated), limit
     Response: { jobs: [], total, viewCounts }

GET  /api/recommendations/salary
     Query: jobTitle, experienceLevel, location
     Response: { min, max, average, percentiles }

POST /api/recommendations/match
     Body: { jobId }
     Response: { matchScore, matchedSkills, reasons }

POST /api/recommendations/interact
     Body: { jobId, type, duration? }
     Response: { success, message }

GET  /api/recommendations/saved
     Response: { jobs: [], total }
```

### Frontend Components

#### JobRecommendationsFeed.jsx
Main UI component with tabbed interface (1,400+ lines)

**Features:**
- Two tabs: Recommended & Trending
- Advanced filtering (experience, location, salary)
- Match score visualization (0-100%)
- Infinite scroll support
- Save/unsave jobs
- Share job listings
- Required skills display
- Application/view counts
- Responsive design

#### useRecommendations.js
React custom hook for all recommendation operations

**Methods:**
- getRecommendations(filters)
- getTrendingJobs(skills, limit)
- getSalaryPrediction(jobTitle, experienceLevel, location)
- getJobMatch(jobId)
- recordInteraction(jobId, type)
- saveJob(jobId)
- unsaveJob(jobId)
- getSavedJobs()

### Data Models

#### JobInteraction.js
Tracks user interactions with job postings

```javascript
{
  userId: ObjectId (indexed),
  jobId: ObjectId (indexed),
  type: enum ['view', 'apply', 'save', 'dismiss', 'click'],
  duration: Number (milliseconds),
  timestamp: Date (indexed)
}
```

**Indexes:**
- Compound: userId + timestamp (fast user history queries)
- Compound: jobId + type (job analytics)

## Algorithm Details

### ML Matching Algorithm

```
FUNCTION calculateMatchScore(cv, job):
    score = 0
    
    // 1. Skills Match (40%)
    matchedSkills = 0
    FOR each skill IN job.skills:
        IF skillSimilarity(cv.skills, skill) > 0.7:
            matchedSkills++
    skillsScore = (matchedSkills / job.skills.length) * 100
    score += (skillsScore * 0.40)
    
    // 2. Experience Level (20%)
    IF cv.experience.level == job.level:
        score += 20
    ELSE IF isCompatible(cv.experience.level, job.level):
        score += 14  // 70% weight for compatibility
    
    // 3. Location (15%)
    IF job.locationType == 'remote':
        score += 15
    ELSE IF cv.location == job.location:
        score += 15
    ELSE IF distance(cv.location, job.location) < 50km:
        score += 7.5  // 50% weight for nearby
    
    // 4. Salary Alignment (15%)
    IF job.salary WITHIN cv.expectedSalary ± 20%:
        score += 15
    ELSE IF difference < 40%:
        score += 7.5  // 50% weight
    
    // 5. Job Type (10%)
    IF cv.jobType == job.jobType:
        score += 10
    
    RETURN MIN(score, 100)  // Cap at 100%
END
```

### Skill Similarity Algorithm
Uses Levenshtein distance for fuzzy matching:

```
FUNCTION skillSimilarity(skill1, skill2):
    distance = levenshteinDistance(skill1, skill2)
    maxLength = max(length(skill1), length(skill2))
    similarity = 1 - (distance / maxLength)
    RETURN similarity
END
```

## Integration Points

### With AI Features
- CV Analysis uses recommendation engine
- Interview prep suggests common skills needed
- Skill gap analysis works with recommendations

### With Analytics Service
- Track job interactions (view, apply, save)
- Calculate engagement metrics
- Monitor recommendation quality

### With Cache Service (Redis)
- Cache recommendations for 1 hour
- Cache salary predictions for 24 hours
- Invalidate on user interactions

### With Email Service
- Daily recommendation digest
- New job matching alerts
- Trending jobs newsletter

## Performance Optimization

1. **Caching Strategy**
   - Recommendations cached for 1 hour
   - Trending jobs cached for 6 hours
   - Salary predictions cached for 24 hours

2. **Database Indexes**
   - Compound index on userId + timestamp
   - Index on jobId + type
   - Index on job skills for fast matching

3. **Lazy Loading**
   - Infinite scroll for job listings
   - Trending jobs loaded on-demand
   - Match scores calculated on-request

4. **Batch Operations**
   - Process multiple interactions in batches
   - Cache invalidation in background

## Testing

### Unit Tests
```javascript
// Test calculateMatchScore
test('should return 100% for perfect match');
test('should return 0% for no common skills');
test('should handle missing CV data gracefully');

// Test skillSimilarity
test('should recognize similar skills');
test('should handle typos with threshold');

// Test API endpoints
test('GET /api/recommendations/jobs returns paginated results');
test('POST /api/recommendations/interact records user action');
```

### Integration Tests
```javascript
test('Complete workflow: Get recommendations -> Select job -> Record interaction');
test('Salary prediction with different experience levels');
test('Trending jobs update when users interact');
```

## Usage Examples

### Backend
```javascript
const RecommendationService = require('./services/RecommendationService');

// Get recommendations
const recs = await RecommendationService.getRecommendations(userId, 10);

// Calculate match
const matchScore = await RecommendationService.calculateMatchScore(cvData, job);

// Record interaction
await RecommendationService.recordJobInteraction(userId, jobId, 'apply');
```

### Frontend
```javascript
import { useRecommendations } from './hooks/useRecommendations';
import JobRecommendationsFeed from './components/JobRecommendationsFeed';

function App() {
    const { getRecommendations, loading } = useRecommendations();

    useEffect(() => {
        getRecommendations({ experienceLevel: 'senior' });
    }, []);

    return <JobRecommendationsFeed userId={userId} />;
}
```

## Configuration

### Environment Variables
```
REDIS_HOST=redis://localhost:6379
CACHE_DURATION_RECOMMENDATIONS=3600  # 1 hour
CACHE_DURATION_SALARY=86400          # 24 hours
MAX_RECOMMENDATIONS=50
MIN_MATCH_SCORE_THRESHOLD=30
```

### Feature Flags
- `ENABLE_ML_RECOMMENDATIONS` - Use ML scoring (default: true)
- `ENABLE_SALARY_PREDICTIONS` - Show predicted salaries (default: true)
- `ENABLE_SKILL_LEARNING_PATH` - Show learning resources (default: true)

## Future Enhancements

### Phase 2 Step 3
1. **Advanced Monitoring**
   - Track recommendation quality metrics
   - A/B test different algorithms
   - User feedback integration

2. **Personalization**
   - User preference learning
   - Interaction history analysis
   - Behavioral targeting

3. **Real-time Updates**
   - WebSocket for new job notifications
   - Push notifications for matching jobs
   - Live trending updates

### Phase 2 Step 4+
1. **ML Model Training**
   - Use interaction data to train models
   - Improve matching accuracy over time
   - Predictive skill gap analysis

2. **Enterprise Features**
   - Bulk recommendations for recruitment
   - Custom matching criteria
   - API for third-party integration

## Troubleshooting

### Issue: No recommendations returned
- **Solution:** Check user CV data, ensure jobs exist in database

### Issue: Match scores always low
- **Solution:** Verify skill names consistency, check distance threshold

### Issue: Cache not updating
- **Solution:** Check Redis connection, verify cache keys

### Issue: Slow recommendations
- **Solution:** Enable caching, add database indexes, use pagination

## Support

For issues or questions:
1. Check `/tests` directory for examples
2. Review API documentation
3. Contact development team

---

**Created:** Phase 2 Step 2
**Status:** ✅ Complete
**Files:** 4 new files, 1 modified
**LOC:** 2,000+
