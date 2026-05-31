// Sektör bazlı örnek CV verileri
export const sampleCVDataByIndustry = {
    // Yazılım / Teknoloji
    software: {
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
        customSections: []
    },

    // Pazarlama / Marketing
    marketing: {
        personal: {
            fullName: 'Ayşe Kaya',
            title: 'Digital Marketing Manager',
            email: 'ayse.kaya@email.com',
            phone: '+90 533 987 65 43',
            location: 'İstanbul, Türkiye',
            linkedin: 'linkedin.com/in/aysekaya',
            website: '',
            summary: '7+ yıllık dijital pazarlama deneyimine sahip, data-driven stratejilerle marka büyümesini sağlayan sonuç odaklı bir pazarlama uzmanı. SEO, SEM ve sosyal medya yönetimi konusunda uzman.',
            photo: ''
        },
        experience: [
            {
                id: 1,
                company: 'Global Brand A.Ş.',
                position: 'Digital Marketing Manager',
                startDate: '2020-02',
                endDate: 'Günümz',
                description: '• 12 kişilik dijital pazarlama ekibine liderlik ettim\n• E-posta pazarlama ROI\'sini %180 artırdım\n• Google Ads ve Meta Ads bütçesini optimize ederek maliyet başına edinimi %35 düşürdüm'
            },
            {
                id: 2,
                company: 'Media Agency Ltd.',
                position: 'Performance Marketing Specialist',
                startDate: '2017-05',
                endDate: '2020-01',
                description: '• 50+ müşterinin dijital pazarlama stratejilerini yönettim\n• SEO çalışmalarıyla organik trafiği %200 artırdım\n• A/B test stratejileriyle dönüşüm oranlarını iyileştirdim'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Boğaziçi Üniversitesi',
                degree: 'İşletme',
                startDate: '2012',
                endDate: '2016',
                description: 'Pazarlama üzerine yüksek lisans'
            }
        ],
        skills: [
            'Google Ads', 'Meta Business Suite', 'SEO/SEM', 'Google Analytics',
            'HubSpot', 'Canva', 'Adobe Creative Suite', 'Copywriting',
            'E-posta Pazarlama', 'Influencer Marketing'
        ],
        languages: [
            { name: 'Türkçe', level: 'Ana Dil' },
            { name: 'İngilizce', level: 'İleri Seviye (C1)' },
            { name: 'Almanca', level: 'Orta Seviye (B1)' }
        ],
        projects: [
            {
                id: 1,
                name: 'E-Ticaret Marka Lansmanı',
                description: 'Yeni bir kozmetik markasının 0\'dan dijital lansmanını yönettim, ilk 3 ayda 1M TL ciro elde edildi'
            }
        ],
        certifications: [
            {
                id: 1,
                name: 'Google Ads Certification',
                issuer: 'Google',
                date: '2022'
            },
            {
                id: 2,
                name: 'HubSpot Inbound Marketing',
                issuer: 'HubSpot Academy',
                date: '2021'
            }
        ],
        references: [],
        hobbies: [],
        customSections: []
    },

    // Muhasebe / Finans
    finance: {
        personal: {
            fullName: 'Mehmet Demir',
            title: 'Senior Financial Analyst',
            email: 'mehmet.demir@email.com',
            phone: '+90 535 456 78 90',
            location: 'Ankara, Türkiye',
            linkedin: 'linkedin.com/in/mehmetdemir',
            website: '',
            summary: '8+ yıllık finans ve muhasebe deneyimine sahip, bütçe planlama ve finansal raporlama konusunda uzmanlaşmış, detay odaklı bir finans uzmanı.',
            photo: ''
        },
        experience: [
            {
                id: 1,
                company: 'Finans Bank A.Ş.',
                position: 'Senior Financial Analyst',
                startDate: '2019-01',
                endDate: 'Günümüz',
                description: '• Yıllık 500M TL bütçe planlaması ve takibi\n• Finansal raporlama süreçlerini otomatikleştirerek %40 zaman tasarrufu\n• Yatırım projelerinin finansal analizlerini hazırladım'
            },
            {
                id: 2,
                company: 'Denetim Şirketi Ltd.',
                position: 'Mali Müşavir',
                startDate: '2015-09',
                endDate: '2018-12',
                description: '• 30+ şirketin mali tablolarını denetledim\n• Vergi uyum süreçlerini yönettim\n• Kurumsal danışmanlık hizmetleri verdim'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Hacettepe Üniversitesi',
                degree: 'İktisat',
                startDate: '2010',
                endDate: '2014',
                description: 'Yandal: Muhasebe ve Finansman'
            }
        ],
        skills: [
            'SAP', 'Excel (VBA)', 'Power BI', 'SQL', 'Finansal Modelleme',
            'Bütçe Planlama', 'Risk Analizi', 'MS Dynamics', 'Vergi Mevzuatı',
            'Mali Raporlama'
        ],
        languages: [
            { name: 'Türkçe', level: 'Ana Dil' },
            { name: 'İngilizce', level: 'İleri Seviye (C2)' }
        ],
        projects: [],
        certifications: [
            {
                id: 1,
                name: 'CPA (Certified Public Accountant)',
                issuer: 'TÜRMOB',
                date: '2016'
            },
            {
                id: 2,
                name: 'CFA Level 1',
                issuer: 'CFA Institute',
                date: '2020'
            }
        ],
        references: [],
        hobbies: [],
        customSections: []
    },

    // Sağlık
    healthcare: {
        personal: {
            fullName: 'Dr. Zeynep Yıldız',
            title: 'Ortopedi ve Travmatoloji Uzmanı',
            email: 'dr.zeynep@email.com',
            phone: '+90 537 123 45 67',
            location: 'İzmir, Türkiye',
            linkedin: 'linkedin.com/in/zeynepyildiz',
            website: '',
            summary: '10+ yıllık deneyime sahip, minimal invaziv cerrahi ve spor yaralanmaları konusunda uzmanlaşmış, hasta odaklı yaklaşımla tanınan ortopedi uzmanı.',
            photo: ''
        },
        experience: [
            {
                id: 1,
                company: 'Ege Üniversitesi Hastanesi',
                position: 'Ortopedi ve Travmatoloji Uzmanı',
                startDate: '2018-03',
                endDate: 'Günümüz',
                description: '• Yıllık 500+ artroskopik cerrahi operasyon\n• Sporcu sağlığı ve rehabilitasyon merkezinde çalışıyorum\n• 3 asistanın eğitiminden sorumluyum'
            },
            {
                id: 2,
                company: 'Devlet Hastanesi',
                position: 'Pratisyen Hekim',
                startDate: '2014-06',
                endDate: '2018-02',
                description: '• Acil serviste 4 yıl görev yaptım\n• Travma vakalarının ilk müdahalesinde uzmanlaştım'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Ege Üniversitesi Tıp Fakültesi',
                degree: 'Tıp Doktoru',
                startDate: '2005',
                endDate: '2011',
                description: 'TUS: 2012 - Ortopedi ve Travmatoloji'
            }
        ],
        skills: [
            'Artroskopik Cerrahi', 'Spor Yaralanmaları', 'Omuz ve Diz Cerrahisi',
            'Minimal İnvaziv Teknikler', 'PRP Tedavisi', 'Hasta Danışmanlığı',
            'Ekip Yönetimi', 'Tıbbi Araştırma', 'Uluslararası Kongre Sunumları'
        ],
        languages: [
            { name: 'Türkçe', level: 'Ana Dil' },
            { name: 'İngilizce', level: 'İleri Seviye (C1)' }
        ],
        projects: [],
        certifications: [
            {
                id: 1,
                name: 'European Board of Orthopaedics',
                issuer: 'EBOT',
                date: '2019'
            }
        ],
        references: [],
        hobbies: [],
        customSections: []
    },

    // Eğitim
    education: {
        personal: {
            fullName: 'Ali Özdemir',
            title: 'İngilizce Öğretmeni & Eğitim Koçu',
            email: 'ali.ozdemir@email.com',
            phone: '+90 538 234 56 78',
            location: 'Bursa, Türkiye',
            linkedin: 'linkedin.com/in/aliozdemir',
            website: 'aliogretmen.com',
            summary: '12+ yıllık eğitim deneyimine sahip, yenilikçi öğretim metodları ve teknoloji entegrasyonu konusunda uzman, öğrenci merkezli bir eğitimci.',
            photo: ''
        },
        experience: [
            {
                id: 1,
                company: 'Özel Fen Lisesi',
                position: 'İngilizce Öğretmeni / Bölüm Başkanı',
                startDate: '2018-09',
                endDate: 'Günümüz',
                description: '• 500+ öğrenciye İngilizce öğrettim\n• Öğretmenlerin mesleki gelişim programlarını koordine ettim\n• Yabancı dil kulübünü kurarak öğrenci katılımını %150 artırdım'
            },
            {
                id: 2,
                company: 'Anadolu Lisesi',
                position: 'İngilizce Öğretmeni',
                startDate: '2012-09',
                endDate: '2018-06',
                description: '• 9-12. sınıf öğrencilerine İngilizce hazırlık ve seçmeli dersler\n• YÖKDİL ve TOEFL hazırlık kursları verdim'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Uludağ Üniversitesi',
                degree: 'İngiliz Dili ve Edebiyatı',
                startDate: '2007',
                endDate: '2011',
                description: 'Pedagojik Formasyon Sertifikası'
            }
        ],
        skills: [
            'İngilizce Öğretimi', 'TOEFL/IELTS Hazırlık', 'Eğitim Teknolojileri',
            'Sınıf Yönetimi', 'Öğrenci Koçluğu', 'Program Geliştirme',
            'Google Classroom', 'Zoom/Teams Eğitimi', 'Farklılaştırılmış Öğretim'
        ],
        languages: [
            { name: 'Türkçe', level: 'Ana Dil' },
            { name: 'İngilizce', level: 'Anadil Seviyesi' },
            { name: 'İspanyolca', level: 'Başlangıç (A2)' }
        ],
        projects: [],
        certifications: [
            {
                id: 1,
                name: 'TESOL Certification',
                issuer: 'Cambridge',
                date: '2015'
            }
        ],
        references: [],
        hobbies: [],
        customSections: []
    },

    // Mühendislik
    engineering: {
        personal: {
            fullName: 'Can Yılmaz',
            title: 'İnşaat Mühendisi / Proje Müdürü',
            email: 'can.yilmaz@email.com',
            phone: '+90 539 345 67 89',
            location: 'İstanbul, Türkiye',
            linkedin: 'linkedin.com/in/canyilmaz',
            website: '',
            summary: '9+ yıllık deneyime sahip, büyük ölçekli altyapı projelerinde görev almış, proje yönetimi ve inşaat mühendisliği konusunda uzman bir mühendis.',
            photo: ''
        },
        experience: [
            {
                id: 1,
                company: 'Mega İnşaat A.Ş.',
                position: 'Proje Müdürü',
                startDate: '2020-06',
                endDate: 'Günümüz',
                description: '• 250M TL bütçeli rezidans projesini yönetiyorum\n• 50 kişilik saha ekibine liderlik ediyorum\n• Projeyi planlanan zamandan 2 ay erken tamamladım'
            },
            {
                id: 2,
                company: 'Yapı Mühendislik Ltd.',
                position: 'Şantiye Şefi',
                startDate: '2015-07',
                endDate: '2020-05',
                description: '• 10+ konut ve ticari projenin şantiye şefliğini yaptım\n• Kalite kontrol ve güvenlik süreçlerini yönettim\n• Alt yüklenici koordinasyonundan sorumluydum'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Orta Doğu Teknik Üniversitesi',
                degree: 'İnşaat Mühendisliği',
                startDate: '2010',
                endDate: '2015',
                description: ''
            }
        ],
        skills: [
            'AutoCAD', 'Revit', 'SAP2000', 'Prota', 'MS Project',
            'İş Güvenliği', 'Kalite Kontrol', 'Bütçe Yönetimi',
            'Sözleşme Yönetimi', 'Ekip Liderliği'
        ],
        languages: [
            { name: 'Türkçe', level: 'Ana Dil' },
            { name: 'İngilizce', level: 'İleri Seviye (C1)' }
        ],
        projects: [
            {
                id: 1,
                name: 'Sky Tower Rezidans',
                description: '45 katlı, 250 daireli lüks rezidans projesi - Proje Müdürü'
            }
        ],
        certifications: [
            {
                id: 1,
                name: 'C Sınıfı İş Güvenliği Uzmanlığı',
                issuer: 'ÇSGB',
                date: '2018'
            },
            {
                id: 2,
                name: 'PMP (Project Management Professional)',
                issuer: 'PMI',
                date: '2021'
            }
        ],
        references: [],
        hobbies: [],
        customSections: []
    },

    // Satış
    sales: {
        personal: {
            fullName: 'Elif Şahin',
            title: 'Bölge Satış Müdürü',
            email: 'elif.sahin@email.com',
            phone: '+90 536 456 78 90',
            location: 'İstanbul, Türkiye',
            linkedin: 'linkedin.com/in/elifsahin',
            website: '',
            summary: '8+ yıllık B2B satış deneyimine sahip, müşteri ilişkileri yönetimi ve pazar geliştirme konusunda uzman, sonuç odaklı bir satış profesyoneli.',
            photo: ''
        },
        experience: [
            {
                id: 1,
                company: 'Tech Solutions A.Ş.',
                position: 'Bölge Satış Müdürü',
                startDate: '2019-03',
                endDate: 'Günümüz',
                description: '• 8 kişilik satış ekibine liderlik ediyorum\n• Yıllık 50M TL satış hedefini %120 aştım\n• 200+ kurumsal müşteri portföyü yönetiyorum'
            },
            {
                id: 2,
                company: 'Global Trade Ltd.',
                position: 'Kurumsal Satış Temsilcisi',
                startDate: '2016-01',
                endDate: '2019-02',
                description: '• Fortune 500 şirketlerine satış yaptım\n• Müşteri sadakat programı ile tekrar satış oranını %40 artırdım'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Marmara Üniversitesi',
                degree: 'İşletme',
                startDate: '2011',
                endDate: '2015',
                description: ''
            }
        ],
        skills: [
            'CRM (Salesforce)', 'B2B Satış', 'Müşteri İlişkileri Yönetimi',
            'Pazar Geliştirme', 'Müzakere', 'Sunum Becerileri',
            'Takım Yönetimi', 'Satış Raporlama', 'Soğuk Arama'
        ],
        languages: [
            { name: 'Türkçe', level: 'Ana Dil' },
            { name: 'İngilizce', level: 'İleri Seviye (B2)' },
            { name: 'Rusça', level: 'Orta Seviye (B1)' }
        ],
        projects: [],
        certifications: [
            {
                id: 1,
                name: 'SPIN Selling Certification',
                issuer: 'Huthwaite',
                date: '2020'
            }
        ],
        references: [],
        hobbies: [],
        customSections: []
    },

    // Hukuk
    legal: {
        personal: {
            fullName: 'Burak Kaya',
            title: 'Avukat / Ortak',
            email: 'burak.kaya@hukuk.com',
            phone: '+90 532 345 67 89',
            location: 'İstanbul, Türkiye',
            linkedin: 'linkedin.com/in/burakkaya-avukat',
            website: '',
            summary: '12+ yıllık deneyime sahip, şirketler hukuku ve ticari davalar konusunda uzmanlaşmış, uluslararası arenada faaliyet gösteren bir avukat.',
            photo: ''
        },
        experience: [
            {
                id: 1,
                company: 'Kaya & Ortakları Hukuk Bürosu',
                position: 'Kurucu Ortak',
                startDate: '2018-01',
                endDate: 'Günümüz',
                description: '• 50+ şirket birleşme ve devralma işlemi yönettim\n• Uluslararası tahkim davalarında temsilcilik\n• Fortune 500 şirketlerine danışmanlık'
            },
            {
                id: 2,
                company: 'Yılmaz Hukuk Bürosu',
                position: 'Kıdemli Avukat',
                startDate: '2012-09',
                endDate: '2017-12',
                description: '• Ticari davalarda uzmanlaşma\n• Sözleşme hukuku danışmanlığı'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Ankara Üniversitesi Hukuk Fakültesi',
                degree: 'Hukuk',
                startDate: '2007',
                endDate: '2011',
                description: 'Baro Kaydı: 2012'
            }
        ],
        skills: [
            'Şirketler Hukuku', 'Ticari Davalar', 'Uluslararası Tahkim',
            'Sözleşme Hukuku', 'Fikri Mülkiyet', 'KVKK Uyum',
            'Enerji Hukuku', 'Gayrimenkul Hukuku'
        ],
        languages: [
            { name: 'Türkçe', level: 'Ana Dil' },
            { name: 'İngilizce', level: 'İleri Seviye (C2)' },
            { name: 'Almanca', level: 'Orta Seviye (B2)' }
        ],
        projects: [],
        certifications: [
            {
                id: 1,
                name: 'İstanbul Barosu Üyesi',
                issuer: 'İstanbul Barosu',
                date: '2012'
            }
        ],
        references: [],
        hobbies: [],
        customSections: []
    },

    // Tasarım
    design: {
        personal: {
            fullName: 'Ece Demir',
            title: 'Senior UI/UX Designer',
            email: 'ece.demir@design.com',
            phone: '+90 533 456 78 90',
            location: 'İstanbul, Türkiye',
            linkedin: 'linkedin.com/in/ecedemir-design',
            website: 'ecedemir.design',
            summary: '8+ yıllık deneyime sahip, kullanıcı odaklı tasarım ve marka kimliği konusunda uzman, uluslararası ödüllü bir tasarımcı.',
            photo: ''
        },
        experience: [
            {
                id: 1,
                company: 'Creative Agency Istanbul',
                position: 'Art Director',
                startDate: '2019-06',
                endDate: 'Günümüz',
                description: '• 30+ global marka için kimlik tasarımı\n• Red Dot Design Award 2022 ödülü\n• 5 kişilik tasarım ekibine liderlik'
            },
            {
                id: 2,
                company: 'Digital Studio',
                position: 'UI/UX Designer',
                startDate: '2016-03',
                endDate: '2019-05',
                description: '• Mobil ve web uygulama tasarımları\n• Kullanıcı araştırması ve testleri'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Mimar Sinan Güzel Sanatlar Üniversitesi',
                degree: 'Grafik Tasarım',
                startDate: '2011',
                endDate: '2015',
                description: ''
            }
        ],
        skills: [
            'Figma', 'Adobe Creative Suite', 'Sketch',
            'Prototyping', 'User Research', 'Brand Identity',
            'Motion Design', '3D Design', 'Web Design'
        ],
        languages: [
            { name: 'Türkçe', level: 'Ana Dil' },
            { name: 'İngilizce', level: 'İleri Seviye (C1)' }
        ],
        projects: [
            {
                id: 1,
                name: 'Global Bank Rebrand',
                description: 'Uluslararası banka için kapsamlı marka yenileme projesi'
            }
        ],
        certifications: [
            {
                id: 1,
                name: 'Google UX Design Certificate',
                issuer: 'Google',
                date: '2021'
            }
        ],
        references: [],
        hobbies: [],
        customSections: []
    },

    // İnsan Kaynakları
    hr: {
        personal: {
            fullName: 'Selin Yıldız',
            title: 'İK Direktörü',
            email: 'selin.yildiz@hr.com',
            phone: '+90 534 567 89 01',
            location: 'İstanbul, Türkiye',
            linkedin: 'linkedin.com/in/selinyildiz-hr',
            website: '',
            summary: '10+ yıllık deneyime sahip, yetenek yönetimi ve organizasyonel gelişim konusunda uzman, stratejik İK lideri.',
            photo: ''
        },
        experience: [
            {
                id: 1,
                company: 'Teknoloji Holding A.Ş.',
                position: 'İK Direktörü',
                startDate: '2018-04',
                endDate: 'Günümüz',
                description: '• 2000+ çalışanlı holding için İK stratejisi\n• Yıllık 500+ işe alım süreci\n• Yetenek yönetimi programı kurulumu'
            },
            {
                id: 2,
                company: 'Danışmanlık Şirketi',
                position: 'İK Müdürü',
                startDate: '2014-08',
                endDate: '2018-03',
                description: '• Performans yönetim sistemi geliştirme\n• Eğitim ve gelişim programları'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Koç Üniversitesi',
                degree: 'Psikoloji',
                startDate: '2009',
                endDate: '2013',
                description: 'Organizasyonel Psikoloji yüksek lisansı'
            }
        ],
        skills: [
            'Yetenek Yönetimi', 'İşe Alım', 'Performans Yönetimi',
            'Eğitim ve Gelişim', 'Ücret Yönetimi', 'Çalışan İlişkileri',
            'HR Analytics', 'SAP SuccessFactors', 'Employer Branding'
        ],
        languages: [
            { name: 'Türkçe', level: 'Ana Dil' },
            { name: 'İngilizce', level: 'İleri Seviye (C1)' },
            { name: 'Fransızca', level: 'Orta Seviye (B1)' }
        ],
        projects: [],
        certifications: [
            {
                id: 1,
                name: 'SHRM-SCP',
                issuer: 'SHRM',
                date: '2020'
            }
        ],
        references: [],
        hobbies: [],
        customSections: []
    },

    // Lojistik
    logistics: {
        personal: {
            fullName: 'Murat Şahin',
            title: 'Lojistik Operasyon Müdürü',
            email: 'murat.sahin@lojistik.com',
            phone: '+90 535 678 90 12',
            location: 'İzmir, Türkiye',
            linkedin: 'linkedin.com/in/muratsahin-logistics',
            website: '',
            summary: '9+ yıllık deneyime sahip, uluslararası tedarik zinciri ve depo yönetimi konusunda uzman lojistik profesyoneli.',
            photo: ''
        },
        experience: [
            {
                id: 1,
                company: 'Global Logistics Co.',
                position: 'Operasyon Müdürü',
                startDate: '2020-02',
                endDate: 'Günümüz',
                description: '• 3 kıtaya yayılmış tedarik zinciri yönetimi\n• Depo operasyon verimliliğini %35 artırma\n• 150 kişilik operasyon ekibi'
            },
            {
                id: 2,
                company: 'E-Commerce Logistics',
                position: 'Depo Yöneticisi',
                startDate: '2015-06',
                endDate: '2020-01',
                description: '• Son kilometre teslimat optimizasyonu\n• WMS sistemi implementasyonu'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Dokuz Eylül Üniversitesi',
                degree: 'Uluslararası Ticaret',
                startDate: '2010',
                endDate: '2014',
                description: ''
            }
        ],
        skills: [
            'Tedarik Zinciri Yönetimi', 'Depo Yönetimi', 'WMS',
            'SAP EWM', 'Son Kilometre', 'Gümrük İşlemleri',
            'ISO 9001', 'Lean Logistics', '6 Sigma'
        ],
        languages: [
            { name: 'Türkçe', level: 'Ana Dil' },
            { name: 'İngilizce', level: 'İleri Seviye (B2)' }
        ],
        projects: [],
        certifications: [
            {
                id: 1,
                name: 'CSCP (Certified Supply Chain Professional)',
                issuer: 'APICS',
                date: '2019'
            }
        ],
        references: [],
        hobbies: [],
        customSections: []
    },

    // Gastronomi
    culinary: {
        personal: {
            fullName: 'Hasan Öztürk',
            title: 'Executive Chef',
            email: 'hasan.ozturk@chef.com',
            phone: '+90 536 789 01 23',
            location: 'İstanbul, Türkiye',
            linkedin: 'linkedin.com/in/hasanozturk-chef',
            website: '',
            summary: '15+ yıllık deneyime sahip, uluslararası mutfaklarda çalışmış, Michelin yıldızlı restoran deneyimi olan bir şef.',
            photo: ''
        },
        experience: [
            {
                id: 1,
                company: 'Fine Dining Restaurant',
                position: 'Executive Chef',
                startDate: '2019-09',
                endDate: 'Günümüz',
                description: '• Michelin yıldızlı restoranda baş şef\n• 25 kişilik mutfak ekibi yönetimi\n• Modern Türk mutfağı konsepti geliştirme'
            },
            {
                id: 2,
                company: 'International Hotel Chain',
                position: 'Sous Chef',
                startDate: '2015-03',
                endDate: '2019-08',
                description: '• 5 ülkede farklı mutfak deneyimleri\n• Özel davet ve catering organizasyonları'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Mutfak Sanatları Akademisi',
                degree: 'Aşçılık',
                startDate: '2010',
                endDate: '2012',
                description: 'Le Cordon Bleu Paris - Stage'
            }
        ],
        skills: [
            'Modern Türk Mutfağı', 'Moleküler Gastronomi', 'Pastacılık',
            'Menü Planlama', 'Maliyet Kontrolü', 'HACCP',
            'Ekip Yönetimi', 'VIP Catering', 'Şarap Bilgisi'
        ],
        languages: [
            { name: 'Türkçe', level: 'Ana Dil' },
            { name: 'İngilizce', level: 'İleri Seviye (B2)' },
            { name: 'Fransızca', level: 'Orta Seviye (B1)' }
        ],
        projects: [
            {
                id: 1,
                name: 'Zero Waste Kitchen',
                description: 'Sıfır atık mutfak projesi - %40 gıda israfı azaltma'
            }
        ],
        certifications: [],
        references: [],
        hobbies: [],
        customSections: []
    },

    // Turizm
    tourism: {
        personal: {
            fullName: 'Zeynep Aydın',
            title: 'Turizm Rehberi / Tour Manager',
            email: 'zeynep.aydin@turizm.com',
            phone: '+90 537 890 12 34',
            location: 'Antalya, Türkiye',
            linkedin: 'linkedin.com/in/zeynepaydin-guide',
            website: '',
            summary: '8+ yıllık deneyime sahip, kültürel ve arkeolojik turlarda uzmanlaşmış, çok dilli profesyonel turizm rehberi.',
            photo: ''
        },
        experience: [
            {
                id: 1,
                company: 'Prestige Tour Company',
                position: 'Kıdemli Tur Rehberi',
                startDate: '2018-04',
                endDate: 'Günümüz',
                description: '• VIP kültür turları organizasyonu\n• 5000+ turist ağırlama\n• Özel arkeolojik site turları'
            },
            {
                id: 2,
                company: 'Cruise Line Company',
                position: 'Ekskürsiyon Sorumlusu',
                startDate: '2015-05',
                endDate: '2018-03',
                description: '• Akdeniz ve Ege liman turları\n• Çok uluslu gruplara rehberlik'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Akdeniz Üniversitesi',
                degree: 'Turizm Rehberliği',
                startDate: '2011',
                endDate: '2015',
                description: 'Kültür Varlıkları ve Turizm Bakanlığı Rehberlik Belgesi'
            }
        ],
        skills: [
            'Kültürel Turlar', 'Arkeolojik Turlar', 'VIP Hizmet',
            'Grup Yönetimi', 'Crisis Management', 'Storytelling',
            'Etkinlik Planlama', 'Müşteri İlişkileri', 'İlk Yardım'
        ],
        languages: [
            { name: 'Türkçe', level: 'Ana Dil' },
            { name: 'İngilizce', level: 'İleri Seviye (C2)' },
            { name: 'İspanyolca', level: 'Orta Seviye (B2)' },
            { name: 'İtalyanca', level: 'Orta Seviye (B1)' }
        ],
        projects: [],
        certifications: [
            {
                id: 1,
                name: 'Profesyonel Turizm Rehberliği',
                issuer: 'Kültür ve Turizm Bakanlığı',
                date: '2015'
            }
        ],
        references: [],
        hobbies: [],
        customSections: []
    },

    // Medya / Gazetecilik
    media: {
        personal: {
            fullName: 'Kerem Yılmaz',
            title: 'Muhabir / Editör',
            email: 'kerem.yilmaz@media.com',
            phone: '+90 538 901 23 45',
            location: 'İstanbul, Türkiye',
            linkedin: 'linkedin.com/in/keremyilmaz-journalist',
            website: '',
            summary: '10+ yıllık deneyime sahip, ekonomi ve politika alanında uzman, ödüllü bir gazeteci ve editör.',
            photo: ''
        },
        experience: [
            {
                id: 1,
                company: 'Ulusal Gazete',
                position: 'Kıdemli Ekonomi Muhabiri',
                startDate: '2017-08',
                endDate: 'Günümüz',
                description: '• Günlük ekonomi haberleri ve analizler\n• Röportajlar ve özel haberler\n• Türkiye Gazeteciler Cemiyeti ödülü 2021'
            },
            {
                id: 2,
                company: 'Haber Ajansı',
                position: 'Muhabir',
                startDate: '2013-06',
                endDate: '2017-07',
                description: '• Ankara muhabirliği\n• Siyaset ve ekonomi haberleri'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Galatasaray Üniversitesi',
                degree: 'Halkla İlişkiler ve Reklamcılık',
                startDate: '2009',
                endDate: '2013',
                description: ''
            }
        ],
        skills: [
            'Haber Yazımı', 'Editörlük', 'Röportaj Teknikleri',
            'Araştırma', 'Fotoğrafçılık', 'Video Prodüksiyon',
            'Sosyal Medya', 'SEO', 'Data Journalism'
        ],
        languages: [
            { name: 'Türkçe', level: 'Ana Dil' },
            { name: 'İngilizce', level: 'İleri Seviye (C1)' }
        ],
        projects: [],
        certifications: [],
        references: [],
        hobbies: [],
        customSections: []
    },

    // Spor / Fitness
    fitness: {
        personal: {
            fullName: 'Cemre Kaya',
            title: 'Fitness Eğitmeni / Personal Trainer',
            email: 'cemre.kaya@fitness.com',
            phone: '+90 539 012 34 56',
            location: 'İstanbul, Türkiye',
            linkedin: 'linkedin.com/in/cemrekaya-fitness',
            website: '',
            summary: '6+ yıllık deneyime sahip, sertifikalı fitness ve pilates eğitmeni, beslenme danışmanı.',
            photo: ''
        },
        experience: [
            {
                id: 1,
                company: 'Premium Fitness Club',
                position: 'Kıdemli Personal Trainer',
                startDate: '2019-03',
                endDate: 'Günümüz',
                description: '• 100+ bireysel danışan\n• Özel ders ve grup dersleri\n• Beslenme danışmanlığı'
            },
            {
                id: 2,
                company: 'Wellness Center',
                position: 'Pilates Eğitmeni',
                startDate: '2017-01',
                endDate: '2019-02',
                description: '• Grup reformer dersleri\n• Hamile pilates uzmanlığı'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Ege Üniversitesi',
                degree: 'Spor Yöneticiliği',
                startDate: '2013',
                endDate: '2017',
                description: ''
            }
        ],
        skills: [
            'Personal Training', 'Pilates', 'Reformer',
            'Nutrition Coaching', 'HIIT', 'Kettlebell',
            'TRX', 'Yoga', 'Pre/Post Natal Fitness'
        ],
        languages: [
            { name: 'Türkçe', level: 'Ana Dil' },
            { name: 'İngilizce', level: 'Orta Seviye (B2)' }
        ],
        projects: [],
        certifications: [
            {
                id: 1,
                name: 'ACE Certified Personal Trainer',
                issuer: 'ACE',
                date: '2018'
            },
            {
                id: 2,
                name: 'Pilates Mat & Reformer',
                issuer: 'Balanced Body',
                date: '2019'
            }
        ],
        references: [],
        hobbies: [],
        customSections: []
    },

    // Psikoloji
    psychology: {
        personal: {
            fullName: 'Buse Yıldırım',
            title: 'Klinik Psikolog',
            email: 'buse.yildirim@psikoloji.com',
            phone: '+90 530 123 45 67',
            location: 'Ankara, Türkiye',
            linkedin: 'linkedin.com/in/buseyildirim-psych',
            website: '',
            summary: '7+ yıllık deneyime sahip, bilişsel davranışçı terapi ve travma konusunda uzman, klinik psikolog.',
            photo: ''
        },
        experience: [
            {
                id: 1,
                company: 'Özel Psikoterapi Merkezi',
                position: 'Klinik Psikolog',
                startDate: '2019-05',
                endDate: 'Günümüz',
                description: '• Bireysel ve grup terapileri\n• Anksiyete ve depresyon tedavisi\n• Travma sonrası stres bozukluğu'
            },
            {
                id: 2,
                company: 'Devlet Hastanesi',
                position: 'Psikolog',
                startDate: '2016-08',
                endDate: '2019-04',
                description: '• Psikiyatri servisinde görev\n• Psikolojik test uygulamaları'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Hacettepe Üniversitesi',
                degree: 'Psikoloji',
                startDate: '2010',
                endDate: '2014',
                description: 'Klinik Psikoloji yüksek lisansı'
            }
        ],
        skills: [
            'Bilişsel Davranışçı Terapi', 'EMDR', 'Travma Terapisi',
            'Psikolojik Testler', 'Mindfulness', 'Aile Terapisi',
            'Çocuk Psikolojisi', 'Online Terapi', 'Süpervizyon'
        ],
        languages: [
            { name: 'Türkçe', level: 'Ana Dil' },
            { name: 'İngilizce', level: 'İleri Seviye (C1)' }
        ],
        projects: [],
        certifications: [
            {
                id: 1,
                name: 'EMDR Europe Approved Practitioner',
                issuer: 'EMDR Europe',
                date: '2020'
            }
        ],
        references: [],
        hobbies: [],
        customSections: []
    },

    // Pilot / Havacılık
    aviation: {
        personal: {
            fullName: 'Emre Kaya',
            title: 'Ticari Pilot / First Officer',
            email: 'emre.kaya@pilot.com',
            phone: '+90 531 234 56 78',
            location: 'İstanbul, Türkiye',
            linkedin: 'linkedin.com/in/emrekaya-pilot',
            website: '',
            summary: '5+ yıllık deneyime sahip, Airbus A320 ve Boeing 737 tipinde yetkilendirilmiş, 3000+ uçuş saatine sahip ticari pilot.',
            photo: ''
        },
        experience: [
            {
                id: 1,
                company: 'Ulusal Havayolu',
                position: 'First Officer',
                startDate: '2019-06',
                endDate: 'Günümüz',
                description: '• Airbus A320 First Officer\n• 2000+ güvenli uçuş saati\n• Uluslararası ve iç hat uçuşları'
            },
            {
                id: 2,
                company: 'Uçuş Akademisi',
                position: 'Uçuş Eğitmeni',
                startDate: '2018-01',
                endDate: '2019-05',
                description: '• PPL ve CPL eğitimi verme\n• Uçuş simülatörü eğitmenliği'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Anadolu Üniversitesi',
                degree: 'Havacılık Yönetimi',
                startDate: '2013',
                endDate: '2017',
                description: ''
            }
        ],
        skills: [
            'Airbus A320', 'Boeing 737', 'IFR Operations',
            'CRM', 'Threat and Error Management', 'Multi-Crew Coordination',
            'ETOPS', 'CAT II/III Operations', 'Flight Planning'
        ],
        languages: [
            { name: 'Türkçe', level: 'Ana Dil' },
            { name: 'İngilizce', level: 'İleri Seviye (C1 - ICAO Level 6)' }
        ],
        projects: [],
        certifications: [
            {
                id: 1,
                name: 'ATPL (Airline Transport Pilot License)',
                issuer: 'SHGM',
                date: '2019'
            },
            {
                id: 2,
                name: 'A320 Type Rating',
                issuer: 'Airbus Training Center',
                date: '2020'
            }
        ],
        references: [],
        hobbies: [],
        customSections: []
    }
}

// Geriye uyumluluk için varsayılan yazılım örneği
export const sampleCVData = sampleCVDataByIndustry.software

// Tüm sektörleri dışa aktar
export const getIndustrySamples = () => sampleCVDataByIndustry

// Boş CV şablonu
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
    customSections: []
}

