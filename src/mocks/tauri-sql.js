export default class Database {
    static async load(url) {
        return new Database(url);
    }
    async execute(query, bindValues) {
        console.log('[SQL Mock] execute', query, bindValues);
        return { rowsAffected: 0, lastInsertId: 0 };
    }
    async select(query, bindValues) {
        console.log('[SQL Mock] select', query, bindValues);
        return [];
    }
}
