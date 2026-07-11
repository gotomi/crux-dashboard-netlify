export type SavedQuery = {
	id: string;
	name: string;
	query: string;
	createdAt: number;
};

const STORAGE_KEY = "crux:savedQueries";

function readStore(): SavedQuery[] {
	if (typeof localStorage === "undefined") return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function writeStore(queries: SavedQuery[]): void {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(queries));
}

export function getSavedQueries(): SavedQuery[] {
	return readStore();
}

export function saveQuery(name: string, query: string): SavedQuery[] {
	const queries = readStore();
	const entry: SavedQuery = {
		id: crypto.randomUUID(),
		name,
		query,
		createdAt: Date.now(),
	};
	const next = [entry, ...queries];
	writeStore(next);
	return next;
}

export function deleteQuery(id: string): SavedQuery[] {
	const next = readStore().filter((q) => q.id !== id);
	writeStore(next);
	return next;
}
