<script>
	import Folders from './components/Folders.svelte'
</script>

<div class="navbar bg-secondary justify-content-center">
	<h1 class="text-center">Pokemon Team Builder</h1>
</div>

<!-- TEAM Folders -->
<!-- POKEMONS -->
<div class='container'>
	<Folders/>
</div>

<style>
	@import "https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css";
	h1 {
		color: white;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
	.navbar {
		margin-bottom: 1rem;
	}
</style>