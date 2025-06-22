export interface ViewerOptions {
  kiosk?: boolean;
  preset?: string;
  model?: string;
  cameraPosition?: number[] | null;
}

export class Viewer {
  constructor(el: HTMLElement, options: ViewerOptions);
  load(url: string | File, rootPath: string, fileMap: Map<string, File>): Promise<any>;
  clear(): void;
} 