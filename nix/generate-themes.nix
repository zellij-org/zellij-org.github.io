{
  self,
}:
let pkgs = import self.inputs.nixpkgs {
  inherit system;
};
system = "x86_64-linux";
zellij = self.inputs.zellij.outputs.packages.${system}.zellij;
themes = self.inputs.zellij + "/example/themes";
lib = pkgs.lib;
i3conf = pkgs.writeText "i3config" ''
# i3 config file (v4)
font pango:monospace 8
default_border none
hide_edge_borders both
'';
alacrittyConf = pkgs.writeText "alacrittyConf" ''
{"colors":{"bright":{"black":"0x3e4249","blue":"0x6cb6eb","cyan":"0x5dbbc1","green":"0xa0c980","magenta":"0xd38aea","red":"0xec7279","white":"0xc5cdd9","yellow":"0xdeb974"},"normal":{"black":"0x3e4249","blue":"0x6cb6eb","cyan":"0x5dbbc1","green":"0xa0c980","magenta":"0xd38aea","red":"0xec7279","white":"0xc5cdd9","yellow":"0xdeb974"},"primary":{"background":"0x2c2e34","foreground":"0xc5cdd9"}},"env":{"TERM":"xterm-256color"},"font":{"bold":{"family":"Fira Code","style":"Bold"},"italic":{"family":"Fira Code"},"normal":{"family":"Fira Code"},"size":10},"window":{"dynamic_padding":false,"padding":{"x":0,"y":0}}}
'';
zjLayoutDefault = pkgs.writeText "zjLayoutDefault" ''
---
template:
  direction: Horizontal
  parts:
    - direction: Vertical
      borderless: true
      split_size:
        Fixed: 1
      run:
        plugin:
          location: "zellij:tab-bar"
    - direction: Vertical
      body: true
    - direction: Vertical
      borderless: true
      split_size:
        Fixed: 2
      run:
        plugin:
          location: "zellij:status-bar"
tabs:
  - direction: Vertical
  - direction: Vertical
  - direction: Vertical
    parts:
      - direction: Horizontal
      - parts: 
          - direction: Horizontal
          - direction: Horizontal
ui:
  pane_frames:
    rounded_corners: true
'';
zjLayoutCompact = pkgs.writeText "zjLayoutDefault" ''
---
template:
  direction: Horizontal
  parts:
    - direction: Vertical
      body: true
    - direction: Vertical
      borderless: true
      split_size:
        Fixed: 1
      run:
        plugin:
          location: "zellij:compact-bar"
tabs:
  - direction: Vertical
  - direction: Vertical
  - direction: Vertical
    parts:
      - direction: Horizontal
      - parts: 
          - direction: Horizontal
          - direction: Horizontal
ui:
  rounded_corners:
    true
'';
fontPkgs = [
        pkgs.nerdfonts
        pkgs.fira-code-symbols
        pkgs.fira-code
        pkgs.powerline-fonts
];
in
  pkgs.nixosTest {
    name = "generate-themes";

    nodes.machine = {pkgs, ... }: {
      imports = [
        (self.inputs.nixpkgs + "/nixos/tests/common/user-account.nix")
        (self.inputs.nixpkgs + "/nixos/tests/common/x11.nix")
      ];
      services.xserver.enable = true;
      services.unclutter.enable = true;
      services.xserver.windowManager.i3.enable = true;
      services.xserver.displayManager.defaultSession = lib.mkForce "none+i3";

      test-support.displayManager.auto.user = "alice";

      environment.systemPackages = [
        zellij
        pkgs.alacritty
        pkgs.killall
      ] ++ fontPkgs;
      fonts.fonts = fontPkgs;
      console.packages = fontPkgs;
      fonts.fontDir.enable = true;
    };

    # virtualisation.memorySize = 2000;

    testScript = 
    ''
    start_all()

    from pathlib import Path 

    with subtest("configure i3"):
      machine.succeed("mkdir -p /home/alice/.config/i3")
      machine.succeed("cp ${i3conf} /home/alice/.config/i3/config")
      machine.wait_for_file("/home/alice/.config/i3/config")

    with subtest("configure alacritty"):
      machine.succeed("mkdir -p /home/alice/.config/alacritty")
      machine.succeed("cp ${alacrittyConf} /home/alice/.config/alacritty/alacritty.yml")
      machine.wait_for_file("/home/alice/.config/alacritty/alacritty.yml")

    with subtest("configure zellij"):
      machine.succeed("mkdir -p /home/alice/.config/zellij/layouts")
      machine.succeed("cp ${zjLayoutDefault} /home/alice/.config/zellij/layouts/default.yaml")
      machine.succeed("cp ${zjLayoutCompact} /home/alice/.config/zellij/layouts/compact.yaml")
      machine.wait_for_file("/home/alice/.config/zellij/layouts/default.yaml")
      machine.wait_for_file("/home/alice/.config/zellij/layouts/compact.yaml")

    with subtest("wait for x"):
      machine.wait_for_x()
      machine.wait_for_file("/home/alice/.Xauthority")
      machine.succeed("xauth merge ~alice/.Xauthority")
      machine.wait_until_succeeds("sudo -u alice i3-msg reload")
      machine.wait_until_succeeds("sudo -u alice i3 border none")

    pathlist = Path('${themes}').glob('*.yaml')

    layouts = [ "default", "compact" ]
    options = [ "--simplified-ui true", ""]

    for path in pathlist:
      for layout in layouts:
        for option in options:
          machine.execute(f"sudo -u alice alacritty --command zellij --config {path} --layout {layout} options --theme {path.stem} {option} >&2 &")
          machine.wait_for_window(r"alice.*?machine")
          machine.sleep(20)
          screenshot_path = path.stem.replace('-','_')
          machine.screenshot(f"{screenshot_path}_{layout}_{option.replace('-','_').replace(' ','_')}_screenshot")
          machine.execute('sudo -u alice zellij ka --yes')
          machine.execute('killall alacritty')
    '';

  }
