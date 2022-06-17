<script context="module">
	import { accessToken, deleteCookie, refreshToken, setCookie } from '$lib/cookie';

	export async function load({ session }) {
		const theme = session.user.theme;
		const login = session.user.login;
		return {
			props: {
				theme,
				login
			}
		};
	}
</script>

<script lang="ts">
	import Button from '@smui/button';
	import type { TopAppBarComponentDev } from '@smui/top-app-bar';
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import { Label, Icon } from '@smui/common';
	import { Svg } from '@smui/common/elements';
	import { mdiGithub, mdiLightbulb, mdiLightbulbOff, mdiLogin, mdiLogout } from '@mdi/js';
	import { browser } from '$app/env';
	import Auth from '$lib/components/Auth.svelte';
	import { goto } from '$app/navigation';

	export let theme = typeof window === 'undefined' || 'light';
	$: saveUserTheme(theme);

	function saveUserTheme(theme) {
		if (!browser) return;
		setCookie('theme', theme);
	}

	function switchTheme() {
		if (theme == 'light') {
			theme = 'dark';
		} else {
			theme = 'light';
		}
		location.reload(); // ToDo: need the ability to do without rebooting
	}

	let openAuth = false;
	export let login = typeof window === 'undefined' || 'off';

	function Inlogin() {
		if (login == 'on') {
			deleteCookie(accessToken);
			deleteCookie(refreshToken);
			login = 'off';
			setCookie('login', login);
			location.reload();
		} else {
			openAuth = true;
		}
	}

	let topAppBar: TopAppBarComponentDev;
</script>

<svelte:head>
	<link rel="stylesheet" href="smui.css" media="(prefers-color-scheme: light)" />
	<link rel="stylesheet" href="smui-dark.css" media="(prefers-color-scheme: dark)" />
	{#if theme === 'light'}
		<link rel="stylesheet" href="smui.css" />
	{:else if theme === 'dark'}
		<link rel="stylesheet" href="smui-dark.css" />
	{/if}
</svelte:head>

<TopAppBar bind:this={topAppBar} variant="standard">
	<Row>
		<Section>
			<Title fill="currentColor">
				<Button on:click={() => goto('/')}>
					<Label>Metida</Label>
				</Button>
			</Title>
		</Section>
		<Section align="end" toolbar>
			<Button on:click={() => goto('/blog')}>
				<Label>blog</Label>
			</Button>
			<Button on:click={() => goto('/content')}>
				<Label>content</Label>
			</Button>
			<IconButton aria-label="GitHub" href="https://github.com/Dsmit05/metida">
				<Icon component={Svg} viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiGithub} />
				</Icon>
			</IconButton>
			<IconButton on:click={switchTheme}>
				<Icon component={Svg} viewBox="0 0 24 24">
					<path fill="currentColor" d={theme === 'dark' ? mdiLightbulbOff : mdiLightbulb} />
				</Icon>
			</IconButton>
			<IconButton on:click={Inlogin}>
				<Icon component={Svg} viewBox="0 0 24 24">
					<path fill="currentColor" d={login === 'off' ? mdiLogin : mdiLogout} />
				</Icon>
			</IconButton>
		</Section>
	</Row>
</TopAppBar>

<AutoAdjust {topAppBar} style="justify-content: space-between;">
	<div class="container">
		<slot />
	</div>
</AutoAdjust>

<Auth bind:open={openAuth} />
