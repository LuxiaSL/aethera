/** The music worklet, bundled on its own and inlined as source (vite.config.ts). */
declare module 'virtual:afterlife-worklet' {
  const source: string;
  export default source;
}
