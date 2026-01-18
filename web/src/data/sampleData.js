export const sampleCVData = {
    personal: {
        fullName: 'Ahmet Yılmaz',
        title: 'Senior Frontend Developer',
        email: 'ahmet.yilmaz@email.com',
        phone: '+90 532 123 45 67',
        location: 'İstanbul, Türkiye',
        linkedin: 'linkedin.com/in/ahmetyilmaz',
        website: 'ahmetyilmaz.dev',
        summary: 'React ve TypeScript konusunda 5+ yıl deneyimli, kullanıcı odaklı ürünler geliştirmeye tutkulu bir yazılım geliştirici. Modern web teknolojileri ve performans optimizasyonu konusunda uzman.',
        photo: ''
    },
    experience: [
        {
            id: 1,
            company: 'Tech Startup A.Ş.',
            position: 'Senior Frontend Developer',
            startDate: '2021-06',
            endDate: 'Günümüz',
            description: '• React ve Next.js ile e-ticaret platformu geliştirdim\n• Sayfa yüklenme süresini %40 azalttım\n• 5 kişilik bir frontend ekibine liderlik ettim'
        },
        {
            id: 2,
            company: 'Digital Agency Ltd.',
            position: 'Frontend Developer',
            startDate: '2019-03',
            endDate: '2021-05',
            description: '• 20+ kurumsal web sitesi geliştirdim\n• Vue.js ve Nuxt.js projelerinde çalıştım\n• CI/CD pipeline kurulumlarını gerçekleştirdim'
        }
    ],
    education: [
        {
            id: 1,
            school: 'İstanbul Teknik Üniversitesi',
            degree: 'Bilgisayar Mühendisliği',
            startDate: '2014',
            endDate: '2018',
            description: 'GPA: 3.5/4.0 - Onur Listesi'
        }
    ],
    skills: [
        'React', 'TypeScript', 'Next.js', 'Vue.js', 'Node.js',
        'Tailwind CSS', 'GraphQL', 'PostgreSQL', 'Docker', 'Git'
    ],
    languages: [
        { name: 'Türkçe', level: 'Ana Dil' },
        { name: 'İngilizce', level: 'İleri Seviye (C1)' }
    ],
    projects: [
        {
            id: 1,
            name: 'E-Commerce Platform',
            description: 'Next.js ve Stripe ile tam fonksiyonlu e-ticaret çözümü',
            link: 'github.com/ahmetyilmaz/ecommerce'
        }
    ],
    certifications: [
        {
            id: 1,
            name: 'AWS Certified Developer',
            issuer: 'Amazon Web Services',
            date: '2023'
        }
    ],
    references: [],
    hobbies: [],
    customSections: [],
    publicProfile: {
        slug: 'ahmet-yilmaz',
        metaTitle: 'Ahmet Yılmaz | Frontend Lead',
        metaDescription: 'Modern frontend stack ile performanslı ürünler geliştiren kıdemli yazılım geliştirici.',
        socialImage: 'https://cdn.CVniz.app/social/ahmet.png',
        isPublic: true,
        publishStatus: 'live',
        liveVersionId: 'current',
        livePublishedAt: '2024-05-01T10:30:00.000Z',
        previousLiveVersionId: '',
        selectedVersionId: 'current',
        scheduledVersionId: '',
        scheduledAt: ''
    },
    analytics: {
        totalViews: 2380,
        uniqueVisitors: 1820,
        clickThroughRate: 38,
        avgTimeOnPage: 126,
        geo: [
            { country: 'Türkiye', value: 62 },
            { country: 'Almanya', value: 18 },
            { country: 'ABD', value: 11 },
            { country: 'Hollanda', value: 9 }
        ],
        topReferrers: [
            { source: 'LinkedIn', clicks: 640 },
            { source: 'E-posta İmzası', clicks: 410 },
            { source: 'Kişisel Site', clicks: 220 }
        ],
        timeline: [
            { day: 'Pzt', views: 220 },
            { day: 'Sal', views: 310 },
            { day: 'Çar', views: 280 },
            { day: 'Per', views: 360 },
            { day: 'Cum', views: 410 },
            { day: 'Cmt', views: 190 },
            { day: 'Paz', views: 150 }
        ]
    },
    notificationPrefs: {
        weeklyEmail: true,
        pushAlerts: true,
        viewMilestones: true,
        referralDigest: false
    },
    integrationSettings: {
        linkedin: {
            connected: true,
            autoImport: true,
            lastSync: '2024-12-01T09:20:00.000Z',
            profileUrl: 'https://www.linkedin.com/in/ahmetyilmaz'
        },
        behance: {
            connected: false,
            autoImport: false,
            lastSync: '',
            profileUrl: ''
        },
        github: {
            connected: true,
            autoImport: true,
            lastSync: '2024-11-24T14:05:00.000Z',
            profileUrl: 'https://github.com/ahmet'
        },
        notion: {
            connected: true,
            autoImport: false,
            lastSync: '2024-11-18T17:42:00.000Z',
            databaseId: 'CVniz-projects-db'
        },
        googleSheets: {
            connected: false,
            autoImport: false,
            lastSync: '',
            sheetUrl: ''
        }
    },
    webWidgets: [
        {
            id: 'widget-blog',
            type: 'blog',
            enabled: true,
            settings: {
                heading: 'Son Blog Yazıları',
                subtitle: 'Teknoloji yazılarımdan güncel seçkiler',
                layout: 'grid',
                posts: [
                    { title: 'AI Destekli CV İş Akışları', url: 'https://medium.com/@ahmet/cv-ai', date: '2024-09-12' },
                    { title: 'Frontend Performans Rehberi', url: 'https://medium.com/@ahmet/frontend-perf', date: '2024-06-05' },
                    { title: 'Design System Notları', url: 'https://ahmetyilmaz.dev/blog/design-system', date: '2024-04-28' }
                ]
            }
        },
        {
            id: 'widget-video',
            type: 'video',
            enabled: true,
            settings: {
                heading: 'Product Demo',
                embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                caption: 'CV otomasyon sürecimi 90 saniyede izleyin.',
                poster: 'https://cdn.CVniz.app/video/thumb.png',
                autoplay: false
            }
        },
        {
            id: 'widget-testimonials',
            type: 'testimonials',
            enabled: true,
            settings: {
                heading: 'Partnerlerden Notlar',
                theme: 'glass',
                quotes: [
                    { name: 'Ece K.', role: 'HR Lead @Trendly', quote: 'Ahmet, işe alım kampanyamızda CV dönüş oranını %35 artırdı.' },
                    { name: 'Mark S.', role: 'CTO @NordicWare', quote: 'Yaşayan CV altyapısı sayesinde mühendislik işe alımlarında zamandan kazandık.' }
                ]
            }
        },
        {
            id: 'widget-cta',
            type: 'cta',
            enabled: true,
            settings: {
                heading: 'Birlikte Çalışalım',
                subheading: 'Yeni projeler ve danışmanlık fırsatları için takvimi açtım.',
                buttonText: 'Görüşme Planla',
                buttonUrl: 'https://calendly.com/ahmet/meet',
                style: 'gradient'
            }
        }
    ]
}

export const emptyCV = {
    personal: {
        fullName: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
        summary: '',
        photo: ''
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    projects: [],
    certifications: [],
    references: [],
    hobbies: [],
    customSections: [],
    publicProfile: {
        slug: '',
        metaTitle: '',
        metaDescription: '',
        socialImage: '',
        isPublic: false,
        publishStatus: 'draft',
        liveVersionId: '',
        livePublishedAt: '',
        previousLiveVersionId: '',
        selectedVersionId: 'current',
        scheduledVersionId: '',
        scheduledAt: ''
    },
    analytics: {
        totalViews: 0,
        uniqueVisitors: 0,
        clickThroughRate: 0,
        avgTimeOnPage: 0,
        geo: [],
        topReferrers: [],
        timeline: []
    },
    notificationPrefs: {
        weeklyEmail: false,
        pushAlerts: false,
        viewMilestones: false,
        referralDigest: false
    },
    integrationSettings: {
        linkedin: { connected: false, autoImport: false, lastSync: '', profileUrl: '' },
        behance: { connected: false, autoImport: false, lastSync: '', profileUrl: '' },
        github: { connected: false, autoImport: false, lastSync: '', profileUrl: '' },
        notion: { connected: false, autoImport: false, lastSync: '', databaseId: '' },
        googleSheets: { connected: false, autoImport: false, lastSync: '', sheetUrl: '' }
    },
    webWidgets: []
}

