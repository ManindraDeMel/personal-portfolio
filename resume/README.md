# Resume

Source for the editorial-themed single-page resume served at `/assets/ManindradeMelResume.pdf`.

## Compile

```
xelatex resume.tex
```

Run twice if you change anchors/refs. Output: `resume.pdf`.

## Fonts

The preamble tries Helvetica Neue → Helvetica → Inter → Arial → Segoe UI for the display face, and JetBrains Mono → DejaVu Sans Mono → Consolas → Courier New for the mono face. Whichever exists on the host machine wins. To match the website most closely, install Helvetica Neue and JetBrains Mono.

## Updating the public PDF

After recompiling, copy the result into `public/assets/` so the website link picks it up:

```
cp resume.pdf ../public/assets/ManindradeMelResume.pdf
```
