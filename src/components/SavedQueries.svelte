<script>
import { onMount } from "svelte";
import { deleteQuery, getSavedQueries, saveQuery } from "../lib/savedQueries";

let open = $state(false);
let queries = $state([]);
let name = $state("");
let currentQuery = $state("");
let nameInput = $state(null);

const canSave = $derived(name.trim().length > 0 && currentQuery.length > 0);

onMount(() => {
	queries = getSavedQueries();
	currentQuery = window.location.search.slice(1);

	const onKey = (e) => {
		if (e.key === "Escape") open = false;
	};
	window.addEventListener("keydown", onKey);
	return () => window.removeEventListener("keydown", onKey);
});

function toggleDrawer() {
	open = !open;
	if (open) {
		queueMicrotask(() => nameInput?.focus());
	}
}

function closeDrawer() {
	open = false;
}

function save() {
	if (!canSave) return;
	queries = saveQuery(name.trim(), currentQuery);
	name = "";
}

function remove(id) {
	queries = deleteQuery(id);
}

function restore(query) {
	window.location.href = query ? `/?${query}` : "/";
}

function preview(query) {
	return query.length > 48 ? `${query.slice(0, 48)}…` : query;
}
</script>

<button
	type="button"
	class="fab"
	onclick={toggleDrawer}
	aria-expanded={open}
	aria-controls="saved-drawer"
>
	★ Saved
	{#if queries.length}<span class="count">({queries.length})</span>{/if}
</button>

{#if open}
	<div class="backdrop" onclick={closeDrawer} aria-hidden="true"></div>
{/if}

<aside
	id="saved-drawer"
	class="drawer"
	class:open
	role="dialog"
	aria-modal="true"
	aria-label="Saved queries"
	aria-hidden={!open}
>
	<header class="drawer-head">
		<h2>★ Saved queries</h2>
		<button
			type="button"
			class="icon-btn"
			onclick={closeDrawer}
			aria-label="Close saved queries"
		>
			✕
		</button>
	</header>

	<div class="save-form">
		<input
			bind:this={nameInput}
			bind:value={name}
			type="text"
			placeholder="Name this query…"
			aria-label="Saved query name"
			onkeydown={(e) => e.key === "Enter" && save()}
		/>
		<button type="button" class="save-btn" onclick={save} disabled={!canSave}>
			Save current
		</button>
		{#if !currentQuery}
			<p class="hint">Run a query first, then save it here.</p>
		{/if}
	</div>

	<ul class="query-list">
		{#each queries as q (q.id)}
			<li>
				<button
					type="button"
					class="query-row"
					onclick={() => restore(q.query)}
					title={q.query}
				>
					<span class="q-name">{q.name}</span>
					<span class="q-preview">{preview(q.query)}</span>
				</button>
				<button
					type="button"
					class="icon-btn del"
					onclick={(e) => {
						e.stopPropagation();
						remove(q.id);
					}}
					aria-label={`Delete ${q.name}`}
				>
					🗑
				</button>
			</li>
		{:else}
			<li class="empty">No saved queries yet</li>
		{/each}
	</ul>
</aside>

<style>
	.fab {
		position: fixed;
		top: 16px;
		right: 16px;
		z-index: 100;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 10px 16px;
		border: none;
		border-radius: 3px;
		background-color: #1f1f1f;
		color: #fafafa;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		transition: background-color 0.2s ease, transform 0.2s ease;
	}

	.fab:hover {
		background-color: #333;
		transform: translateY(-1px);
	}

	.fab .count {
		opacity: 0.8;
		font-weight: 500;
	}

	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 90;
		background-color: rgba(0, 0, 0, 0.4);
		animation: fade-in 0.2s ease;
	}

	.drawer {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 110;
		height: 100%;
		width: 340px;
		max-width: 100%;
		background-color: #fff;
		box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
		transform: translateX(100%);
		transition: transform 0.25s ease;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}

	.drawer.open {
		transform: translateX(0);
	}

	.drawer-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px;
		border-bottom: 2px solid #e9ecef;
		background-color: #1f1f1f;
		color: #fafafa;
	}

	.drawer-head h2 {
		margin: 0;
		font-size: 1.1rem;
	}

	.icon-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		border-radius: 3px;
		background: transparent;
		color: inherit;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.drawer-head .icon-btn:hover {
		background-color: rgba(255, 255, 255, 0.15);
	}

	.save-form {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		padding: 16px;
		border-bottom: 1px solid #e9ecef;
		background-color: #f8f9fa;
	}

	.save-form input {
		flex: 1;
		min-width: 140px;
		padding: 10px 12px;
		border: 2px solid #e9ecef;
		border-radius: 3px;
		font-size: 14px;
		transition: border-color 0.2s ease;
	}

	.save-form input:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
	}

	.save-btn {
		padding: 10px 16px;
		border: none;
		border-radius: 2px;
		background-color: #007bff;
		color: #fff;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s ease, transform 0.2s ease;
	}

	.save-btn:hover:not(:disabled) {
		background-color: #0056b3;
		transform: translateY(-1px);
	}

	.save-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.hint {
		width: 100%;
		margin: 0;
		font-size: 13px;
		color: #6c757d;
	}

	.query-list {
		list-style: none;
		margin: 0;
		padding: 8px;
		flex: 1;
	}

	.query-list li {
		display: flex;
		align-items: stretch;
		gap: 4px;
		margin-bottom: 4px;
		border-radius: 3px;
		overflow: hidden;
	}

	.query-list li:hover {
		background-color: #f8f9fa;
	}

	.query-row {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 10px 12px;
		border: none;
		background: transparent;
		text-align: left;
		cursor: pointer;
		font: inherit;
		color: inherit;
	}

	.q-name {
		font-weight: 600;
		font-size: 14px;
		color: #1f1f1f;
	}

	.q-preview {
		font-size: 12px;
		color: #6c757d;
		word-break: break-all;
	}

	.icon-btn.del {
		width: 40px;
		color: #6c757d;
	}

	.icon-btn.del:hover {
		background-color: #f8d7da;
		color: #721c24;
	}

	.empty {
		padding: 24px 12px;
		text-align: center;
		color: #6c757d;
		font-size: 14px;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@media (max-width: 768px) {
		.drawer {
			width: 100%;
		}
	}
</style>
