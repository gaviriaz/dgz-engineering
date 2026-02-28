/**
 * DGZ_CORE_v1.0 - Global Intelligence & Navigation
 * Handles i18n, Global Header injection, and Navigation Bridges.
 */

const dgzTranslations = {
    en: {
        nav_home: "Nucleus",
        nav_lab: "Spatial Lab",
        nav_validator: "Command Center",
        nav_map: "Intel Map",
        nav_projects: "Technical Assets",
        nav_about: "About",
        nav_contact: "Contact",
        nav_cv: "Bio_Neural_Link",
        lang_switch: "ES",
        back_to_core: "Return to Core",
        system_status: "SYSTEM_LEVEL: SOVEREIGN",
        api_connected: "API CONNECTED",
        ai_active: "Groq Llama-3 Active",
        // Hero
        hero_tag: "// SPATIAL_SYSTEMS_ENGINEERING",
        hero_h1: "Automating Multipurpose Cadastre & Territorial Intelligence Systems",
        hero_desc: "High-Performance Geospatial Engineering & Automated Systems Architecture.",
        // CV Modal
        cv_close: "EXIT_INTERFACE",
        cv_label_profile: "Personal_Profile",
        cv_label_skills: "Technical_DNA",
        cv_label_langs: "Languages",
        cv_label_metrics: "Impact_Metrics",
        cv_label_edu: "Academic_History",
        cv_label_cert: "Credentials & Courses",
        cv_label_exp_main: "Current_Mission",
        cv_label_exp_log: "Professional_Log",
        cv_download: "Download Datasheet (PDF)",
        cv_summary: "GIS Professional with a comprehensive vision merging technical excellence in Geographic Information Systems with mastery in database architecture and software development.",
        // Project Specifics
        proj_automation: "Automation Systems",
        proj_geo_llm: "Geo-LLM Intelligence",
        proj_gis_dash: "GIS Dashboard",
        proj_qgis: "QGIS Power Tools",
        proj_research: "Research Lab",
        // Validator specifics
        val_title: "Catastral Intelligence Command Center",
        val_module1: "Topological Engine",
        val_module1_desc: "Strict topological validation on base cartography. Detects overlaps, slivers and geometric completeness.",
        val_module2: "Interoperability",
        val_module2_desc: "Synchronization of Cadastral Database (.shp/.gpkg) vs SNR Registry Matrix (.xlsx) to detect area and identifier inconsistencies.",
        val_module3: "Analytics",
        val_module3_desc: "Aggregate visualization of mapping health in real-time. Efficiency metrics and recurring error types.",
        // Map specifics
        map_title: "Spatial Lab — Cadastral Viewer",
        map_layers: "Map Layers",
        map_basemap: "Base Map",
        map_legend: "Legend",
        map_info: "Parcel Information",
        layer_parcels: "Cadastral Parcels",
        layer_roads: "Road Network",
        layer_boundary: "Urban Boundary",
        layer_labels: "Labels",
        map_void_dark: "VOID DARK",
        map_geo_sat: "GEO SAT",
        map_topo_map: "TOPO MAP",
        leg_validated: "Validated Parcel",
        leg_pending: "In Progress",
        leg_error: "Topological Error",
        leg_unclassified: "Unclassified",
        map_click_prompt: "Click on a parcel to view attributes",
        // Additional UI
        system_ready: "GEO_INTELLIGENCE_AGENT_01 // READY",
        schema_title: "PostGIS Vector Schema",
        back_to_core: "Return to Core",
        // Automation Systems
        auto_hero_title: "Automation Systems",
        auto_hero_desc: "Unattended geospatial transformations replacing hundreds of manual hours.",
        auto_init_btn: "Initialize Pipeline",
        auto_challenge_title: "The Engineering Challenge",
        auto_massive_data: "Massive Data Ingestion",
        auto_massive_desc: "Our ETL systems process over 50,000 spatial records per batch, achieving 800% faster speeds.",
        // GIS Research
        res_hero_title: "GIS Research Lab",
        res_hero_desc: "Deep exploration into Sentinel-2 imagery classification and predictive modeling.",
        res_raw_data: "RAW_DATA [Sentinel-2]",
        res_neural_layer: "DGZ_NEURAL_LAYER [Classified]",
        res_urban_detect: "Urban Change Detection",
        res_predictive: "Value Prediction Models",
        // QGIS Plugin
        qgis_hero_title: "QGIS Power Tools",
        qgis_hero_desc: "Native desktop GIS mapping fused with automated LADM-COL validation rules.",
        qgis_scan_btn: "Scan Layer Errors",
        qgis_fix_btn: "Auto-Snap Geometries"
    },
    es: {
        nav_home: "Núcleo",
        nav_lab: "Lab Espacial",
        nav_validator: "Centro de Mando",
        nav_map: "Mapa Intel",
        nav_projects: "Activos Técnicos",
        nav_about: "Acerca de",
        nav_contact: "Contacto",
        nav_cv: "Enlace_Bio_Neural",
        lang_switch: "EN",
        back_to_core: "Volver al Núcleo",
        system_status: "NIVEL_SISTEMA: SOBERANO",
        api_connected: "API CONECTADA",
        ai_active: "Groq Llama-3 Activo",
        // Hero
        hero_tag: "// INGENIERÍA_DE_SISTEMAS_ESPACIALES",
        hero_h1: "Automatización de Catastro Multipropósito y Sistemas de Inteligencia Territorial",
        hero_desc: "Ingeniería Geoespacial de Alto Rendimiento y Arquitectura de Sistemas Automatizados.",
        // CV Modal
        cv_close: "SALIR_INTERFAZ",
        cv_label_profile: "Perfil_Personal",
        cv_label_skills: "ADN_Técnico",
        cv_label_langs: "Idiomas",
        cv_label_metrics: "Métricas_Impacto",
        cv_label_edu: "Historia_Académica",
        cv_label_cert: "Credenciales y Cursos",
        cv_label_exp_main: "Misión_Actual",
        cv_label_exp_log: "Log_Profesional",
        cv_download: "Descargar Hoja de Vida (PDF)",
        cv_summary: "Profesional SIG con una visión integral que fusiona la excelencia técnica en Sistemas de Información Geográfica con maestría en arquitectura de bases de datos y desarrollo de software.",
        // Project Specifics
        proj_automation: "Sistemas de Automatización",
        proj_geo_llm: "Inteligencia Geo-LLM",
        proj_gis_dash: "Tablero GIS",
        proj_qgis: "Herramientas QGIS",
        proj_research: "Laboratorio de Investigación",
        // Validator specifics
        val_title: "Centro de Mando de Inteligencia Catastral",
        val_module1: "Motor Topológico",
        val_module1_desc: "Validación topológica estricta sobre cartografía base. Detecta traslapes, slivers y completitud geométrica.",
        val_module2: "Interoperabilidad",
        val_module2_desc: "Sincronización de Base de Datos Catastral (.shp/.gpkg) vs Matriz de Registro SNR (.xlsx) para detectar inconsistencias.",
        val_module3: "Analítica",
        val_module3_desc: "Visualización agregada de la salud cartográfica en tiempo real. Métricas de eficiencia y errores recurrentes.",
        // Map specifics
        map_title: "Lab Espacial — Visor Catastral",
        map_layers: "Capas del Mapa",
        map_basemap: "Mapa Base",
        map_legend: "Leyenda",
        map_info: "Información Predial",
        layer_parcels: "Predios Catastrales",
        layer_roads: "Red Vial",
        layer_boundary: "Límite Urbano",
        layer_labels: "Etiquetas",
        map_void_dark: "OSCURO",
        map_geo_sat: "SATÉLITE",
        map_topo_map: "TOPOGRÁFICO",
        leg_validated: "Validado",
        leg_pending: "En Proceso",
        leg_error: "Fallo Topológico",
        leg_unclassified: "Sin Clasificar",
        map_click_prompt: "Click en un predio para ver atributos",
        // Additional UI
        system_ready: "GEO_INTELLIGENCE_AGENT_01 // LISTO",
        schema_title: "Esquema Vectorial PostGIS",
        back_to_core: "Volver al Núcleo",
        // Automation Systems
        auto_hero_title: "Sistemas de Automatización",
        auto_hero_desc: "Transformaciones geoespaciales desatendidas que reemplazan cientos de horas manuales.",
        auto_init_btn: "Inicializar Pipeline",
        auto_challenge_title: "El Desafío de Ingeniería",
        auto_massive_data: "Ingesta Masiva de Datos",
        auto_massive_desc: "Nuestros sistemas ETL procesan más de 50.000 registros espaciales por lote, logrando velocidades un 800% superiores.",
        // GIS Research
        res_hero_title: "Laboratorio de Investigación GIS",
        res_hero_desc: "Exploración profunda en clasificación de imágenes Sentinel-2 y modelado predictivo.",
        res_raw_data: "DATOS_BRUTOS [Sentinel-2]",
        res_neural_layer: "DGZ_CAPA_NEURAL [Clasificado]",
        res_urban_detect: "Detección de Cambios Urbanos",
        res_predictive: "Modelos Predictivos de Valor",
        // QGIS Plugin
        qgis_hero_title: "Herramientas QGIS",
        qgis_hero_desc: "Cartografía GIS nativa de escritorio fusionada con reglas de validación LADM-COL.",
        qgis_scan_btn: "Escanear Errores",
        qgis_fix_btn: "Auto-Corregir Geometrías"
    }
};

class DGZCore {
    constructor() {
        this.lang = localStorage.getItem('dgz_lang') || 'es';
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.injectHeader();
            this.applyTranslations();
            this.setupListeners();
        });
    }

    injectHeader() {
        // Prevent double injection
        if (document.getElementById('dgz-global-header')) return;

        const header = document.createElement('header');
        header.id = 'dgz-global-header';
        header.className = 'dgz-nav-master';

        const isSubDir = window.location.pathname.includes('/projects/') || window.location.pathname.includes('/lab/');
        const rootPath = isSubDir ? (window.location.pathname.includes('/projects/') ? '../../' : '../') : './';

        header.innerHTML = `
            <div class="nav-blur-bg"></div>
            <div class="nav-content">
                <a href="${rootPath}index.html" class="nav-logo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-electric)" stroke-width="2.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span>DGZ <span class="hide-mobile">ENGINEERING</span></span>
                </a>

                <nav class="nav-links">
                    <a href="${rootPath}index.html" class="nav-link" data-i18n="nav_home">Nucleus</a>
                    <div class="nav-dropdown">
                        <span class="nav-link" data-i18n="nav_lab">Spatial Lab <i class="ph ph-caret-down"></i></span>
                        <div class="dropdown-content">
                            <a href="${rootPath}lab/validator.html" data-i18n="nav_validator">Command Center</a>
                            <a href="${rootPath}lab/map.html" data-i18n="nav_map">Intel Map</a>
                        </div>
                    </div>
                    <div class="nav-dropdown">
                        <span class="nav-link" data-i18n="nav_projects">Assets <i class="ph ph-caret-down"></i></span>
                        <div class="dropdown-content">
                            <a href="${rootPath}projects/geo-llm/index.html" data-i18n="proj_geo_llm">Geo-LLM</a>
                            <a href="${rootPath}projects/automation-systems/index.html" data-i18n="proj_automation">Automation</a>
                            <a href="${rootPath}projects/gis-dashboard/index.html" data-i18n="proj_gis_dash">Dashboard</a>
                            <a href="${rootPath}projects/qgis-plugin/index.html" data-i18n="proj_qgis">QGIS Plugin</a>
                            <a href="${rootPath}projects/research/index.html" data-i18n="proj_research">Research</a>
                        </div>
                    </div>
                </nav>

                <div class="nav-actions">
                    <div class="system-status hide-mobile">
                        <span class="status-dot"></span>
                        <span data-i18n="system_status">SYSTEM_OK</span>
                    </div>
                    <button class="lang-toggle-btn" id="dgz-lang-toggle">
                        <i class="ph ph-globe"></i>
                        <span id="lang-label">${this.lang.toUpperCase() === 'EN' ? 'ES' : 'EN'}</span>
                    </button>
                </div>
            </div>
        `;

        document.body.prepend(header);
        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('dgz-core-styles')) return;
        const style = document.createElement('style');
        style.id = 'dgz-core-styles';
        style.textContent = `
            .dgz-nav-master {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 60px;
                z-index: 9999;
                display: flex;
                align-items: center;
                color: #fff;
            }
            .nav-blur-bg {
                position: absolute;
                inset: 0;
                background: rgba(3, 3, 5, 0.8);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid rgba(0, 229, 255, 0.2);
            }
            .nav-content {
                position: relative;
                width: 100%;
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 1.5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 100%;
            }
            .nav-logo {
                display: flex;
                align-items: center;
                gap: 10px;
                text-decoration: none;
                color: #fff;
                font-weight: 900;
                letter-spacing: 1px;
                font-size: 0.9rem;
            }
            .nav-links {
                display: flex;
                gap: 2rem;
                align-items: center;
            }
            .nav-link {
                text-decoration: none;
                color: rgba(255,255,255,0.7);
                font-family: var(--font-mono, monospace);
                font-size: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                cursor: pointer;
                transition: 0.3s;
                position: relative;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .nav-link:hover, .nav-link.active {
                color: var(--accent-electric, #00e5ff);
            }
            .nav-dropdown {
                position: relative;
            }
            .dropdown-content {
                position: absolute;
                top: 100%;
                left: 0;
                background: #0A0A0F;
                border: 1px solid rgba(0, 229, 255, 0.2);
                border-radius: 8px;
                min-width: 200px;
                padding: 0.5rem;
                opacity: 0;
                visibility: hidden;
                transform: translateY(10px);
                transition: 0.3s;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            }
            .nav-dropdown:hover .dropdown-content {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            .dropdown-content a {
                display: block;
                padding: 0.6rem 1rem;
                color: rgba(255,255,255,0.6);
                text-decoration: none;
                font-size: 0.7rem;
                font-family: var(--font-mono, monospace);
                text-transform: uppercase;
                border-radius: 4px;
            }
            .dropdown-content a:hover {
                background: rgba(0, 229, 255, 0.1);
                color: var(--accent-electric, #00e5ff);
            }
            .nav-actions {
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }
            .system-status {
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: var(--font-mono, monospace);
                font-size: 0.6rem;
                color: rgba(255,255,255,0.4);
            }
            .status-dot {
                width: 6px;
                height: 6px;
                background: #4ade80;
                border-radius: 50%;
                box-shadow: 0 0 10px #4ade80;
            }
            .lang-toggle-btn {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                color: #fff;
                padding: 5px 12px;
                border-radius: 20px;
                cursor: pointer;
                font-family: var(--font-mono, monospace);
                font-size: 0.7rem;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: 0.3s;
            }
            .lang-toggle-btn:hover {
                border-color: var(--accent-electric, #00e5ff);
                background: rgba(0, 229, 255, 0.1);
            }
            @media (max-width: 768px) {
                .hide-mobile { display: none; }
                .nav-links { gap: 1rem; }
            }
        `;
        document.head.appendChild(style);
    }

    setupListeners() {
        const btn = document.getElementById('dgz-lang-toggle');
        if (btn) {
            btn.addEventListener('click', () => {
                this.lang = this.lang === 'en' ? 'es' : 'en';
                localStorage.setItem('dgz_lang', this.lang);
                document.getElementById('lang-label').textContent = this.lang === 'en' ? 'ES' : 'EN';
                this.applyTranslations();
                window.dispatchEvent(new CustomEvent('dgzLangChanged', { detail: this.lang }));
            });
        }
    }

    applyTranslations() {
        const t = dgzTranslations[this.lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });
        document.documentElement.lang = this.lang;
    }
}

// Global instance
window.dgzCore = new DGZCore();
