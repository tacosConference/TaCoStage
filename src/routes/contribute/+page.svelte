<script lang="ts">
    import * as m from '$lib/paraglide/messages.js'
    import Button from '$lib/components/Button.svelte'
    import InputField from '$lib/components/InputField.svelte'
    import {colorState} from "$lib/color.svelte";

    // Validation constants (matching server-side)
    const MAX_TITLE_LENGTH = 200;
    const MAX_ABSTRACT_LENGTH = 3000;
    const MAX_NAME_LENGTH = 100;
    const MIN_TITLE_LENGTH = 5;
    const MIN_ABSTRACT_LENGTH = 50;
    const MIN_NAME_LENGTH = 2;

    let type = $state('');
    let title = $state('');
    let abstract = $state('');
    let name = $state('');
    let email = $state('');
    let captcha = $state('');

    let isSubmitting = $state(false);
    let showPopup = $state(false);
    let popupMessage = $state('');
    let popupType = $state<'success' | 'error'>('success');

    let color = $derived(colorState.color)

    // Client-side validation before sending to server
    function validateForm(): string | null {
        if (!type || !title || !abstract || !name || !email || !captcha) {
            return 'All fields are required';
        }

        if (title.trim().length < MIN_TITLE_LENGTH) {
            return `Title must be at least ${MIN_TITLE_LENGTH} characters`;
        }

        if (title.length > MAX_TITLE_LENGTH) {
            return `Title must be at most ${MAX_TITLE_LENGTH} characters`;
        }

        if (abstract.trim().length < MIN_ABSTRACT_LENGTH) {
            return `Abstract must be at least ${MIN_ABSTRACT_LENGTH} characters`;
        }

        if (abstract.length > MAX_ABSTRACT_LENGTH) {
            return `Abstract must be at most ${MAX_ABSTRACT_LENGTH} characters`;
        }

        if (name.trim().length < MIN_NAME_LENGTH) {
            return `Name must be at least ${MIN_NAME_LENGTH} characters`;
        }

        if (name.length > MAX_NAME_LENGTH) {
            return `Name must be at most ${MAX_NAME_LENGTH} characters`;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return 'Please enter a valid email address';
        }

        return null;
    }

    async function submit(e: Event) {
        e.preventDefault()

        if (isSubmitting) return;

        // Client-side validation
        const validationError = validateForm();
        if (validationError) {
            popupType = 'error';
            popupMessage = validationError;
            showPopup = true;
            return;
        }

        isSubmitting = true;

        try {
            const response = await fetch('/api/contributions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    title,
                    abstract,
                    name,
                    email,
                    captcha
                })
            });

            const result = await response.json();

            if (result.success) {
                popupType = 'success';
                popupMessage = result.message || m.submit_success();
                showPopup = true;

                // Reset form on success
                type = '';
                title = '';
                abstract = '';
                name = '';
                email = '';
                captcha = '';
            } else {
                popupType = 'error';
                popupMessage = result.message || m.submit_error();
                showPopup = true;
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            popupType = 'error';
            popupMessage = m.submit_error();
            showPopup = true;
        } finally {
            isSubmitting = false;
        }
    }

    function closePopup() {
        showPopup = false;
    }

    const contributionOptions = [
        {value: 'talk', label: m.option_talk?.() ?? 'Talk'},
        {value: 'workshop_30', label: m.option_workshop_30?.() ?? 'Workshop (30min)'},
        {value: 'workshop_60', label: m.option_workshop_60?.() ?? 'Workshop (1h)'},
        {value: 'lightning', label: m.option_lightning?.() ?? 'Lightning Talk'},
        {value: 'other', label: m.option_other?.() ?? 'Other'}
    ]

    const bgVariants: Record<string, string> = {
        blue: 'bg-tacos-blue-3',
        green: 'bg-tacos-green-3',
        pink: 'bg-tacos-pink-3',
        purple: 'bg-tacos-purple-3',
        teal: 'bg-tacos-teal-3'
    };
</script>

<section class="max-w-3xl mx-auto">
    <div class="rounded-3xl bg-white/70 backdrop-blur p-6 md:p-10 shadow-lg border border-white/60">
        <h1 class="text-3xl font-bold mb-2">{m.contribute_title?.() ?? 'Submit a contribution'}</h1>
        <p class="mb-6 text-gray-700">{m.contribute_intro?.() ?? ''}</p>

        <form class="grid gap-5" onsubmit={submit}>
            <InputField
                    id="type"
                    type="select"
                    color={color}
                    label={m.field_contribution_type?.() ?? 'Type of contribution'}
                    placeholder={m.placeholder_choose_type?.() ?? 'Choose a type'}
                    options={contributionOptions}
                    bind:value={type}
                    required
            />

            <InputField
                    id="title"
                    color={color}
                    label={m.field_contribution_title?.() ?? 'Title of contribution'}
                    placeholder={m.placeholder_title?.() ?? ''}
                    bind:value={title}
                    maxlength={MAX_TITLE_LENGTH}
                    required
            />

            <p class="text-sm text-gray-600">{m.field_contribution_abstract_description?.() ?? ''}</p>
            <InputField
                    id="abstract"
                    type="textarea"
                    color={color}
                    label={m.field_contribution_abstract?.() ?? 'Abstract'}
                    placeholder={m.placeholder_abstract?.() ?? ''}
                    bind:value={abstract}
                    rows={8}
                    maxlength={MAX_ABSTRACT_LENGTH}
                    showWordCount={true}
                    required
            />

            <div class="grid sm:grid-cols-2 gap-5">
                <InputField
                        id="name"
                        color={color}
                        label={m.field_name?.() ?? 'Name'}
                        placeholder={m.placeholder_name()}
                        bind:value={name}
                        maxlength={MAX_NAME_LENGTH}
                        required
                />
                <InputField
                        id="email"
                        type="email"
                        color={color}
                        label={m.field_email()}
                        placeholder={m.placeholder_email()}
                        bind:value={email}
                        required
                />
            </div>

            <InputField
                    id="captcha"
                    color={color}
                    label={m.field_captcha()}
                    placeholder={m.placeholder_captcha()}
                    bind:value={captcha}
                    required
            />

            <div class="pt-2">
                <Button color={color} type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : m.submit()}
                </Button>
            </div>
        </form>
    </div>

</section>

<!-- Popup Notification -->
{#if showPopup}
    <div
            class="fixed inset-0 flex items-center justify-center p-4 bg-black/50"
            onclick={closePopup}
            onkeydown={(e) => e.key === 'Escape' && closePopup()}
            role="button"
            tabindex="0"
            aria-label="Close notification">
    </div>
    <div
            class="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
                class="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full transform transition-all pointer-events-auto">
            <div class="flex items-start gap-4">
                {#if popupType === 'success'}
                    <div class="shrink-0 w-10 h-10 rounded-full {bgVariants[color]} flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                {:else}
                    <div class="shrink-0 w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </div>
                {/if}
                <div class="flex-1">
                    <h3 class="text-lg font-semibold mb-1">
                        {popupType === 'success' ? 'Success!' : 'Error'}
                    </h3>
                    <p class="text-gray-700">{popupMessage}</p>
                </div>
            </div>
            <div class="mt-6 flex justify-end">
                <Button color={color} variant="primary" onclick={closePopup}>
                    Close
                </Button>
            </div>
        </div>
    </div>
{/if}

