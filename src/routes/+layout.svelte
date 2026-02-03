<script lang="ts">
    import {page} from '$app/state';
    import {locales, localizeHref, setLocale, getLocale} from '$lib/paraglide/runtime';
    import {fade, fly} from 'svelte/transition';
    import './layout.css';
    import {generateColor, getLogo} from "$lib/util";
    import * as m from '$lib/paraglide/messages.js';
    import Button from '$lib/components/Button.svelte';
    import {colorState} from "$lib/color.svelte";

    let {data, children} = $props();
    colorState.color = data.color;
    let color = $derived(colorState.color);

    let mobileMenuOpen = $state(false);

    const bgVariantsDark: Record<string, string> = {
        blue: 'bg-tacos-blue-5',
        green: 'bg-tacos-green-5',
        pink: 'bg-tacos-pink-5',
        purple: 'bg-tacos-purple-5',
        teal: 'bg-tacos-teal-5'
    };
    const bgVariantsLight: Record<string, string> = {
        blue: 'bg-tacos-blue-4/6',
        green: 'bg-tacos-green-4/6',
        pink: 'bg-tacos-pink-4/6',
        purple: 'bg-tacos-purple-4/6',
        teal: 'bg-tacos-teal-4/6'
    };
    const accentVariants: Record<string, string> = {
        blue: 'text-tacos-blue-2',
        green: 'text-tacos-green-2',
        pink: 'text-tacos-pink-2',
        purple: 'text-tacos-purple-2',
        teal: 'text-tacos-teal-2'
    };

    function changeColor() {
        colorState.color = generateColor();
        cookieStore.set({
            name: "color",
            value: colorState.color,
            path: '/',
            expires: Date.now() + 1000 * 60 * 60 * 24,
            sameSite: 'lax'
        })
    }

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }
</script>

<svelte:head>
    <link rel="icon" href={getLogo(color)}/>
</svelte:head>

<div class="flex flex-col h-screen overflow-hidden">
    <!-- Mobile Header with Hamburger -->
    <header class="lg:hidden {bgVariantsDark[color]} border-b-2 border-gray-200 p-4 flex items-center justify-between">
        <a class="flex items-center gap-2" href={localizeHref('/')} aria-label={m.nav_home_aria()}>
            <img class="drop-shadow w-8 h-8" src={getLogo(color)} alt="logo"/>
            <span class="text-xl font-semibold {accentVariants[color]}">{m.tacostage()}</span>
        </a>
        <button
            onclick={toggleMobileMenu}
            class="p-2 rounded hover:bg-black/10 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}>
            <svg class="w-6 h-6 {accentVariants[color]} transition-transform duration-300" class:rotate-90={mobileMenuOpen} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {#if mobileMenuOpen}
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                {:else}
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                {/if}
            </svg>
        </button>
    </header>

    <!-- Mobile Menu Overlay -->
    {#if mobileMenuOpen}
        <div
            class="lg:hidden fixed inset-0 z-50 bg-black/50"
            onclick={closeMobileMenu}
            onkeydown={(e) => e.key === 'Escape' && closeMobileMenu()}
            role="button"
            tabindex="0"
            aria-label="Close menu overlay"
            transition:fade={{ duration: 250 }}></div>
        <div
            class="lg:hidden fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] {bgVariantsDark[color]} overflow-y-auto p-6 shadow-2xl"
            transition:fly={{ x: -320, duration: 300, opacity: 1 }}>
            <div class="flex items-center justify-between mb-6">
                <a class="flex items-center gap-2" href={localizeHref('/')} aria-label={m.nav_home_aria()} onclick={closeMobileMenu}>
                    <img class="drop-shadow w-8 h-8" src={getLogo(color)} alt="logo"/>
                    <span class="text-xl font-semibold {accentVariants[color]}">TaCoStage</span>
                </a>
                <button
                    onclick={closeMobileMenu}
                    class="p-2 rounded hover:bg-black/10 transition-colors"
                    aria-label="Close menu">
                    <svg class="w-6 h-6 {accentVariants[color]}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <!-- Navigation -->
            <div class="mb-8">
                <p class="text-xs font-semibold uppercase tracking-wide opacity-70 mb-3 px-3 {accentVariants[color]}">Navigation</p>
                <nav class="flex flex-col gap-2">
                    <Button variant="secondary" href={localizeHref('/')} active={page.url.pathname === localizeHref('/')}
                            color={color} onclick={closeMobileMenu}>
                        {m.nav_home()}
                    </Button>
                    <Button variant="secondary" href={localizeHref('/contributions')}
                            active={page.url.pathname === localizeHref('/contributions')}
                            color={color} onclick={closeMobileMenu}>
                        {m.nav_contributions()}
                    </Button>
                    <Button variant="secondary" href={localizeHref('/contribute')}
                            active={page.url.pathname === localizeHref('/contribute')}
                            color={color} onclick={closeMobileMenu}>
                        {m.nav_contribute()}
                    </Button>
                    <Button variant="secondary" href={localizeHref('/about')}
                            active={page.url.pathname === localizeHref('/about')} color={color} onclick={closeMobileMenu}>
                        {m.nav_about()}
                    </Button>
                </nav>
            </div>

            <!-- Language Selector -->
            <div class="mb-8">
                <p class="text-xs font-semibold uppercase tracking-wide opacity-70 mb-3 px-3 {accentVariants[color]}">{m.choose_language()}</p>
                <nav class="flex flex-col gap-2">
                    {#each locales as locale}
                        {@const isActive = locale === getLocale()}
                        {@const languageName = locale === 'en' ? 'English' : locale === 'de' ? 'Deutsch' : locale}
                        <Button
                                variant="secondary"
                                active={isActive}
                                onclick={() => { setLocale(locale); closeMobileMenu(); }}
                                ariaPressed={isActive}
                                ariaLabel={`Switch to ${languageName}`}
                                color={color}>
                            {languageName}
                        </Button>
                    {/each}
                </nav>
            </div>

            <!-- Color Changer -->
            <div class="mb-6">
                <p class="text-xs font-semibold uppercase tracking-wide opacity-70 mb-3 px-3 {accentVariants[color]}">{m.change_color()}</p>
                <nav class="flex flex-col gap-2">
                    <Button
                            variant="secondary"
                            onclick={() => { changeColor(); }}
                            ariaLabel={`Change color`}
                            color={color}>
                        {m.new_color()}
                    </Button>
                </nav>
            </div>
        </div>
    {/if}

    <main class="flex flex-1 overflow-hidden">
        <!-- Left Navigation (Desktop) -->
        <aside class="hidden lg:flex flex-2 p-4 border-solid border-r-2 border-gray-200 {bgVariantsDark[color]} flex-col">
            <a class="flex flex-col items-center gap-3 mb-6" href={localizeHref('/')}
               aria-label={m.nav_home_aria()}>
                <span class="text-2xl font-semibold {accentVariants[color]}">TaCoStage</span>
                <img class="drop-shadow w-full h-auto aspect-square" src={getLogo(color)} alt=""/>
            </a>
            <nav class="flex flex-col gap-2">
                <Button variant="secondary" href={localizeHref('/')} active={page.url.pathname === localizeHref('/')}
                        color={color}>
                    {m.nav_home()}
                </Button>
                <Button variant="secondary" href={localizeHref('/contributions')}
                        active={page.url.pathname === localizeHref('/contributions')}
                        color={color}>
                    {m.nav_contributions?.() ?? 'Contributions'}
                </Button>
                <Button variant="secondary" href={localizeHref('/contribute')}
                        active={page.url.pathname === localizeHref('/contribute')}
                        color={color}>
                    {m.nav_contribute?.() ?? 'Contribute'}
                </Button>
                <Button variant="secondary" href={localizeHref('/about')}
                        active={page.url.pathname === localizeHref('/about')} color={color}>
                    {m.nav_about?.() ?? 'About'}
                </Button>
            </nav>
        </aside>

        <!-- Content -->
        <section class="flex-5 overflow-y-auto p-6 md:p-10 {bgVariantsLight[color]}">
            {@render children()}
        </section>

        <!-- Right Decorative Rail (Desktop) -->
        <aside class="hidden lg:block flex-2 p-4 border-solid border-l-2 border-gray-200 {bgVariantsDark[color]}">
            <div class="mb-6">
                <p class="text-xs font-semibold uppercase tracking-wide opacity-70 mb-3 px-3 {accentVariants[color]}">{m.choose_language()}</p>
                <nav class="flex flex-col gap-2">
                    {#each locales as locale}
                        {@const isActive = locale === getLocale()}
                        {@const languageName = locale === 'en' ? 'English' : locale === 'de' ? 'Deutsch' : locale}
                        <Button
                                variant="secondary"
                                active={isActive}
                                onclick={() => setLocale(locale)}
                                ariaPressed={isActive}
                                ariaLabel={`Switch to ${languageName}`}
                                color={color}>
                            {languageName}
                        </Button>
                    {/each}
                </nav>
            </div>
            <div class="mb-6">
                <p class="text-xs font-semibold uppercase tracking-wide opacity-70 mb-3 px-3 {accentVariants[color]}">{m.change_color()}</p>
                <nav class="flex flex-col gap-2">
                    <Button
                            variant="secondary"
                            onclick={() => changeColor()}
                            ariaLabel={`Change color`}
                            color={color}>
                        {m.new_color()}
                    </Button>
                </nav>
            </div>
        </aside>
    </main>
</div>

<div style="display:none">
    {#each locales as locale}
        <a href={localizeHref(page.url.pathname, { locale })}>
            {locale}
        </a>
    {/each}
</div>
