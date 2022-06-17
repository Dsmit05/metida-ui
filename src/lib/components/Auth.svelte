<script lang="ts">
	import Dialog, { Content } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import CharacterCounter from '@smui/textfield/character-counter';
	import TabBar from '@smui/tab-bar';
	import Tab, { Label as TabL } from '@smui/tab';
	import { fetchSignIn, fetchSignOn } from '$lib/components/requests.js';

	export let open;

	let fetchError = '';
	let email = '';
	let name = '';
	let password = '';

	let active = 'Sign in';

	function SignIn() {
		fetchSignIn(email, password)
			.then(() => {
				location.reload();
				return;
			})
			.catch((error) => {
				fetchError = error;
			});
	}

	function SignOn() {
		fetchSignOn(name, email, password)
			.then(() => {
				location.reload();
				return;
			})
			.catch((error) => {
				fetchError = error;
			});
	}

	// reset the error when switching
	$: if (active) {
		fetchError = '';
	}
</script>

<Dialog
	style="width: 100%"
	bind:open
	aria-labelledby="buttons-title"
	aria-describedby="buttons-content"
	autoStackButtons={false}
>
	<div id="buttons-title" style="padding: 1em 1em 2em 1em">
		<TabBar style="width: 100%;" tabs={['Sign in', 'Sign up']} let:tab bind:active>
			<Tab {tab}>
				<TabL>{tab}</TabL>
			</Tab>
		</TabBar>
	</div>

	{#if active === 'Sign in'}
		<Content style="width: 100%; padding-top: 1em">
			<div>
				<Textfield
					style="width: 100%;"
					helperLine$style="width: 100%;"
					variant="outlined"
					bind:value={email}
					label="email address"
					input$maxlength={50}
				>
					<svelte:fragment slot="helper">
						<HelperText style="width: 100%; padding: 0em 0em 1em 0em"
							><a href="/">Forgot email?</a>
						</HelperText>
					</svelte:fragment>
				</Textfield>
			</div>
			<div>
				<Textfield
					style="width: 100%;"
					helperLine$style="width: 100%;"
					variant="outlined"
					bind:value={password}
					label="password"
					input$maxlength={50}
				>
					<svelte:fragment slot="helper">
						<HelperText><a href="/">Forgot password?</a></HelperText>
					</svelte:fragment>
				</Textfield>
			</div>
		</Content>
	{:else}
		<Content style="width: 100%; padding-top: 1em">
			<div>
				<Textfield
					style="width: 100%;"
					helperLine$style="width: 100%;"
					variant="outlined"
					bind:value={name}
					label="name"
					input$maxlength={20}
				>
					<svelte:fragment slot="helper">
						<CharacterCounter>0 / 20</CharacterCounter>
					</svelte:fragment>
				</Textfield>
			</div>
			<div>
				<Textfield
					style="width: 100%;"
					helperLine$style="width: 100%;"
					variant="outlined"
					bind:value={email}
					label="email address"
					input$maxlength={30}
				>
					<svelte:fragment slot="helper">
						<CharacterCounter>0 / 30</CharacterCounter>
					</svelte:fragment>
				</Textfield>
			</div>
			<div>
				<Textfield
					style="width: 100%;"
					helperLine$style="width: 100%;"
					variant="outlined"
					bind:value={password}
					label="password"
					input$maxlength={24}
				>
					<svelte:fragment slot="helper">
						<CharacterCounter>0 / 24</CharacterCounter>
					</svelte:fragment>
				</Textfield>
			</div>
		</Content>
	{/if}
	<Label>
		<p style="width: 100%; color: red; text-align: center">
			{fetchError}
		</p>
	</Label>
	<Button action="accept" on:click={active === 'Sign in' ? SignIn() : SignOn()}>
		<Label>Done</Label>
	</Button>
</Dialog>
