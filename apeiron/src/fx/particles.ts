import { Vec3 } from '../math/vec';
import { clamp, fastSin } from '../math/lut';
import { fnv1a } from '../hash';

export interface Particle {
  pos: Vec3;
  vel: Vec3;
  life: number;
  brightness: number;
  char: string;
}

function randomOnShell(rMin = 1.5, rMax = 3.0): Vec3 {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(Math.random() * 2 - 1);
  const r = rMin + Math.random() * (rMax - rMin);
  const sp = Math.sin(phi);
  return new Vec3(r * sp * Math.cos(theta), r * sp * Math.sin(theta), r * Math.cos(phi));
}

function gauss(mean: number, std: number): number {
  const u1 = Math.random() || 1e-10;
  const u2 = Math.random();
  return mean + std * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function pick(s: string): string { return s[(Math.random() * s.length) | 0]; }

export class ParticleSystem {
  particles: Particle[] = [];
  private spawnAccum = 0;

  constructor(public maxParticles: number = 100, public spawnRate: number = 2) {}

  tick(dt: number): void {
    dt = Math.max(dt, 0);
    this.particles = this.particles.filter(p => {
      p.life -= dt * 0.3;
      if (p.life <= 0) return false;
      this.updateParticle(p, dt);
      return true;
    });
    this.spawnAccum += this.spawnRate * dt;
    while (this.spawnAccum >= 1 && this.particles.length < this.maxParticles) {
      this.particles.push(this.spawn());
      this.spawnAccum -= 1;
    }
    this.spawnAccum = Math.min(this.spawnAccum, 3);
  }

  protected spawn(): Particle {
    return { pos: randomOnShell(), vel: new Vec3(0, 0, 0), life: 1, brightness: 1, char: '·' };
  }

  protected updateParticle(p: Particle, _dt: number): void {
    p.brightness = clamp(p.life, 0, 1);
  }
}

class FogSystem extends ParticleSystem {
  protected spawn(): Particle {
    const pos = randomOnShell(1.5, 3);
    return {
      pos: new Vec3(pos.x, -Math.abs(pos.y) * 0.8, pos.z),
      vel: new Vec3(Math.random() * 0.04 - 0.02, 0.05 + Math.random() * 0.1, Math.random() * 0.04 - 0.02),
      life: 0.6 + Math.random() * 0.4, brightness: 0.2 + Math.random() * 0.3, char: pick('░▒'),
    };
  }
}

class SmokeSystem extends ParticleSystem {
  protected spawn(): Particle {
    return {
      pos: randomOnShell(1.5, 2.5),
      vel: new Vec3(Math.random() * 0.2 - 0.1, 0.08 + Math.random() * 0.12, Math.random() * 0.2 - 0.1),
      life: 0.5 + Math.random() * 0.5, brightness: 0.3 + Math.random() * 0.4, char: pick('·∙°'),
    };
  }
  protected updateParticle(p: Particle, dt: number): void {
    p.vel = p.vel.add(new Vec3(gauss(0, 0.15), gauss(0, 0.08), gauss(0, 0.15)).scale(dt));
    p.pos = p.pos.add(p.vel.scale(dt));
    p.brightness = clamp(p.life * 0.7, 0, 1);
  }
}

class DustSystem extends ParticleSystem {
  protected spawn(): Particle {
    return {
      pos: randomOnShell(1.5, 3),
      vel: new Vec3(gauss(0, 0.01), gauss(0, 0.01), gauss(0, 0.01)),
      life: 0.7 + Math.random() * 0.3, brightness: 0.1 + Math.random() * 0.2, char: pick('·∙'),
    };
  }
  protected updateParticle(p: Particle, dt: number): void {
    p.vel = new Vec3(gauss(0, 0.03), gauss(0, 0.03), gauss(0, 0.03));
    p.pos = p.pos.add(p.vel.scale(dt));
    p.brightness = Math.random() < 0.02 ? clamp(0.6 + Math.random() * 0.4, 0, 1) : clamp(p.life * 0.3, 0, 1);
  }
}

class EmberSystem extends ParticleSystem {
  protected spawn(): Particle {
    const pos = randomOnShell(1, 2);
    return {
      pos: new Vec3(pos.x, -Math.abs(pos.y), pos.z),
      vel: new Vec3(Math.random() * 0.1 - 0.05, 0.5 + Math.random() * 0.7, Math.random() * 0.1 - 0.05),
      life: 0.5 + Math.random() * 0.5, brightness: 1, char: pick('·∙•'),
    };
  }
  protected updateParticle(p: Particle, dt: number): void {
    const d = 0.92;
    p.vel = new Vec3(p.vel.x * d, p.vel.y * d, p.vel.z * d);
    p.pos = p.pos.add(p.vel.scale(dt));
    p.brightness = clamp(p.life, 0, 1);
    if (p.life < 0.3) p.char = '·';
    else if (p.life < 0.6) p.char = '∙';
  }
}

class RainSystem extends ParticleSystem {
  protected spawn(): Particle {
    return {
      pos: new Vec3(Math.random() * 6 - 3, 2.5 + Math.random() * 1.5, Math.random() * 6 - 3),
      vel: new Vec3(Math.random() * 0.04 - 0.02, -1.5 - Math.random(), Math.random() * 0.04 - 0.02),
      life: 0.4 + Math.random() * 0.4, brightness: 0.5 + Math.random() * 0.5, char: pick('│:'),
    };
  }
  protected updateParticle(p: Particle, dt: number): void {
    p.pos = p.pos.add(p.vel.scale(dt));
    p.brightness = clamp(p.life * 0.8, 0, 1);
  }
}

class SnowSystem extends ParticleSystem {
  protected spawn(): Particle {
    return {
      pos: new Vec3(Math.random() * 6 - 3, 2.5 + Math.random() * 1.5, Math.random() * 4 - 2),
      vel: new Vec3(Math.random() * 0.2 - 0.1, -0.15 - Math.random() * 0.25, Math.random() * Math.PI * 2),
      life: 0.6 + Math.random() * 0.4, brightness: 0.4 + Math.random() * 0.4, char: pick('·*'),
    };
  }
  protected updateParticle(p: Particle, dt: number): void {
    const phase = p.vel.z + dt * 2;
    p.vel = new Vec3(p.vel.x, p.vel.y, phase);
    const lateral = fastSin(phase) * 0.3;
    p.pos = new Vec3(p.pos.x + (p.vel.x + lateral) * dt, p.pos.y + p.vel.y * dt, p.pos.z);
    p.brightness = clamp(p.life * 0.6, 0, 1);
  }
}

class SporeSystem extends ParticleSystem {
  protected spawn(): Particle {
    return {
      pos: randomOnShell(1.5, 2.5),
      vel: new Vec3(0, 0, 0),
      life: 0.7 + Math.random() * 0.3, brightness: 0.2 + Math.random() * 0.4, char: pick('·∘○'),
    };
  }
  protected updateParticle(p: Particle, dt: number): void {
    p.pos = p.pos.add(new Vec3(gauss(0, 0.05), gauss(0, 0.05), gauss(0, 0.05)).scale(dt));
    p.brightness = clamp(p.life * 0.5, 0, 1);
  }
}

class DataSystem extends ParticleSystem {
  private static HEX = '0123456789abcdef';
  protected spawn(): Particle {
    return {
      pos: new Vec3(Math.random() * 6 - 3, 2.5 + Math.random() * 1.5, Math.random() * 4 - 2),
      vel: new Vec3(0, -0.5 - Math.random(), 0),
      life: 0.3 + Math.random() * 0.5, brightness: 0.5 + Math.random() * 0.5, char: pick(DataSystem.HEX),
    };
  }
  protected updateParticle(p: Particle, dt: number): void {
    p.pos = p.pos.add(p.vel.scale(dt));
    p.brightness = clamp(p.life, 0, 1);
    if (Math.random() < 0.15) p.char = pick(DataSystem.HEX);
  }
}

type Factory = () => ParticleSystem;
const FACTORIES: [string, Factory][] = [
  ['fog', () => new FogSystem(80, 15)],
  ['smoke', () => new SmokeSystem(60, 12)],
  ['dust', () => new DustSystem(40, 8)],
  ['ember', () => new EmberSystem(50, 15)],
  ['rain', () => new RainSystem(100, 30)],
  ['snow', () => new SnowSystem(50, 10)],
  ['spore', () => new SporeSystem(30, 6)],
  ['data', () => new DataSystem(60, 20)],
];

const KEYWORD_MAP: Record<string, number> = {
  fog: 0, smoke: 1, dust: 2, 'dust motes': 2, ember: 3, embers: 3,
  rain: 4, snow: 5, spore: 6, spores: 6, data: 7, 'data stream': 7,
};

export function particleSystemForWord(word: string): ParticleSystem {
  const key = word.toLowerCase().trim();
  let idx = KEYWORD_MAP[key];
  if (idx === undefined) idx = fnv1a(key) % FACTORIES.length;
  return FACTORIES[idx][1]();
}
