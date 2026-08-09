const CONFIG_CACHE = new Map();

export async function loadConfig(path) {
    if (CONFIG_CACHE.has(path)) {
        return CONFIG_CACHE.get(path);
    }

    try {
        const module = await import(path);
        const config = module.default;

        CONFIG_CACHE.set(path, config);

        return config;
    } catch (error) {
        console.error(`Failed to load configuration: ${path}`, error);
        return null;
    }
}

export function clearConfigCache() {
    CONFIG_CACHE.clear();
}

export function getCachedConfig(path) {
    return CONFIG_CACHE.get(path) || null;
}
