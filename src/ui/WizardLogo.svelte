<script lang="ts">
  let { size = 30 }: { size?: number } = $props();
</script>
<!-- Eigener kleiner Zauberer: spitzer Hut in Akzentfarbe, Sterne, Rauschebart. Farben folgen dem Theme (--p). -->
<svg class="wlogo" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
  <!-- Hut mit abgeknickter Spitze -->
  <path d="M15 30 C20 22 24 12 30 5 C33 2 38 1 42 4 C38 4 36 7 36 11 C38 18 44 24 49 30 Z" fill="var(--p)" />
  <circle cx="42.5" cy="4.5" r="2.6" fill="#ffd54f" />
  <!-- Sterne auf dem Hut -->
  <path d="M27 17 l1.3 2.7 3 .4 -2.2 2 .6 3 -2.7-1.5 -2.7 1.5 .6-3 -2.2-2 3-.4z" fill="#ffd54f" />
  <circle cx="37" cy="23" r="1.4" fill="#ffd54f" />
  <circle cx="33" cy="12" r="1" fill="#ffd54f" />
  <!-- Krempe -->
  <ellipse cx="32" cy="30.5" rx="22" ry="4.5" fill="var(--p)" />
  <ellipse cx="32" cy="29.5" rx="22" ry="3.2" fill="#000" opacity=".12" />
  <!-- Gesicht -->
  <ellipse cx="32" cy="38" rx="10" ry="7.5" fill="#f6c9a1" />
  <!-- Augenbrauen und Augen -->
  <path d="M24.5 34.5 q3-2.5 6 0 M33.5 34.5 q3-2.5 6 0" stroke="#e8e8e8" stroke-width="2.2" fill="none" stroke-linecap="round" />
  <circle cx="27.8" cy="37.3" r="1.5" fill="#2b2118" />
  <circle cx="36.2" cy="37.3" r="1.5" fill="#2b2118" />
  <circle cx="28.3" cy="36.8" r=".5" fill="#fff" />
  <circle cx="36.7" cy="36.8" r=".5" fill="#fff" />
  <!-- Bart -->
  <path d="M20 40 C21 46 24 48 25 52 C27 56 29 61 32 63 C35 61 37 56 39 52 C40 48 43 46 44 40 C40 44 36 43 32 43 C28 43 24 44 20 40 Z" fill="#f2f2f2" stroke="#d4d4d4" stroke-width="1" />
  <!-- Schnurrbart und Nase -->
  <path d="M32 42 C29 40 25 41 23.5 43.5 C27 43.5 29.5 43.5 32 42.8 C34.5 43.5 37 43.5 40.5 43.5 C39 41 35 40 32 42 Z" fill="#fff" stroke="#d4d4d4" stroke-width=".8" />
  <ellipse cx="32" cy="40.2" rx="2.4" ry="2" fill="#e9a27c" />
</svg>

<style>
  .wlogo { flex: none; display: block; }
</style>
