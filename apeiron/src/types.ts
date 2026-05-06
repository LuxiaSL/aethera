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

export const CATEGORY_COLORS: Record<string, string> = {
  subject_form: '#ffffff',
  material_substance: '#ffcc00',
  texture_density: '#00ff41',
  light_behavior: '#00ffff',
  color_logic: '#ff00ff',
  atmosphere_field: '#6688ff',
  phenomenon_pattern: '#ff6644',
  spatial_logic: '#aaffaa',
  scale_perspective: '#ffaa44',
  temporal_state: '#ff88ff',
  setting_location: '#44ffcc',
  medium_render: '#ff8866',
};
