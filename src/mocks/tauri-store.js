export class Store {
    constructor(path) {
        this.path = path;
        this.data = {};
        this.load();
    }
    async load() {
        try {
            const stored = localStorage.getItem('pot_store_' + (this.path || 'default'));
            if (stored) this.data = JSON.parse(stored);
        } catch {}
    }
    async save() {
        try {
            localStorage.setItem('pot_store_' + (this.path || 'default'), JSON.stringify(this.data));
        } catch {}
    }
    async set(key, value) {
        this.data[key] = value;
        await this.save();
    }
    async get(key) {
        await this.load();
        return this.data[key] !== undefined ? this.data[key] : null;
    }
    async delete(key) {
        delete this.data[key];
        await this.save();
    }
    async has(key) {
        await this.load();
        return key in this.data;
    }
}
