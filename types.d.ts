declare module 'vite' {
  export function defineConfig(config: any): any;
}

declare module '@vitejs/plugin-react' {
  export default function react(): any;
}

declare module 'tailwindcss' {
  export interface TailwindConfig {
    content: string[];
    theme: {
      extend: any;
    };
    plugins: any[];
  }
}

declare module 'autoprefixer' {
  export default function autoprefixer(): any;
}

declare module 'tailwindcss/plugin' {
  export default function plugin(callback: any): any;
} 
