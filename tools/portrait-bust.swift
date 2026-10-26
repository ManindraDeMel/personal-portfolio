// Low-poly 3D bust of the person in a portrait, plus the order to simplify it in.
// macOS Vision person segmentation -> largest contour -> drop the stretches that run
// along the frame edges, so only the head-and-shoulders outline remains (no facial
// features). The silhouette is triangulated (Delaunay), inflated by distance from the
// outline, mirrored front/back and capped where the frame cuts it (bottom and sides).
// Usage: swiftc -O tools/portrait-bust.swift -o /tmp/portrait-bust
//        /tmp/portrait-bust <portrait.png> public/assets/img/portrait-bust.json [mask.png]
import Foundation
import Vision
import CoreImage

let a = CommandLine.arguments
guard a.count >= 3, let photo = CIImage(contentsOf: URL(fileURLWithPath: a[1])) else { fatalError("usage: portrait-bust <portrait.png> <out.json> [mask.png]") }
let W = Double(photo.extent.width), H = Double(photo.extent.height)

let seg = VNGeneratePersonSegmentationRequest()
seg.qualityLevel = .accurate
seg.outputPixelFormat = kCVPixelFormatType_OneComponent8
try VNImageRequestHandler(ciImage: photo, options: [:]).perform([seg])
guard let mask = seg.results?.first?.pixelBuffer else { fatalError("no person found") }
let mw = CGFloat(CVPixelBufferGetWidth(mask)), mh = CGFloat(CVPixelBufferGetHeight(mask))
let maskCI = CIImage(cvPixelBuffer: mask).transformed(by: CGAffineTransform(scaleX: CGFloat(W) / mw, y: CGFloat(H) / mh))
if a.count >= 4 {
  try CIContext().writePNGRepresentation(of: maskCI, to: URL(fileURLWithPath: a[3]), format: .RGBA8, colorSpace: CGColorSpaceCreateDeviceRGB())
}
CVPixelBufferLockBaseAddress(mask, .readOnly)
let mbase = CVPixelBufferGetBaseAddress(mask)!.assumingMemoryBound(to: UInt8.self)
let mrb = CVPixelBufferGetBytesPerRow(mask)
func inside(_ x: Double, _ y: Double) -> Bool {
  let mx = min(Int(mw) - 1, max(0, Int(x / W * Double(mw)))), my = min(Int(mh) - 1, max(0, Int(y / H * Double(mh))))
  return mbase[my * mrb + mx] > 127
}

let req = VNDetectContoursRequest()
req.contrastAdjustment = 1.0
req.maximumImageDimension = 900
try VNImageRequestHandler(ciImage: maskCI, options: [:]).perform([req])
guard let obs = req.results?.first else { fatalError("no contours") }
var best: VNContour? = nil
for i in 0..<obs.contourCount { if let c = try? obs.contour(at: i), c.pointCount > (best?.pointCount ?? 0) { best = c } }
guard let outline = try best?.polygonApproximation(epsilon: 0.0012) else { fatalError("no outline") }
let pts = outline.normalizedPoints.map { (Double($0.x) * W, (1 - Double($0.y)) * H) }

// Split wherever the contour hugs the frame edge; keep the runs in between.
let edge = 4.0
func onEdge(_ p: (Double, Double)) -> Bool { p.0 < edge || p.0 > W - edge || p.1 < edge || p.1 > H - edge }
var runs: [[(Double, Double)]] = [], cur: [(Double, Double)] = []
let n = pts.count
let start = pts.firstIndex(where: onEdge) ?? 0          // begin at an edge point so no run wraps around
for k in 0...n {
  let p = pts[(start + k) % n]
  if onEdge(p) { if cur.count > 2 { runs.append(cur) }; cur = [] } else { cur.append(p) }
}
if cur.count > 2 { runs.append(cur) }
print("outline points:", pts.count, "runs:", runs.count)

// ---- 3D bust -------------------------------------------------------------------
// Outline segments (frame-edge stretches excluded) for distance-from-edge.
var segsOut: [((Double, Double), (Double, Double))] = []
for r in runs { for k in 1..<r.count { segsOut.append((r[k - 1], r[k])) } }
func distToOutline(_ p: (Double, Double)) -> Double {
  var best = Double.greatestFiniteMagnitude
  for (u, v) in segsOut {
    let dx = v.0 - u.0, dy = v.1 - u.1, l2 = dx * dx + dy * dy
    let t = l2 > 0 ? max(0, min(1, ((p.0 - u.0) * dx + (p.1 - u.1) * dy) / l2)) : 0
    best = min(best, hypot(p.0 - (u.0 + t * dx), p.1 - (u.1 + t * dy)))
  }
  return best
}
// Points: outline (every ~14px), frame cuts (every ~30px), jittered interior grid.
var P: [(Double, Double)] = []
var isRim: [Bool] = []
var rimRuns: [[Int]] = []
for r in runs {
  var acc = 0.0, ids: [Int] = []
  for (k, p) in r.enumerated() {
    if k > 0 { acc += hypot(p.0 - r[k - 1].0, p.1 - r[k - 1].1) }
    if k == 0 || acc >= 14 { ids.append(P.count); P.append(p); isRim.append(true); acc = 0 }
  }
  rimRuns.append(ids)
}
var bottom: [Int] = []
var bx = 0.0
while bx <= W { if inside(bx, H - 2) { bottom.append(P.count); P.append((bx, H)); isRim.append(false) }; bx += 30 }
let bsorted = bottom.sorted { P[$0].0 < P[$1].0 }
// Side cuts, listed top to bottom and ending at the bottom corner when there is one.
func sideCut(_ x: Double) -> [Int] {
  var ids: [Int] = []
  var sy = H - 30
  while sy > 0 && inside(min(W - 2, max(2, x)), sy) && distToOutline((x, sy)) > 12 { ids.insert(P.count, at: 0); P.append((x, sy)); isRim.append(false); sy -= 30 }
  if let c = bottom.first(where: { P[$0].0 == x }) { ids.append(c) }
  return ids
}
let leftCut = sideCut(0), rightCut = sideCut(W)
var gen = SystemRandomNumberGenerator()
let gstep = 30.0
var gy = gstep / 2
while gy < H - 8 { var gx = gstep / 2; while gx < W {
  let jx = gx + Double.random(in: -8...8, using: &gen), jy = gy + Double.random(in: -8...8, using: &gen)
  if inside(jx, jy) && distToOutline((jx, jy)) > 9 { P.append((jx, jy)); isRim.append(false) }
  gx += gstep }; gy += gstep }

// Bowyer–Watson Delaunay
struct Tri { var a: Int, b: Int, c: Int, cx: Double, cy: Double, r2: Double }
let np = P.count
var Q = P
let big = 4 * max(W, H)
Q.append((-big, -big)); Q.append((W / 2, 3 * big)); Q.append((3 * big, -big))
func circum(_ i: Int, _ j: Int, _ k: Int) -> Tri {
  let (ax, ay) = Q[i], (bx, by) = Q[j], (cx, cy) = Q[k]
  let d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
  let ux = ((ax*ax + ay*ay) * (by - cy) + (bx*bx + by*by) * (cy - ay) + (cx*cx + cy*cy) * (ay - by)) / d
  let uy = ((ax*ax + ay*ay) * (cx - bx) + (bx*bx + by*by) * (ax - cx) + (cx*cx + cy*cy) * (bx - ax)) / d
  return Tri(a: i, b: j, c: k, cx: ux, cy: uy, r2: (ax - ux) * (ax - ux) + (ay - uy) * (ay - uy))
}
var tris = [circum(np, np + 1, np + 2)]
for i in 0..<np {
  let (px, py) = Q[i]
  var bad: [Tri] = [], keep: [Tri] = []
  for t in tris { if (px - t.cx) * (px - t.cx) + (py - t.cy) * (py - t.cy) < t.r2 { bad.append(t) } else { keep.append(t) } }
  var edgeCount: [String: (Int, Int, Int)] = [:]
  for t in bad { for (u, v) in [(t.a, t.b), (t.b, t.c), (t.c, t.a)] {
    let key = u < v ? "\(u)-\(v)" : "\(v)-\(u)"
    edgeCount[key] = (u, v, (edgeCount[key]?.2 ?? 0) + 1) } }
  tris = keep
  for (_, e) in edgeCount where e.2 == 1 { tris.append(circum(e.0, e.1, i)) }
}
func elen(_ i: Int, _ j: Int) -> Double { hypot(P[i].0 - P[j].0, P[i].1 - P[j].1) }
var front: [(Int, Int, Int)] = []
for t in tris where t.a < np && t.b < np && t.c < np {
  let cx = (P[t.a].0 + P[t.b].0 + P[t.c].0) / 3, cy = (P[t.a].1 + P[t.b].1 + P[t.c].1) / 3
  if !inside(cx, cy) || elen(t.a, t.b) > 70 || elen(t.b, t.c) > 70 || elen(t.c, t.a) > 70 { continue }
  // counter-clockwise in screen space (y down) so normals face the camera after the y flip
  let cross = (P[t.b].0 - P[t.a].0) * (P[t.c].1 - P[t.a].1) - (P[t.b].1 - P[t.a].1) * (P[t.c].0 - P[t.a].0)
  front.append(cross < 0 ? (t.a, t.b, t.c) : (t.a, t.c, t.b))
}
// Inflate: rounded profile from distance to the outline; rim stays at z = 0.
let depth = H * 0.16, reach = 150.0
var z = [Double](repeating: 0, count: np)
for i in 0..<np where !isRim[i] {
  let u = min(distToOutline(P[i]) / reach, 1)
  z[i] = depth * sqrt(1 - (1 - u) * (1 - u))
}

// ---- Simplification order --------------------------------------------------------
// Greedy half-edge collapses on the front surface, shortest 3D edge first (outline and
// cut edges cost more, so the inside coarsens before the silhouette does). Outline and
// frame-cut points only slide along their own line, chain ends and corners stay put, and
// a collapse is skipped if it would fold a triangle over or pinch the mesh. The page
// replays these collapses (and their mirrors on the back) forwards and backwards.
var prv = [Int](repeating: -1, count: np), nxt = [Int](repeating: -1, count: np)
var chains = [Int](repeating: 0, count: np), fixed = [Bool](repeating: false, count: np)
for ids in rimRuns + [bsorted, leftCut, rightCut] where !ids.isEmpty {
  for (k, i) in ids.enumerated() {
    chains[i] += 1
    if k > 0 { prv[i] = ids[k - 1] }
    if k < ids.count - 1 { nxt[i] = ids[k + 1] }
  }
  fixed[ids[0]] = true; fixed[ids[ids.count - 1]] = true
}
for i in 0..<np where chains[i] > 1 { fixed[i] = true }
var F = front.map { [$0.0, $0.1, $0.2] }
var alive = [Bool](repeating: true, count: F.count)
var vf = [[Int]](repeating: [], count: np)
for (fi, t) in F.enumerated() { for v in t { vf[v].append(fi) } }
func nbrs(_ v: Int) -> Set<Int> {
  var s = Set<Int>()
  for f in vf[v] where alive[f] { for w in F[f] where w != v { s.insert(w) } }
  return s
}
func area(_ t: [Int], _ v: Int, _ u: Int) -> Double {
  let q = t.map { P[$0 == v ? u : $0] }
  return (q[1].0 - q[0].0) * (q[2].1 - q[0].1) - (q[1].1 - q[0].1) * (q[2].0 - q[0].0)
}
func canCollapse(_ v: Int, _ u: Int) -> Bool {
  if fixed[v] { return false }
  if chains[v] > 0 && u != prv[v] && u != nxt[v] { return false }
  let nv = nbrs(v)
  guard nv.contains(u) else { return false }
  var opp = Set<Int>()
  for f in vf[v] where alive[f] && F[f].contains(u) { for w in F[f] where w != v && w != u { opp.insert(w) } }
  if nv.intersection(nbrs(u)) != opp { return false }
  for f in vf[v] where alive[f] && !F[f].contains(u) {
    let before = area(F[f], -1, -1), after = area(F[f], v, u)
    if before * after <= 0 || abs(after) < 4 { return false }
  }
  return true
}
var collapses: [Int] = []
var remaining = Set(F.flatMap { $0 }).count
while remaining > 36 {
  var cand: [(Double, Int, Int)] = []
  var seen = Set<Int>()
  for (fi, t) in F.enumerated() where alive[fi] {
    for (a0, b0) in [(t[0], t[1]), (t[1], t[2]), (t[2], t[0])] where seen.insert(min(a0, b0) * 100_000 + max(a0, b0)).inserted {
      let len = sqrt(pow(P[a0].0 - P[b0].0, 2) + pow(P[a0].1 - P[b0].1, 2) + pow(z[a0] - z[b0], 2))
      for (v, u) in [(a0, b0), (b0, a0)] { cand.append((len * (chains[v] > 0 ? 1.6 : 1), v, u)) }
    }
  }
  cand.sort { $0.0 < $1.0 }
  guard let (_, v, u) = cand.first(where: { canCollapse($0.1, $0.2) }) else { break }
  for f in vf[v] where alive[f] {
    if F[f].contains(u) { alive[f] = false } else { F[f] = F[f].map { $0 == v ? u : $0 }; vf[u].append(f) }
  }
  vf[v] = []
  if chains[v] > 0 {
    if prv[v] == u { nxt[u] = nxt[v]; prv[nxt[v]] = u } else { prv[u] = prv[v]; nxt[prv[v]] = u }
  }
  collapses += [v, u]
  remaining -= 1
}
// Vertices: front (z), back (-z, rim shared). Normalised so the frame height spans y in [-1, 1].
let s2 = H / 2
var verts: [Double] = []
for i in 0..<np { verts += [(P[i].0 - W / 2) / s2, -(P[i].1 - H / 2) / s2, z[i] / s2] }
var backIdx = [Int](repeating: 0, count: np)
for i in 0..<np {
  if isRim[i] { backIdx[i] = i } else { backIdx[i] = verts.count / 3; verts += [(P[i].0 - W / 2) / s2, -(P[i].1 - H / 2) / s2, -z[i] / s2] }
}
var faces: [Int] = []
for (i, j, k) in front { faces += [i, j, k]; faces += [backIdx[i], backIdx[k], backIdx[j]] }
// Caps along the frame cuts, wound to face outward (-y, -x, +x).
for k in 1..<max(1, bsorted.count) {
  let a = bsorted[k - 1], b = bsorted[k]
  faces += [a, backIdx[b], b]; faces += [a, backIdx[a], backIdx[b]]
}
for (cut, left) in [(leftCut, true), (rightCut, false)] where !cut.isEmpty {
  for k in 1..<max(1, cut.count) {
    let a = cut[k - 1], b = cut[k]
    if left { faces += [a, backIdx[b], b]; faces += [a, backIdx[a], backIdx[b]] }
    else { faces += [a, b, backIdx[b]]; faces += [a, backIdx[b], backIdx[a]] }
  }
  // close the top of the cap against the outline point where it leaves the frame
  let top = cut[0], ty = P[top].1, x = P[top].0
  if let r = (0..<np).filter({ isRim[$0] && P[$0].1 < ty }).min(by: { hypot(P[$0].0 - x, P[$0].1 - ty) < hypot(P[$1].0 - x, P[$1].1 - ty) }) {
    faces += left ? [r, backIdx[top], top] : [r, top, backIdx[top]]
  }
}
let vstr = verts.map { String(format: "%.3f", $0) }.joined(separator: ",")
let ints = { (x: [Int]) in x.map(String.init).joined(separator: ",") }
// v: positions, f: triangles, c: collapse pairs (front vertex -> neighbour), m: each front vertex's back twin
let json = "{\"v\":[\(vstr)],\"f\":[\(ints(faces))],\"c\":[\(ints(collapses))],\"m\":[\(ints(backIdx))]}"
try json.write(toFile: a[2], atomically: true, encoding: .utf8)
print("bust vertices:", verts.count / 3, "faces:", faces.count / 3, "collapses:", collapses.count / 2, "left:", remaining, "json bytes:", json.utf8.count)
