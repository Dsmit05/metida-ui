<script lang="ts">
	import Paper, { Content } from '@smui/paper';
	let elevation = 5;
	let color = 'default';
</script>

<div style="padding-top: 3em;">
	<Paper transition {elevation} {color}>
		<Content>
			Greetings, dear friend, it is advisable to raise the API to interact with this project. But
			you can also just try the theme switcher, or other visual elements.
		</Content>
	</Paper>
</div>
