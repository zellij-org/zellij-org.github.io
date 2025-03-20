// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="introduction.html"><strong aria-hidden="true">1.</strong> Introduction</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="installation.html"><strong aria-hidden="true">1.1.</strong> Installation</a></li><li class="chapter-item expanded "><a href="integration.html"><strong aria-hidden="true">1.2.</strong> Integration</a></li><li class="chapter-item expanded "><a href="faq.html"><strong aria-hidden="true">1.3.</strong> FAQ</a></li></ol></li><li class="chapter-item expanded "><a href="commands.html"><strong aria-hidden="true">2.</strong> Commands</a></li><li class="chapter-item expanded "><a href="rebinding-keys.html"><strong aria-hidden="true">3.</strong> Rebinding Keys</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="keybinding-presets.html"><strong aria-hidden="true">3.1.</strong> Keybinding Presets</a></li><li class="chapter-item expanded "><a href="changing-modifiers.html"><strong aria-hidden="true">3.2.</strong> Changing Modifiers</a></li></ol></li><li class="chapter-item expanded "><a href="configuration.html"><strong aria-hidden="true">4.</strong> Configuration</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="options.html"><strong aria-hidden="true">4.1.</strong> Options</a></li><li class="chapter-item expanded "><a href="keybindings.html"><strong aria-hidden="true">4.2.</strong> Keybindings</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="keybindings-modes.html"><strong aria-hidden="true">4.2.1.</strong> Modes</a></li><li class="chapter-item expanded "><a href="keybindings-binding.html"><strong aria-hidden="true">4.2.2.</strong> Binding and Overriding Keys</a></li><li class="chapter-item expanded "><a href="keybindings-keys.html"><strong aria-hidden="true">4.2.3.</strong> Keys</a></li><li class="chapter-item expanded "><a href="keybindings-possible-actions.html"><strong aria-hidden="true">4.2.4.</strong> Possible Actions</a></li><li class="chapter-item expanded "><a href="keybindings-shared.html"><strong aria-hidden="true">4.2.5.</strong> Shared Bindings</a></li></ol></li><li class="chapter-item expanded "><a href="themes.html"><strong aria-hidden="true">4.3.</strong> Themes</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="theme-list.html"><strong aria-hidden="true">4.3.1.</strong> List of Themes</a></li><li class="chapter-item expanded "><a href="legacy-themes.html"><strong aria-hidden="true">4.3.2.</strong> Legacy Themes</a></li></ol></li><li class="chapter-item expanded "><a href="command-line-options.html"><strong aria-hidden="true">4.4.</strong> CLI Configuration</a></li><li class="chapter-item expanded "><a href="migrating-yaml-config.html"><strong aria-hidden="true">4.5.</strong> Migrating from old YAML config files</a></li></ol></li><li class="chapter-item expanded "><a href="controlling-zellij-through-cli.html"><strong aria-hidden="true">5.</strong> Controlling Zellij through the CLI</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="zellij-run.html"><strong aria-hidden="true">5.1.</strong> Zellij Run</a></li><li class="chapter-item expanded "><a href="zellij-edit.html"><strong aria-hidden="true">5.2.</strong> Zellij Edit</a></li><li class="chapter-item expanded "><a href="cli-actions.html"><strong aria-hidden="true">5.3.</strong> Zellij Action</a></li><li class="chapter-item expanded "><a href="zellij-plugin.html"><strong aria-hidden="true">5.4.</strong> Zellij Plugin</a></li><li class="chapter-item expanded "><a href="zellij-pipe.html"><strong aria-hidden="true">5.5.</strong> Zellij Pipe</a></li></ol></li><li class="chapter-item expanded "><a href="layouts.html"><strong aria-hidden="true">6.</strong> Layouts</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="creating-a-layout.html"><strong aria-hidden="true">6.1.</strong> Creating a Layout</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="swap-layouts.html"><strong aria-hidden="true">6.1.1.</strong> Swap Layouts</a></li></ol></li><li class="chapter-item expanded "><a href="layouts-with-config.html"><strong aria-hidden="true">6.2.</strong> Including Configuration in Layouts</a></li><li class="chapter-item expanded "><a href="layout-examples.html"><strong aria-hidden="true">6.3.</strong> Examples</a></li><li class="chapter-item expanded "><a href="migrating-yaml-layouts.html"><strong aria-hidden="true">6.4.</strong> Migrating from old YAML layouts</a></li></ol></li><li class="chapter-item expanded "><a href="plugins.html"><strong aria-hidden="true">7.</strong> Plugins</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="plugin-system-status.html"><strong aria-hidden="true">7.1.</strong> Status of the Plugin System</a></li><li class="chapter-item expanded "><a href="plugin-loading.html"><strong aria-hidden="true">7.2.</strong> Loading Plugins</a></li><li class="chapter-item expanded "><a href="plugin-api.html"><strong aria-hidden="true">7.3.</strong> Plugin API</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="plugin-api-events.html"><strong aria-hidden="true">7.3.1.</strong> Events</a></li><li class="chapter-item expanded "><a href="plugin-api-commands.html"><strong aria-hidden="true">7.3.2.</strong> Commands</a></li><li class="chapter-item expanded "><a href="plugin-api-permissions.html"><strong aria-hidden="true">7.3.3.</strong> Permissions</a></li><li class="chapter-item expanded "><a href="plugin-api-configuration.html"><strong aria-hidden="true">7.3.4.</strong> Configuration</a></li><li class="chapter-item expanded "><a href="plugin-api-file-system.html"><strong aria-hidden="true">7.3.5.</strong> Reading from the Filesystem</a></li><li class="chapter-item expanded "><a href="plugin-api-logging.html"><strong aria-hidden="true">7.3.6.</strong> Logging</a></li><li class="chapter-item expanded "><a href="plugin-api-workers.html"><strong aria-hidden="true">7.3.7.</strong> Workers for Async Tasks</a></li><li class="chapter-item expanded "><a href="plugin-pipes.html"><strong aria-hidden="true">7.3.8.</strong> Pipes for communicating with and between plugins</a></li></ol></li><li class="chapter-item expanded "><a href="plugin-development.html"><strong aria-hidden="true">7.4.</strong> Developing a Plugin</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="plugin-dev-env.html"><strong aria-hidden="true">7.4.1.</strong> Development Environment</a></li><li class="chapter-item expanded "><a href="plugin-lifecycle.html"><strong aria-hidden="true">7.4.2.</strong> Plugin Lifecycle</a></li><li class="chapter-item expanded "><a href="plugin-ui-rendering.html"><strong aria-hidden="true">7.4.3.</strong> Rendering a UI</a></li><li class="chapter-item expanded "><a href="plugin-upgrading.html"><strong aria-hidden="true">7.4.4.</strong> Upgrading and Backwards Compatibility</a></li></ol></li><li class="chapter-item expanded "><a href="plugin-aliases.html"><strong aria-hidden="true">7.5.</strong> Plugin Aliases</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="tab-bar-alias.html"><strong aria-hidden="true">7.5.1.</strong> The tab-bar alias</a></li><li class="chapter-item expanded "><a href="status-bar-alias.html"><strong aria-hidden="true">7.5.2.</strong> The status-bar alias</a></li><li class="chapter-item expanded "><a href="strider-alias.html"><strong aria-hidden="true">7.5.3.</strong> The strider alias</a></li><li class="chapter-item expanded "><a href="compact-bar-alias.html"><strong aria-hidden="true">7.5.4.</strong> The compact-bar alias</a></li><li class="chapter-item expanded "><a href="session-manager-alias.html"><strong aria-hidden="true">7.5.5.</strong> The session-manager alias</a></li><li class="chapter-item expanded "><a href="welcome-screen-alias.html"><strong aria-hidden="true">7.5.6.</strong> The welcome-screen alias</a></li><li class="chapter-item expanded "><a href="filepicker-alias.html"><strong aria-hidden="true">7.5.7.</strong> The filepicker alias</a></li></ol></li><li class="chapter-item expanded "><a href="plugin-examples.html"><strong aria-hidden="true">7.6.</strong> Example Plugins</a></li><li class="chapter-item expanded "><a href="plugin-other-languages.html"><strong aria-hidden="true">7.7.</strong> Developing a Plugin in Other Languages</a></li><li class="chapter-item expanded "><a href="plugin-upgrade-0.38.0.html"><strong aria-hidden="true">7.8.</strong> Plugin Upgrade Guide for version 0.38.0</a></li></ol></li><li class="chapter-item expanded "><a href="session-resurrection.html"><strong aria-hidden="true">8.</strong> Session Resurrection</a></li><li class="chapter-item expanded "><a href="compatibility.html"><strong aria-hidden="true">9.</strong> Compatibility</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
