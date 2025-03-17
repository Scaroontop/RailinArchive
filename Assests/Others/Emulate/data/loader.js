(async function() {
    const VERSION = '31.6';
    const CONFIG = {
        debug: false,
        paths: {},
        version: VERSION
    };

    // Initialize emulator configuration
    function initEmulatorConfig() {
        const config = {
            gameUrl: EJS_gameUrl,
            startOnLoad: false,
            defaultOptions: {},
            paths: {}
        };

        // Map configuration from global variables
        const configMap = {
            mameCore: 'EJS_mameCore',
            biosUrl: 'EJS_biosUrl',
            gameParentUrl: 'EJS_gameParentUrl',
            gamePatchUrl: 'EJS_gamePatchUrl',
            adUrl: 'EJS_AdUrl',
            paths: 'EJS_paths',
            gameId: 'EJS_gameID',
            netplayUrl: 'EJS_netplayUrl',
            startOnLoad: 'EJS_startOnLoaded',
            system: 'EJS_core',
            oldCores: 'EJS_oldCores',
            loadStateOnStart: 'EJS_loadStateURL',
            defaultMenuOptions: 'EJS_defaultOptions',
            lang: 'EJS_language',
            noAutoAdClose: 'EJS_noAutoCloseAd',
            VirtualGamepadSettings: 'EJS_VirtualGamepadSettings',
            buttons: 'EJS_Buttons',
            settings: 'EJS_Settings',
            cacheLimit: 'EJS_CacheLimit',
            gameName: 'EJS_gameName',
            dataPath: 'EJS_pathtodata',
            mouse: 'EJS_mouse',
            multitap: 'EJS_multitap',
            playerName: 'EJS_playerName',
            cheats: 'EJS_cheats',
            color: 'EJS_color'
        };

        // Apply configurations from global variables
        for (const [key, globalVar] of Object.entries(configMap)) {
            if (typeof window[globalVar] !== 'undefined') {
                config[key] = window[globalVar];
            }
        }

        return config;
    }

    // Load resources (CSS/JS) with version control
    async function loadResources() {
        const isIpad = /Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1;
        const isDebug = typeof EJS_DEBUG_XX !== 'undefined' && EJS_DEBUG_XX === true;
        const isIOS = /(iPad|iPhone|iPod)/gi.test(navigator.userAgent);

        if (isDebug || isIOS || isIpad) {
            await Promise.all([
                loadStyle('emu-css.css'),
                loadScript('emu-main.js'),
                loadScript('emulator.js')
            ]);
        } else {
            await Promise.all([
                loadStyle('emu-css.min.css'),
                loadScript('emulator.min.js')
            ]);
        }
    }

    // Resource loader functions
    function loadStyle(file) {
        return new Promise((resolve, reject) => {
            const css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = getResourcePath(file);
            css.onload = resolve;
            css.onerror = reject;
            document.head.appendChild(css);
        });
    }

    function loadScript(file) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = getResourcePath(file);
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function getResourcePath(file) {
        if (typeof EJS_paths !== 'undefined' && typeof EJS_paths[file] === 'string') {
            return EJS_paths[file];
        }
        if (typeof EJS_pathtodata !== 'undefined') {
            return `${EJS_pathtodata.endsWith('/') ? EJS_pathtodata : EJS_pathtodata + '/'}${file}?v=${VERSION}`;
        }
        return `${file}?v=${VERSION}`;
    }

    // Version check for development
    async function checkVersion() {
        if (CONFIG.debug || (window.location && ['localhost', '127.0.0.1'].includes(location.hostname))) {
            try {
                const response = await fetch('https://raw.githack.com/EmulatorJS/EmulatorJS/main/data/version.json');
                if (response.ok) {
                    const version = await response.json();
                    if (parseFloat(VERSION) < version.current_version) {
                        console.warn(`Using EmulatorJS version ${VERSION}. Update available: ${version.current_version}`);
                        console.warn('Visit https://github.com/EmulatorJS/EmulatorJS to update');
                    }
                }
            } catch (error) {
                console.warn('Could not check for updates:', error);
            }
        }
    }

    // Initialize emulator
    try {
        await checkVersion();
        await loadResources();
        const config = initEmulatorConfig();
        window.EJS_emulator = await new EJS(EJS_player, config);
        
        if (typeof EJS_onGameStart === 'function') {
            window.EJS_emulator.on('start-game', EJS_onGameStart);
        }
    } catch (error) {
        console.error('Failed to initialize emulator:', error);
    }
})();
