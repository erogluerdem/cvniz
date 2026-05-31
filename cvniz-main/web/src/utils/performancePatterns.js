/**
 * React Performance Optimization Patterns
 * Best practices for CVniz frontend optimization
 */

// Pattern 1: Memoization for expensive components
import React, { memo, useMemo, useCallback } from 'react';

/**
 * Memoized Component - prevents unnecessary re-renders
 */
const JobCard = memo(({ job, onApply }) => {
    return (
        <div className="job-card">
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <button onClick={() => onApply(job.id)}>Apply</button>
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison - return true if props are equal (DON'T re-render)
    return (
        prevProps.job.id === nextProps.job.id &&
        prevProps.onApply === nextProps.onApply
    );
});

// Pattern 2: useMemo for expensive computations
const JobList = ({ jobs, filter }) => {
    // Only recalculate when jobs or filter changes
    const filteredJobs = useMemo(() => {
        console.log('Filtering jobs...');
        return jobs.filter(job => {
            if (filter.salary) {
                return job.salary >= filter.salary;
            }
            if (filter.location) {
                return job.location === filter.location;
            }
            return true;
        });
    }, [jobs, filter]);

    return (
        <div>
            {filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    );
};

// Pattern 3: useCallback for function stability
const JobListContainer = ({ jobs }) => {
    const [filter, setFilter] = React.useState({});

    // Callback doesn't change unless jobs changes
    const handleApply = useCallback((jobId) => {
        console.log('Applying to job:', jobId);
        // API call
    }, []);

    return (
        <JobList 
            jobs={jobs} 
            filter={filter} 
            onApply={handleApply}
        />
    );
};

// Pattern 4: Code Splitting with React.lazy
import { Suspense, lazy } from 'react';

const AdvancedAnalysis = lazy(() => import('./AdvancedAnalysis'));
const ExperimentDashboard = lazy(() => import('./ExperimentDashboard'));

const AdminPanel = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <AdvancedAnalysis />
                <ExperimentDashboard />
            </Suspense>
        </div>
    );
};

// Pattern 5: Virtual Scrolling for large lists
import { FixedSizeList } from 'react-window';

const LargeJobList = ({ jobs }) => {
    const Row = ({ index, style }) => (
        <div style={style} className="job-item">
            <JobCard job={jobs[index]} />
        </div>
    );

    return (
        <FixedSizeList
            height={600}
            itemCount={jobs.length}
            itemSize={100}
            width="100%"
        >
            {Row}
        </FixedSizeList>
    );
};

// Pattern 6: Image Lazy Loading
const LazyImage = ({ src, alt, placeholder }) => {
    const [imgSrc, setImgSrc] = React.useState(placeholder);
    const [isLoading, setIsLoading] = React.useState(true);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    React.useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            setImgSrc(src);
            handleImageLoad();
        };
    }, [src]);

    return (
        <img 
            src={imgSrc} 
            alt={alt}
            className={isLoading ? 'loading' : 'loaded'}
        />
    );
};

// Pattern 7: Dynamic Route Loading
const routes = [
    {
        path: '/',
        component: lazy(() => import('./pages/Home')),
        exact: true
    },
    {
        path: '/jobs',
        component: lazy(() => import('./pages/Jobs')),
    },
    {
        path: '/admin',
        component: lazy(() => import('./pages/AdminPanel')),
    },
    {
        path: '/analytics',
        component: lazy(() => import('./pages/Analytics')),
    }
];

// Pattern 8: Debounce Hook for Search
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = React.useState(value);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};

const SearchJobs = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    React.useEffect(() => {
        if (debouncedSearchTerm) {
            // Perform search
            console.log('Searching for:', debouncedSearchTerm);
        }
    }, [debouncedSearchTerm]);

    return (
        <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs..."
        />
    );
};

// Pattern 9: Throttle Hook for Scroll Events
const useThrottle = (fn, delay) => {
    const lastRun = React.useRef(Date.now());

    return React.useCallback((...args) => {
        const now = Date.now();
        if (now - lastRun.current >= delay) {
            fn(...args);
            lastRun.current = now;
        }
    }, [fn, delay]);
};

const ScrollListener = () => {
    const handleScroll = useThrottle(() => {
        console.log('Scroll event');
        // Load more jobs
    }, 200);

    React.useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return <div>Jobs list...</div>;
};

// Pattern 10: Context Optimization with useContext splitting
import { createContext, useContext } from 'react';

// Split into multiple contexts instead of one large one
const UserContext = createContext();
const NotificationContext = createContext();
const ThemeContext = createContext();

const useUser = () => useContext(UserContext);
const useNotifications = () => useContext(NotificationContext);
const useTheme = () => useContext(ThemeContext);

// Only components that need user data will re-render when it changes
const Profile = () => {
    const user = useUser();
    return <div>{user.name}</div>;
};

export {
    JobCard,
    JobList,
    JobListContainer,
    AdminPanel,
    LargeJobList,
    LazyImage,
    routes,
    SearchJobs,
    ScrollListener,
    useUser,
    useNotifications,
    useTheme,
    useDebounce,
    useThrottle
};
