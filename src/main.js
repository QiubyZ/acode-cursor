import plugin from "../plugin.json";
let { editor } = editorManager;

class AcodePlugin {
	constructor() {
		this.currentColorIndex = 0;
		this.colors = [
			"#FF5733",
			"#FFBD33",
			"#DBFF33",
			"#85FF33",
			"#33FF57",
			"#33FFBD",
			"#33B5FF",
			"#9133FF",
			"#FF33E3",
			"#FF3366",
		];
	}

	async init() {
		this.injectCSS();
		this.applyCursorColor();
		editor.commands.on("afterExec", this.cycleCursorColor.bind(this));
	}

	injectCSS() {
		const existingStyle = document.getElementById("acode-colorful-cursor-style");

		if (!existingStyle) {
			const styleTag = document.createElement("style");
			styleTag.id = "acode-colorful-cursor-style";
			styleTag.textContent = `
                .ace_cursor {
                    background-color: var(--ace-cursor-color) !important;
                    width: 1px !important;
                    min-width: 1px !important; 
                    max-width: 1px !important;
                    border-radius: 1px !important;
                }
            `;
			document.head.appendChild(styleTag);
		}
	}

	applyCursorColor() {
		const color = this.colors[this.currentColorIndex];
		document.documentElement.style.setProperty("--ace-cursor-color", color);
	}

	cycleCursorColor() {
		this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
		this.applyCursorColor();
	}

	async destroy() {
		editor.commands.off("afterExec", this.cycleCursorColor);
		const styleTag = document.getElementById("acode-colorful-cursor-style");
		if (styleTag) {
			styleTag.remove();
		}
		document.documentElement.style.removeProperty("--ace-cursor-color");
	}
}

if (window.acode) {
	const pluginInstance = new AcodePlugin();
	acode.setPluginInit(plugin.id, async (baseUrl) => {
		if (!baseUrl.endsWith("/")) baseUrl += "/";
		pluginInstance.baseUrl = baseUrl;
		await pluginInstance.init();
	});
	acode.setPluginUnmount(plugin.id, () => pluginInstance.destroy());
}
