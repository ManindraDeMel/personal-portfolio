// Default research content used when the Firestore `research` collection is
// empty or unavailable. Doc shape mirrors what `fetchResearch` returns.
//   {
//     slug: string,            // unique key, used for de-dupe + Firestore doc id
//     name: string,
//     year: string,
//     status: string,          // "Published", "Live demo", "Working paper", ...
//     role: string,            // "Sole author" | "Lead" | "Contributor"
//     collaborators: string,   // co-authors / "—"
//     course: string,          // "ANU COMP4610 (2024)" or "" for none
//     blurb: string,           // 1–2 sentence elevator pitch
//     problem: string,
//     approach: string,
//     outcome: string,
//     stack: string[],
//     liveUrl: string,
//     paperUrl?: string,
//     repoUrl?: string,
//     active: boolean,
//     order: number,           // higher renders first
//   }

const RESEARCH = [
  {
    slug: 'aware-mesh-simplification',
    name: 'Skeleton-Aware Mesh Simplification',
    year: '2024',
    status: 'Live demo',
    role: 'Co-author',
    collaborators: 'R. Mistry · A. Sharma',
    course: 'ANU COMP4610 — Group 40',
    blurb:
      'A structure-aware extension of QEM mesh decimation that preserves fine geometric detail by weighting collapse error with priors learned from a 3D CNN autoencoder.',
    problem:
      'Quadric Error Metrics decimate meshes uniformly — fine features (limbs, lattice struts, sharp edges) collapse at the same rate as flat regions, blurring the silhouette long before the polygon budget is hit.',
    approach:
      'Voxelise meshes from ModelNet40 (12,311 CAD models, 40 classes) at 32³ and train a 3D CNN autoencoder (encoder 64→256 filters, BatchNorm, LeakyReLU, BCE loss). Reconstruction error becomes a per-region importance map; the QEM contraction cost is reweighted by skeletonisation + this learned saliency so structurally important triangles are decimated last.',
    outcome:
      'Lower Hausdorff distance vs. baseline QEM at equivalent triangle counts on held-out ModelNet40 categories. Demo site renders before/after meshes side by side with the saliency map overlaid.',
    stack: ['Python', 'TensorFlow', 'Keras', 'CGAL', 'NumPy'],
    liveUrl: 'https://aware-mesh-simplification.web.app',
    active: true,
    order: 20,
  },
  {
    slug: 'realtime-engine-tuning',
    name: 'Real-Time ML Engine Tuning',
    year: '2024',
    status: 'Working paper',
    role: 'Sole author',
    collaborators: '—',
    course: '',
    blurb:
      'An online-learning controller that re-tunes ignition and air–fuel ratio parameters from live telemetry, replacing static ECU lookup tables with a model that adapts to driving conditions.',
    problem:
      'Production ECUs ship with static fuel/ignition maps calibrated on a dyno. Once on the road — different fuel grade, altitude, wear, ambient temp — the lookup is stale, leaving efficiency and emissions on the table.',
    approach:
      'A lightweight online-learning loop reads RPM, manifold pressure, intake temperature, and lambda from the OBD bus and updates the spark/AFR targets each cycle to optimise a configurable objective (BSFC for efficiency, NOx-weighted otherwise). Compute budget kept low enough to run on embedded hardware alongside the existing ECU.',
    outcome:
      'Simulated efficiency gains over the static-map baseline across a synthetic drive cycle. The project page hosts the working paper, slide deck, and literature review.',
    stack: ['Python', 'ML', 'Embedded', 'OBD-II'],
    liveUrl: 'https://realtimeenginetuning.web.app',
    active: true,
    order: 10,
  },
];

export default RESEARCH;
