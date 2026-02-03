<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { colorState } from "$lib/color.svelte";
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let color = $derived(colorState.color);

	const accentVariants: Record<string, string> = {
		blue: 'text-tacos-blue-2',
		green: 'text-tacos-green-2',
		pink: 'text-tacos-pink-2',
		purple: 'text-tacos-purple-2',
		teal: 'text-tacos-teal-2'
	};

	const borderVariants: Record<string, string> = {
		blue: 'border-tacos-blue-3',
		green: 'border-tacos-green-3',
		pink: 'border-tacos-pink-3',
		purple: 'border-tacos-purple-3',
		teal: 'border-tacos-teal-3'
	};

	const bgVariants: Record<string, string> = {
		blue: 'bg-tacos-blue-4/10',
		green: 'bg-tacos-green-4/10',
		pink: 'bg-tacos-pink-4/10',
		purple: 'bg-tacos-purple-4/10',
		teal: 'bg-tacos-teal-4/10'
	};

	const typeLabels: Record<string, string> = {
		talk: m.option_talk?.() ?? 'Talk',
		workshop: m.option_workshop?.() ?? 'Workshop',
		lightning: m.option_lightning?.() ?? 'Lightning Talk',
		other: m.option_other?.() ?? 'Other'
	};

	const statusColors: Record<string, string> = {
		approved: 'bg-green-100 text-green-800 border-green-200',
		pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
		rejected: 'bg-red-100 text-red-800 border-red-200'
	};

	function formatDate(dateString: Date) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Group contributions by type
	const groupedContributions = $derived(() => {
		const groups: Record<string, typeof data.contributions> = {
			talk: [],
			workshop: [],
			lightning: [],
			other: []
		};

		data.contributions.forEach(contribution => {
			const type = contribution.type.toLowerCase();
			if (groups[type]) {
				groups[type].push(contribution);
			} else {
				groups.other.push(contribution);
			}
		});

		return groups;
	});
</script>

<svelte:head>
	<title>Contributions - TaCoStage</title>
	<style>
		@media print {
			/* Hide navigation and non-essential elements when printing */
			aside, header, .no-print {
				display: none !important;
			}

			/* Ensure proper page breaks */
			.contribution-card {
				page-break-inside: avoid;
			}

			/* Adjust colors for print */
			body {
				background: white !important;
			}

			.print-title {
				color: black !important;
			}
		}
	</style>
</svelte:head>

<section class="max-w-5xl mx-auto">
	<!-- Header -->
	<div class="mb-8 print:mb-6">
		<h1 class="text-4xl font-bold mb-3 print-title {accentVariants[color]}">
			{data.session ? 'Contributions Management' : 'Confirmed Contributions'}
		</h1>
		<p class="text-gray-700 text-lg print:text-base">
			TaCoS 2026 in Heidelberg
		</p>
		<button
			onclick={() => window.print()}
			class="mt-4 px-4 py-2 bg-white/70 backdrop-blur rounded-lg border border-gray-300 hover:bg-white/90 transition-colors no-print">
			🖨️ Print Schedule
		</button>
	</div>

	{#if data.contributions.length === 0}
		<div class="rounded-3xl bg-white/70 backdrop-blur p-10 shadow-lg border border-white/60 text-center">
			<p class="text-gray-600 text-lg">
				{data.session ? 'No contributions found in the database.' : 'No confirmed contributions yet. Check back soon!'}
			</p>
		</div>
	{:else}
		<!-- Statistics -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 no-print">
			<div class="rounded-2xl bg-white/70 backdrop-blur p-4 shadow-sm border border-white/60 text-center">
				<div class="text-3xl font-bold {accentVariants[color]}">{groupedContributions().talk.length}</div>
				<div class="text-sm text-gray-600 mt-1">Talks</div>
			</div>
			<div class="rounded-2xl bg-white/70 backdrop-blur p-4 shadow-sm border border-white/60 text-center">
				<div class="text-3xl font-bold {accentVariants[color]}">{groupedContributions().workshop.length}</div>
				<div class="text-sm text-gray-600 mt-1">Workshops</div>
			</div>
			<div class="rounded-2xl bg-white/70 backdrop-blur p-4 shadow-sm border border-white/60 text-center">
				<div class="text-3xl font-bold {accentVariants[color]}">{groupedContributions().lightning.length}</div>
				<div class="text-sm text-gray-600 mt-1">Lightning Talks</div>
			</div>
			<div class="rounded-2xl bg-white/70 backdrop-blur p-4 shadow-sm border border-white/60 text-center">
				<div class="text-3xl font-bold {accentVariants[color]}">{data.contributions.length}</div>
				<div class="text-sm text-gray-600 mt-1">Total</div>
			</div>
		</div>

		<!-- Contributions by Type -->
		{#each Object.entries(groupedContributions()) as [type, items]}
			{#if items.length > 0}
				<div class="mb-10 print:mb-8">
					<h2 class="text-2xl font-bold mb-4 {accentVariants[color]} print:text-xl print:mb-3">
						{typeLabels[type]} ({items.length})
					</h2>

					<div class="grid gap-6 print:gap-4">
						{#each items as contribution}
							<article class="contribution-card rounded-2xl bg-white/70 backdrop-blur p-6 shadow-md border-l-4 {borderVariants[color]} print:shadow-none print:border print:border-gray-300 print:p-4">
								<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4 print:mb-2">
									<div class="flex-1">
										<h3 class="text-xl font-semibold mb-1 print:text-lg">
											{contribution.title}
										</h3>
										<p class="text-sm text-gray-600">
											by <span class="font-medium">{contribution.name}</span>
										</p>
									</div>
									<div class="flex items-center gap-2">
										{#if data.session}
											<div class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border {statusColors[contribution.status]} no-print">
												{contribution.status}
											</div>
										{/if}
										<div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {bgVariants[color]} {accentVariants[color]} print:border print:border-gray-400">
											{typeLabels[contribution.type.toLowerCase()] || contribution.type}
										</div>
									</div>
								</div>

								<div class="prose prose-sm max-w-none">
									<p class="text-gray-700 leading-relaxed whitespace-pre-wrap print:text-sm">
										{contribution.abstract}
									</p>
								</div>

								<div class="mt-4 pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
									<div class="text-xs text-gray-500 print:text-xs">
										Submitted on {formatDate(contribution.createdAt)}
									</div>

									{#if data.session}
										<div class="flex items-center gap-2 no-print">
											{#if contribution.status !== 'approved'}
												<form method="POST" action="?/updateStatus">
													<input type="hidden" name="id" value={contribution.id} />
													<input type="hidden" name="status" value="approved" />
													<button class="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors">
														Approve
													</button>
												</form>
											{/if}
											
											{#if contribution.status !== 'rejected'}
												<form method="POST" action="?/updateStatus">
													<input type="hidden" name="id" value={contribution.id} />
													<input type="hidden" name="status" value="rejected" />
													<button class="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors">
														Reject
													</button>
												</form>
											{/if}

											{#if contribution.status !== 'pending'}
												<form method="POST" action="?/updateStatus">
													<input type="hidden" name="id" value={contribution.id} />
													<input type="hidden" name="status" value="pending" />
													<button class="px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors">
														Set to Pending
													</button>
												</form>
											{/if}
										</div>
									{/if}
								</div>
							</article>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	{/if}

	<!-- Footer for print -->
	<div class="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
		<p>TaCoS 2026 • Heidelberg • Generated on {new Date().toLocaleDateString()}</p>
	</div>
</section>

