{
  description = "Shell for working on the site";

  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.flake-compat.url = "github:edolstra/flake-compat";
  inputs.flake-compat.flake = false;

  outputs = { self, nixpkgs, flake-utils, flake-compat}:
       flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system}; in
      rec {
        devShell = pkgs.mkShell {
        buildInputs = [
          pkgs.mdbook
          pkgs.hugo
        ];
      };
      });
}
