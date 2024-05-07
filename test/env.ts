import * as adapter from "glass-easel-miniprogram-adapter";

export const componentEnv = (path: string, f: () => {}) => {
  const env = new adapter.MiniProgramEnv();
  const codeSpace = env.createCodeSpace('', true);
  codeSpace.globalComponentEnv(globalThis, path, f);
  const backend = env.associateBackend();
  const root = backend.createRoot('glass-easel-root', codeSpace, path);
  const placeholder = document.createElement('div');
  document.body.appendChild(placeholder);
  root.attach(document.body as any, placeholder as any);
  return root.getComponent()
};
