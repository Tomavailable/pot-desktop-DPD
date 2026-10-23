export const invoke = async (cmd, args) => {
    console.log(`[Tauri Mock] invoke: ${cmd}`, args);
    if (cmd === 'open_devtools') return;
    return null;
};

export const appWindow = {
    label: 'translate',
    close: async () => {},
    hide: async () => {},
    show: async () => {},
    setSize: async () => {},
    center: async () => {},
    setAlwaysOnTop: async () => {},
    setTitle: async () => {},
};

export const currentMonitor = async () => ({
    size: { width: 1920, height: 1080 },
    position: { x: 0, y: 0 },
    scaleFactor: 1,
});

export const convertFileSrc = (url) => url;

export const event = {
    listen: async () => () => {},
    emit: async () => {},
};
export const listen = async () => () => {};
export const emit = async () => {};

export const path = {
    appConfigDir: async () => '/config',
    appCacheDir: async () => '/cache',
    appLogDir: async () => '/log',
    appDataDir: async () => '/data',
    join: async (...args) => args.join('/'),
};
export const appConfigDir = path.appConfigDir;
export const appCacheDir = path.appCacheDir;
export const appLogDir = path.appLogDir;
export const appDataDir = path.appDataDir;
export const join = path.join;

export const BaseDirectory = {
    App: 0,
    Cache: 1,
    Config: 2,
    Data: 3,
    Desktop: 4,
    Document: 5,
    Download: 6,
    Executable: 7,
    Font: 8,
    Home: 9,
    LocalData: 10,
    Log: 11,
    Picture: 12,
    Public: 13,
    Resource: 14,
    Runtime: 15,
    Template: 16,
    Video: 17,
};

export const exists = async () => false;
export const readDir = async () => [];
export const removeDir = async () => {};
export const createDir = async () => {};
export const writeFile = async () => {};

export const fs = {
    readTextFile: async () => '{}',
    readBinaryFile: async () => new Uint8Array(),
    writeTextFile: async () => {},
    writeBinaryFile: async () => {},
    exists,
    readDir,
    removeDir,
    createDir,
    writeFile,
    BaseDirectory,
};
export const readTextFile = fs.readTextFile;
export const readBinaryFile = fs.readBinaryFile;
export const writeTextFile = fs.writeTextFile;
export const writeBinaryFile = fs.writeBinaryFile;

export const fetch = async (url, options) => {
    return window.fetch(url, options);
};

export const Body = {
    json: (d) => JSON.stringify(d),
    text: (t) => t,
    form: (f) => f,
};

export const http = {
    fetch,
    Body,
};

export const type = async () => 'Linux';
export const arch = async () => 'x86_64';
export const version = async () => '22.04';
export const getVersion = async () => '3.0.7';

export const checkUpdate = async () => ({ shouldUpdate: false });
export const installUpdate = async () => {};

export const relaunch = async () => {};
export const exit = async () => {};

export const readText = async () => '';
export const writeText = async () => {};

export const sendNotification = async () => {};

export const open = async (url) => {
    if (typeof url === 'string') {
        window.open(url, '_blank');
    }
    return null;
};

export const register = async () => {};
export const unregister = async () => {};
export const isRegistered = async () => false;

export const save = async () => null;
export const message = async () => {};
export const ask = async () => true;
export const confirm = async () => true;
