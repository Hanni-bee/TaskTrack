<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>TaskTrack</title>
		<meta name="csrf-token" content="{{ csrf_token() }}">
		@viteReactRefresh
		@vite(['resources/js/app.tsx'])
	</head>
	<body class="bg-gray-900 text-white">
		<div id="root"></div>
	</body>
</html>
