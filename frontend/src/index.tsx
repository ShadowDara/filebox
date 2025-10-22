import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import './style.css';

export function App() {
	return (
		<LocationProvider>
			<Header />
			<main>
				<Router>
					<Route path="/" component={Home} />
					<Route default component={NotFound} />
				</Router>
			</main>
		</LocationProvider>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}

export async function pagelink(): Promise<string> {
    try {
        const response = await fetch("/api/get_download_website_path");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: { site: string; port: number } = await response.json();

        // Erstelle die vollständige URL
        return `http://${data.site}:${data.port}`;
    } catch (error) {
        console.error("Failed to fetch page link:", error);
        return "http://127.0.0.1:5477"; // Fallback
    }
}
