import { useEffect, useState } from "react";
import { TOOLS, getToolById, getDefaultTool, type ToolConfig } from "./config/tools-config";
import "./App.css";

function App() {
	const [currentTool, setCurrentTool] = useState<ToolConfig>(getDefaultTool());

	useEffect(() => {
		// Determine tool from URL hash
		const hash = window.location.hash.slice(1);
		const tool = hash ? getToolById(hash) : null;
		
		if (tool) {
			setCurrentTool(tool);
		} else {
			setCurrentTool(getDefaultTool());
		}

		// Watch for hash changes
		const handleHashChange = () => {
			const newHash = window.location.hash.slice(1);
			const newTool = newHash ? getToolById(newHash) : null;
			
			if (newTool) {
				setCurrentTool(newTool);
			} else {
				setCurrentTool(getDefaultTool());
			}
		};

		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, []);

	const handleToolChange = (tool: ToolConfig) => {
		setCurrentTool(tool);
		window.location.hash = tool.id;
	};

	const CurrentToolComponent = currentTool.component;

	return (
		<div className="app-router">
			<nav className="app-nav">
				<div className="app-nav-title">
					<img src="/midnight.png" alt="Midnight" className="app-nav-logo" />
					Midnight DevTools
				</div>
				<div className="app-nav-buttons">
					{TOOLS.map((tool) => (
						<button
							key={tool.id}
							type="button"
							className={`nav-button ${
								currentTool.id === tool.id ? "active" : ""
							}`}
							onClick={() => handleToolChange(tool)}
							title={tool.description}
						>
							{tool.name}
						</button>
					))}
				</div>
			</nav>
			<CurrentToolComponent />
		</div>
	);
}

export default App;
