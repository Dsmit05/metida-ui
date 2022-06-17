<script lang="ts">
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Textfield from '@smui/textfield';
	import Button, { Label } from '@smui/button';
	import {
		fetchCreateContent,
		fetchShowContent,
		RefreshTokenDecorator,
		responseCode
	} from '$lib/components/requests.js';
	import DataTable, { Body, Cell as DCell, Head, Row } from '@smui/data-table';
	import LinearProgress from '@smui/linear-progress';

	let getContent = {
		id: '',
		name: '',
		description: '',
		userEmail: ''
	};
	let contentID = '';
	let getError = '';

	let putContentName = '';
	let putContentDescription = '';
	let putError = '';
	let ContentOK = '';

	let loaded = true;

	function ShowContent() {
		loaded = false;
		let f = RefreshTokenDecorator(fetchShowContent, contentID, getContent);
		f()
			.then(() => {
				getContent = getContent;
				getError = '';
				loaded = true;
			})
			.catch((error) => {
				if (error.message == responseCode) {
					getError = 'Please log in';
					return;
				}
				getError = error;
			});
	}

	function CreateContent() {
		let f = RefreshTokenDecorator(fetchCreateContent, putContentName, putContentDescription);
		f()
			.then(() => {
				ContentOK = 'Blog created';
				putError = '';
			})
			.catch((error) => {
				ContentOK = '';
				if (error.message == responseCode) {
					putError = 'Please log in';
					return;
				}
				putError = error;
			});
	}
</script>

<LayoutGrid align="center" fixedColumnWidth>
	<Cell span={6} style="padding-top: 3em;">
		<div class="case-label">Search your content:</div>

		<div class="case-label">
			<Textfield variant="outlined" bind:value={contentID} label="ID" />
			<Button
				style="justify-content: center; align-items: end"
				action="accept"
				on:click={ShowContent}
			>
				<Label>Search</Label>
			</Button>
		</div>
		{#if !getError}
			<div style="padding-top: 1em">
				<DataTable table$aria-label="content list" style="width: 100%;">
					<Head>
						<Row>
							<DCell numeric>ID</DCell>
							<DCell>Name</DCell>
							<DCell style="width: 100%;">Description</DCell>
							<DCell>Email</DCell>
						</Row>
					</Head>
					<Body>
						<Row>
							<DCell numeric>{getContent.id}</DCell>
							<DCell>{getContent.name}</DCell>
							<DCell>{getContent.description}</DCell>
							<DCell>{getContent.userEmail}</DCell>
						</Row>
					</Body>
					<LinearProgress
						indeterminate
						bind:closed={loaded}
						aria-label="Data is being loaded..."
						slot="progress"
					/>
				</DataTable>
			</div>
		{:else}
			<div class="case-label" style="color: red; padding-top: 1em">
				{getError}
			</div>
		{/if}
	</Cell>

	<Cell span={6} style="padding-top: 3em;">
		<div class="case-label">But first, create a new content:</div>
		<div class="case-label">
			<Textfield style="" variant="outlined" bind:value={putContentName} label="Name" />
			<Button
				style="justify-content: center; align-items: end"
				action="accept"
				on:click={RefreshTokenDecorator(CreateContent)}
			>
				<Label>Add</Label>
			</Button>
		</div>
		<div class="label-cell">
			<Cell span={6}>
				<div class="label-cell">
					<Textfield
						textarea
						input$maxlength={100}
						style="width: 100%"
						variant="outlined"
						bind:value={putContentDescription}
						label="Description"
					/>
				</div>
				{#if !putError}
					<div class="case-label" style="color: green">
						{ContentOK}
					</div>
				{:else}
					<div class="case-label" style="color: red">
						{putError}
					</div>
				{/if}
			</Cell>
		</div>
	</Cell>
</LayoutGrid>

<style>
	.label-cell {
		padding-top: 1em;
		height: 100px;
		display: flex;
		justify-content: start;
		align-items: start;
	}

	.case-label {
		display: flex;
		height: 50px;
		align-items: start;
		justify-content: start;
	}
</style>
