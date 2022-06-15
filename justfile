themes:
	nix build .#nixosModules.generateThemes
update-themes:
	nix build .#nixosModules.generateThemes
	cp ./result/*  docs/src/img/theme-gallery/
	chown +w  docs/src/img/theme-gallery/*
