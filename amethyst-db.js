import { world } from "@minecraft/server";

function MergeRecursive(obj1, obj2) {
    for (const p in obj2) {
        try {
            obj1[p] = (obj2[p].constructor === Object) ? MergeRecursive(obj1[p], obj2[p]) : obj2[p];
        } catch { obj1[p] = obj2[p]; }
    }
    return obj1;
}

class AmethystTable {
    constructor(tableName = "default", entity = null) {
        this.entity = entity;
        this.table = tableName;
        this.data = [];
        this.load();
    }

    load() {
        const storage = this.entity ?? world;
        try {
            const val = storage.getDynamicProperty(`amethyst:${this.table}`);
            this.data = val ? JSON.parse(val) : [];
        } catch { this.data = []; }
    }

    save() {
        const storage = this.entity ?? world;
        storage.setDynamicProperty(`amethyst:${this.table}`, JSON.stringify(this.data));
    }

    insertDocument(data) {
        const doc = { 
            id: Date.now() + Math.random().toString(36).substr(2, 5), 
            data, 
            createdAt: Date.now(), 
            updatedAt: Date.now() 
        };
        this.data.push(doc);
        this.save();
        return doc;
    }

    findDocuments(query) {
        return this.data.filter(doc => this.matchesQuery(query, doc.data));
    }

    findFirst(query) {
        return this.data.find(doc => this.matchesQuery(query, doc.data)) ?? null;
    }

    matchesQuery(query, data) {
        if (typeof query !== "object" || query === null) return query === data;
        for (const key in query) {
            if (data[key] !== query[key]) return false;
        }
        return true;
    }

    updateFirstDocumentByQuery(query, data) {
        let doc = this.findFirst(query);
        if(!doc) return false;
        const index = this.data.findIndex(d => d.id === doc.id);
        this.data[index].data = (typeof data === "object") ? MergeRecursive(doc.data, data) : data;
        this.data[index].updatedAt = Date.now();
        this.save();
        return true;
    }

    deleteById(id) {
        const index = this.data.findIndex(d => d.id === id);
        if (index === -1) return false;
        this.data.splice(index, 1);
        this.save();
        return true;
    }

    clear() {
        this.data = [];
        this.save();
    }
}

class AmethystDBMain {
    getScore(player, key) {
        const objective = world.scoreboard.getObjective(key);
        try {
            return objective ? (objective.getScore(player) ?? 0) : (player.getDynamicProperty(`score:${key}`) ?? 0);
        } catch { return 0; }
    }

    setScore(player, key, value) {
        const objective = world.scoreboard.getObjective(key);
        if (objective) objective.setScore(player, value);
        player.setDynamicProperty(`score:${key}`, value);
    }

    addScore(player, key, amount = 1) {
        this.setScore(player, key, this.getScore(player, key) + amount);
    }

    table(name) {
        return new AmethystTable(name, null);
    }

    entityTable(name, entity) {
        return new AmethystTable(name, entity);
    }

    hasData(entity, key) {
        return entity.getDynamicProperty(key) !== undefined;
    }
}

export const AmethystDB = new AmethystDBMain();
