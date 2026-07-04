export interface Component {
  word: string;
  opposite: string | null;
}

export interface Template {
  id: string;
  structure: string;
  required_components: string[];
  notes?: string;
}

export interface SlotSpec {
  category: string;
  count: number;
  separator: string;
}

export interface GeneratedPrompt {
  hash: string;
  templateId: string;
  /** RNG seed that (with templateId) reproduces this prompt. Absent on old records. */
  seed?: number;
  positive: string;
  negative: string;
  components: Record<string, string[]>;
  createdAt: string;
  favorited: boolean;
}

export interface Palette {
  name: string;
  primary: string;
  bright: string;
  dim: string;
  accent: string;
  border: string;
  borderDim: string;
  negative: string;
  negativeBorder: string;
  rainHead: string;
  rainBright: string;
  rainMid: string;
  rainDim: string;
}

