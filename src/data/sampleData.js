export const sampleCVData = {
    personal: {
        fullName: 'Ahmet Yılmaz',
        title: 'Senior Frontend Developer',
        email: 'ahmet.yilmaz@email.com',
        phone: '+90 532 123 45 67',
        location: 'İstanbul, Türkiye',
        linkedin: 'linkedin.com/in/ahmetyilmaz',
        website: 'ahmetyilmaz.dev',
        summary: 'React ve TypeScript konusunda 5+ yıl deneyimli, kullanıcı odaklı ürünler geliştirmeye tutkulu bir yazılım geliştirici. Modern web teknolojileri ve performans optimizasyonu konusunda uzman.'
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
        summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    languages: []
}
