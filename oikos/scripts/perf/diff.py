"""diff.py A B [shots-dir] — compare two shot folders: per image, the mean
absolute difference (0-255), the 99th-percentile channel difference, the share
of pixels differing by more than 8 levels, and a side-by-side
(A | B | |A-B| x8) saved under shots/compare/."""
import sys
from pathlib import Path
from PIL import Image, ImageChops, ImageStat

root = Path(sys.argv[3] if len(sys.argv) > 3 else Path(__file__).parent / "out" / "shots")
a, b = sys.argv[1], sys.argv[2]
out = root / "compare"
out.mkdir(exist_ok=True)
for pa in sorted((root / a).glob("*.png")):
    pb = root / b / pa.name
    if not pb.exists():
        continue
    ia, ib = Image.open(pa).convert("RGB"), Image.open(pb).convert("RGB")
    d = ImageChops.difference(ia, ib)
    mean = sum(ImageStat.Stat(d).mean) / 3
    g = d.convert("L")
    hist = g.histogram()
    total = sum(hist)
    over8 = sum(hist[9:]) / total
    acc, p99 = 0, 0
    for v, n in enumerate(hist):
        acc += n
        if acc >= 0.99 * total:
            p99 = v
            break
    amp = d.point(lambda v: min(255, v * 8))
    w, h = ia.size
    sbs = Image.new("RGB", (w * 3, h))
    sbs.paste(ia, (0, 0)); sbs.paste(ib, (w, 0)); sbs.paste(amp, (2 * w, 0))
    name = f"{a}__vs__{b}__{pa.stem}.png"
    sbs.save(out / name)
    print(f"{pa.stem:14s} mean|d|={mean:6.3f}  p99={p99:3d}  >8 levels: {over8*100:6.2f}%  max={max(e[1] for e in d.getextrema())}  -> compare/{name}")
