<script lang="ts">
    import { authClient } from "$lib/authClient";
    import * as m from "$lib/paraglide/messages.js";
    import Button from "$lib/components/Button.svelte";
    import { colorState } from "$lib/color.svelte";
    import { goto } from "$app/navigation";
    import { localizeHref } from "$lib/paraglide/runtime";

    let email = $state("");
    let password = $state("");
    let error = $state("");
    let loading = $state(false);

    let color = $derived(colorState.color);

    const textVariants: Record<string, string> = {
        blue: 'text-tacos-blue-2',
        green: 'text-tacos-green-2',
        pink: 'text-tacos-pink-2',
        purple: 'text-tacos-purple-2',
        teal: 'text-tacos-teal-2'
    };

    const borderVariants: Record<string, string> = {
        blue: 'focus:border-tacos-blue-3 focus:ring-tacos-blue-3/20',
        green: 'focus:border-tacos-green-3 focus:ring-tacos-green-3/20',
        pink: 'focus:border-tacos-pink-3 focus:ring-tacos-pink-3/20',
        purple: 'focus:border-tacos-purple-3 focus:ring-tacos-purple-3/20',
        teal: 'focus:border-tacos-teal-3 focus:ring-tacos-teal-3/20'
    };

    async function handleLogin(e: Event) {
        e.preventDefault();
        loading = true;
        error = "";

        const { data, error: authError } = await authClient.signIn.email({
            email,
            password,
            callbackURL: localizeHref("/")
        });

        if (authError) {
            error = m.login_error();
            loading = false;
        } else {
            // Success is handled by callbackURL, but just in case:
            await goto(localizeHref("/"));
        }
    }
</script>

<svelte:head>
    <title>{m.login_title()} | TaCoStage</title>
</svelte:head>

<div class="flex-1 overflow-y-auto p-6 md:p-12 lg:p-24 bg-white/40">
    <div class="max-w-md mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold mb-8 {textVariants[color]}">
            {m.login_title()}
        </h1>

        <form onsubmit={handleLogin} class="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {#if error}
                <div class="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                    {error}
                </div>
            {/if}

            <div class="space-y-2">
                <label for="email" class="block text-sm font-medium text-gray-700">
                    {m.login_email()}
                </label>
                <input
                    type="email"
                    id="email"
                    bind:value={email}
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all {borderVariants[color]} focus:ring-4"
                    placeholder="name@example.com"
                />
            </div>

            <div class="space-y-2">
                <label for="password" class="block text-sm font-medium text-gray-700">
                    {m.login_password()}
                </label>
                <input
                    type="password"
                    id="password"
                    bind:value={password}
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all {borderVariants[color]} focus:ring-4"
                />
            </div>

            <div class="pt-2">
                <Button type="submit" {color} disabled={loading} variant="primary">
                    <span class="w-full text-center block">
                        {#if loading}
                            ...
                        {:else}
                            {m.login_button()}
                        {/if}
                    </span>
                </Button>
            </div>
        </form>
    </div>
</div>
