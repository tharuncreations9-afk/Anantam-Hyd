"""Remove dark background from Anantam logo PNGs, preserving gold gradient."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

PUBLIC = Path(r"D:\VLJ applictions\anantam website\public")
BG = (43, 40, 35)
HARD_CUT = 14.0
SOFT_END = 38.0


def bg_distance(r: int, g: int, b: int) -> float:
    return ((r - BG[0]) ** 2 + (g - BG[1]) ** 2 + (b - BG[2]) ** 2) ** 0.5


def remove_background(src: Path, dest: Path) -> tuple[int, int]:
    img = Image.open(src).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue

            dist = bg_distance(r, g, b)
            if dist <= HARD_CUT:
                pixels[x, y] = (r, g, b, 0)
            elif dist < SOFT_END:
                # Feather anti-aliased edges without crushing gold tones.
                t = (dist - HARD_CUT) / (SOFT_END - HARD_CUT)
                new_a = int(255 * t)
                pixels[x, y] = (r, g, b, new_a)

    img.save(dest, "PNG", optimize=True)
    return width, height


def main() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)

    mark_src = PUBLIC / "logo-mark.png"
    mark_on_dark = PUBLIC / "logo-mark-on-dark.png"
    if mark_src.exists() and not mark_on_dark.exists():
        Image.open(mark_src).save(mark_on_dark, "PNG")

    results: list[tuple[str, tuple[int, int]]] = []

    full_size = remove_background(PUBLIC / "logo.png", PUBLIC / "logo-full.png")
    results.append(("logo-full.png", full_size))

    mark_size = remove_background(mark_src, mark_src)
    results.append(("logo-mark.png", mark_size))

    for name, (w, h) in results:
        print(f"{name}: {w}x{h}")


if __name__ == "__main__":
    main()
