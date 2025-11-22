/// <reference types="vite/client" />

interface Puter {
    ai: {
        chat: (prompt: string) => Promise<any>;
    };
}

interface Window {
    puter: Puter;
}
