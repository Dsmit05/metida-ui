<script lang="ts">
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Paper, { Content, Title } from '@smui/paper';
	import Textfield from '@smui/textfield';
	import Button, { Label } from '@smui/button';
	import {
		fetchShowBlog,
		RefreshTokenDecorator,
		fetchCreateBlog,
		responseCode
	} from '$lib/components/requests.js';

	let blogID = '';
	let getBlogName = 'example name';
	let getBlogDescription = 'example description';
	let getError = '';

	let putBlogName = '';
	let putBlogDescription = '';
	let putError = '';
	let blogOK = '';

	function ShowBlog() {
		fetchShowBlog(blogID)
			.then((info) => {
				getBlogName = info.data.Name;
				getBlogDescription = info.data.Description;
				getError = '';
			})
			.catch((error) => {
				getError = error;
			});
	}

	function CreateBlog() {
		let f = RefreshTokenDecorator(fetchCreateBlog, putBlogName, putBlogDescription);
		f()
			.then(() => {
				blogOK = 'Blog created';
				putError = '';
			})
			.catch((error) => {
				blogOK = '';
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
		<div class="case-label">Here you can use the blog id to display information:</div>
		<div class="case-label">
			<Textfield variant="outlined" bind:value={blogID} label="ID" />
			<Button style="justify-content: center; align-items: end" action="accept" on:click={ShowBlog}>
				<Label>Search</Label>
			</Button>
		</div>
		{#if !getError}
			<div class="label-cell">
				<Paper color="primary" variant="outlined" class="mdc-theme--primary">
					<Title>{getBlogName}</Title>
					<Content>
						{getBlogDescription}
					</Content>
				</Paper>
			</div>
		{:else}
			<div class="case-label" style="color: red; padding-top: 1em">
				{getError}
			</div>
		{/if}
	</Cell>

	<Cell span={6} style="padding-top: 3em;">
		<div class="case-label">But first, create a new blog:</div>
		<div class="case-label">
			<Textfield style="" variant="outlined" bind:value={putBlogName} label="Name" />
			<Button
				style="justify-content: center; align-items: end"
				action="accept"
				on:click={RefreshTokenDecorator(CreateBlog)}
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
						bind:value={putBlogDescription}
						label="Description"
					/>
				</div>
				{#if !putError}
					<div class="case-label" style="color: green">
						{blogOK}
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
