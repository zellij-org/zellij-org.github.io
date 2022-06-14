{
  description = "Shell for working on the site";

  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.zellij.url = "github:zellij-org/zellij";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";


  outputs = { self, nixpkgs, flake-utils, zellij }:
       flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system}; in
      rec {
        devShell = pkgs.mkShell {
        buildInputs = [
          pkgs.mdbook
          pkgs.hugo
        ];
      };
    }) // {
      nixosModules.generateThemes = import ./nix/generate-themes.nix { inherit self; };
    };
}
