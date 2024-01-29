<script>
    import { page } from "$app/stores";
    import { derived } from "svelte/store";

    const activePage = derived(page, ($page) => $page.url.pathname);
</script>

<nav class="nav">
    <div class="nav-links">
        <a href="/" class:active={$activePage === "/"}>Home</a>
        <a href="/displayMap" class:active={$activePage === "/displayMap"}
            >Map</a
        >
        <a href="/SpeedChart" class:active={$activePage === "/SpeedChart"}
            >Chart</a
        >
    </div>
    <img src="/logo.png" class="nav-logo" alt="Logo" />
</nav>

<body>
    <main>
        <slot />
    </main>
</body>

<style>
    body {
        margin: 0;
        font-family: Arial, sans-serif;
    }
    .nav {
        background-color: #D3D3D3;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .nav-links a {
        float: left;
        display: block;
        color: black;
        text-align: center;
        padding: 14px 20px;
        text-decoration: none;
    }
    .nav-links a:hover {
        background-color: #ddd;
        color: black;
    }
    .nav-logo {
        height: 50px; 
        margin-right: 20px;
    }
    .active {
        background-color: #555; 
        color: white !important;
    }
</style>
