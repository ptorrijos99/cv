// ========================================
// Internationalization (i18n)
// ========================================

const I18N = {
    en: {
        // Navigation
        nav: {
            home: 'Home',
            publications: 'Publications'
        },

        // Header
        header: {
            role: 'Predoctoral Researcher',
            affiliation: 'Research Group: <a href="https://simd.i3a.uclm.es/" target="_blank" rel="noopener">Intelligent Systems and Data Mining (SIMD)</a>',
            university: 'University of Castilla-La Mancha',
            email: 'Email',
            scholar: 'Scholar',
            orcid: 'ORCID',
            scopus: 'Scopus',
            github: 'GitHub'
        },

        // Home page
        home: {
            aboutTitle: 'About Me',
            aboutText: `Predoctoral researcher in the <strong>Intelligent Systems and Data Mining (SIMD)</strong> 
        group at I3A Institute, with FPU21/01074 grant. My work focuses on <strong>federated learning</strong> 
        of probabilistic graphical models such as <strong>Bayesian networks</strong>, developing algorithms 
        that enable learning from distributed data while preserving privacy.`,
            featuredTitle: 'Featured Publications',
            viewAll: 'View all publications →'
        },

        // Publications page
        publications: {
            title: 'Publications',
            stats: {
                journals: 'Journals',
                conferences: 'Int. Conferences',
                workshops: 'Int. Workshops',
                national: 'National'
            },
            filters: {
                all: 'All',
                journals: 'Journals',
                conferences: 'Conferences',
                workshops: 'Workshops',
                national: 'National'
            }
        },

        // Footer
        footer: {
            copyright: '© 2026 Pablo Torrijos Arenas · University of Castilla-La Mancha'
        },

        // Theme
        theme: {
            toggle: 'Toggle theme'
        }
    },

    es: {
        // Navigation
        nav: {
            home: 'Inicio',
            publications: 'Publicaciones'
        },

        // Header
        header: {
            role: 'Investigador Predoctoral',
            affiliation: 'Grupo de Investigación: <a href="https://simd.i3a.uclm.es/" target="_blank" rel="noopener">Sistemas Inteligentes y Minería de Datos (SIMD)</a>',
            university: 'Universidad de Castilla-La Mancha',
            email: 'Email',
            scholar: 'Scholar',
            orcid: 'ORCID',
            scopus: 'Scopus',
            github: 'GitHub'
        },

        // Home page
        home: {
            aboutTitle: 'Sobre mí',
            aboutText: `Investigador predoctoral en el grupo de <strong>Sistemas Inteligentes y Minería de Datos (SIMD)</strong> 
        del Instituto I3A, con ayuda FPU21/01074. Mi trabajo se centra en el <strong>aprendizaje federado</strong> 
        de modelos gráficos probabilísticos como las <strong>redes bayesianas</strong>, desarrollando algoritmos 
        que permiten aprender de datos distribuidos preservando la privacidad.`,
            featuredTitle: 'Publicaciones Destacadas',
            viewAll: 'Ver todas las publicaciones →'
        },

        // Publications page
        publications: {
            title: 'Publicaciones',
            stats: {
                journals: 'Revistas',
                conferences: 'Conferencias Int.',
                workshops: 'Workshops Int.',
                national: 'Nacionales'
            },
            filters: {
                all: 'Todas',
                journals: 'Revistas',
                conferences: 'Conferencias',
                workshops: 'Workshops',
                national: 'Nacionales'
            }
        },

        // Footer
        footer: {
            copyright: '© 2026 Pablo Torrijos Arenas · Universidad de Castilla-La Mancha'
        },

        // Theme
        theme: {
            toggle: 'Cambiar tema'
        }
    }
};

// Get translation for current language
function t(key) {
    const lang = CONFIG.lang || 'en';
    const keys = key.split('.');
    let value = I18N[lang];

    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            // Fallback to English
            value = I18N.en;
            for (const k2 of keys) {
                value = value?.[k2];
            }
            break;
        }
    }

    return value || key;
}

// Export for use in other modules
if (typeof module !== 'undefined') {
    module.exports = { I18N, t };
}
