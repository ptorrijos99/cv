// ========================================
// Site Configuration
// ========================================

const CONFIG = {
    // Default language: 'en' or 'es'
    lang: 'en',

    // Personal information
    profile: {
        name: 'Pablo Torrijos Arenas',
        photo: 'img/photo.jpg',
        email: 'pablo.torrijos@uclm.es',
        links: {
            scholar: 'https://scholar.google.com/citations?user=gpG5iKgAAAAJ',
            orcid: 'https://orcid.org/0000-0002-8395-3848',
            scopus: 'https://www.scopus.com/authid/detail.uri?authorId=58455058100',
            github: 'https://github.com/ptorrijos99',
        }
    },

    // Logos
    logos: {
        uclm: 'img/uclm.png',
        simd_en: 'img/simd_eng.png',
        simd_es: 'img/simd_esp.png'
    },

    // Theme colors (CSS variables)
    colors: {
        primary: '#B30033',
        primaryDark: '#8a0028',
        primaryLight: '#d4004a',
        journal: '#B30033',
        conference: '#d97706',
        national: '#64748b',
    },

    // Publication stats
    stats: {
        journals: 3,
        conferences: 7,
        national: 3
    }
};

// Apply config to CSS variables
function applyConfig() {
    const root = document.documentElement;
    root.style.setProperty('--primary', CONFIG.colors.primary);
    root.style.setProperty('--primary-dark', CONFIG.colors.primaryDark);
    root.style.setProperty('--primary-light', CONFIG.colors.primaryLight);
    root.style.setProperty('--color-journal', CONFIG.colors.journal);
    root.style.setProperty('--color-conference', CONFIG.colors.conference);
    root.style.setProperty('--color-national', CONFIG.colors.national);
}

// Export for use in other modules
if (typeof module !== 'undefined') {
    module.exports = { CONFIG, applyConfig };
}
