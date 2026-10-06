"""Generates the project detail pages in projects/ from page_tpl.html.
Edit the page data below (PH = placeholder text, hidden on the live site), then run:  python3 _tools/gen_pages.py
"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
import html
PH = '<span class="placeholder">Placeholder: Ethan will write this part.</span>'
def media_img(src, alt): return f'<div class="media"><img src="../assets/img/{src}" alt="{html.escape(alt)}"></div>'
def media_ph(icon, txt="Photo or video coming soon"): return f'<div class="media"><div class="ph"><b aria-hidden="true">{icon}</b>{txt}</div></div>'
def fig(src, cap, light=False): return f'<figure><a class="media{" light" if light else ""}" href="../assets/img/{src}" target="_blank" rel="noopener"><img src="../assets/img/{src}" alt="{html.escape(cap)}" loading="lazy"></a><figcaption>{html.escape(cap)}</figcaption></figure>'
def pa(poster): return f' poster="../assets/img/{poster}"' if poster else ''
def vid(src, title, poster=''): return f'<div class="media"><video src="../assets/video/{src}"{pa(poster)} controls playsinline preload="metadata" aria-label="{html.escape(title)}"></video></div>'
def figvid(src, cap, poster=''): return f'<figure><div class="media"><video src="../assets/video/{src}#t=0.1"{pa(poster)} controls playsinline preload="metadata" aria-label="{html.escape(cap)}"></video></div><figcaption>{html.escape(cap)}</figcaption></figure>'
def video(yt, title): return f'<div class="media"><iframe src="https://www.youtube.com/embed/{yt}" title="{html.escape(title)}" style="width:100%;height:100%;border:0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>'

P = [
 dict(slug="third-arm", title="Motion-Tracked Third Arm", when="2026 – now", badge=("","Currently building"),
  desc="A wearable, motion-tracked robotic third arm driven by teleoperation.",
  lede="A wearable robotic third arm that follows tracked motion through teleoperation. In the video I'm wearing it and walking around with it on.",
  hero=video("BMUnyKhH5vU","Walking with the third arm on"),
  facts=[("Status","Wearable prototype, in progress"),("Tools","Fusion 360, simulation"),("Skills","Robotics, teleoperation, mechanism design")],
  sec=[("The problem",PH),("The build",PH),("What I'm learning",PH)],
  gallery=[fig("third-arm-assembly.jpg","Full assembly, from the body mount to the gripper"),
           fig("third-arm-teleop.gif","Teleoperation simulation"),
           fig("third-arm-gripper.jpg","Gripper with jointed fingers"),
           fig("third-arm-worm-drive.jpg","Joint drive: pancake motor turning a worm gear"),
           fig("third-arm-wrist-section.jpg","Section view through the wrist gearing"),
           fig("third-arm-finger-section.jpg","Section view of the finger joints")]),
 dict(slug="axial-flux-motor", title="Axial Flux Motor", when="2026", badge=("paused","On hiatus"),
  desc="Designing a high power-density axial flux permanent magnet motor.",
  lede="I'm engineering a high power-density axial flux permanent magnet motor. Its flat, \"pancake\" geometry packs a lot of torque into a short axial footprint, which makes for a strong power-to-weight ratio.",
  hero=vid("axial-flux-motor-test.mp4", "First spin test of the axial flux motor", "axial-flux-motor-spin-test.jpg"),
  facts=[("Status","On hiatus · stator wound, first spin test done"),("Tools","Fusion 360, 3D printing"),("Skills","Electromagnetics, mechatronics")],
  sec=[("The problem","Radial-flux motors get heavy and long when you ask for more torque. An axial flux layout puts the magnets and coils face to face, so the same torque fits in a much thinner package."),("The build",PH),("What I'm learning",PH)],
  gallery=[fig("axial-flux-motor-stator.jpg","The hand-wound stator: 12 coils, wired up for testing"),
           fig("axial-flux-motor-cad.png","Section view of the CAD model")]),
 dict(slug="resume-arm", title="Resumé Arm", when="Oct 2025 – Feb 2026",
  desc="A robotic arm and paper dispenser that hands out my resume.",
  lede="A self-designed machine with a robotic arm and a paper dispenser that hands out my resume. I iterated the mechanisms in CAD, wired it, coded the control system, and kept it within a $600 self-funded budget.",
  hero=video("d0QV2A43sAg","Resumé Arm demo"),
  facts=[("Budget","$600, self-funded"),("Tools","Fusion 360, 3D printing, C++"),("Skills","Rapid prototyping, mechanical interfaces")],
  sec=[("The problem",PH),("The build",PH),("What I learned",PH)],
  gallery=[fig("resume-arm-chain-drive.jpg","Brushless motor and chain drive on the real build"),
           fig("resume-arm-gripper.jpg","Gripper CAD: servo-driven linkage with its design angles", light=True),
           fig("resume-arm-dispenser.jpg","Paper dispenser housing", light=True)]),
 dict(slug="ebike", title="Electric Bike Conversions", when="Oct 2024 – May 2025",
  desc="Mountain and road bikes converted to electric power on a $250 budget.",
  lede="I converted mountain and road bikes to electric power, designing and building custom battery packs safely while keeping to a strict $250 budget through cost-effective hardware sourcing.",
  hero=vid("ebike-1.mp4", "Riding the converted e-bike on the beach", "ebike-1-poster.jpg"),
  facts=[("Budget","$250"),("Built","Custom battery packs"),("Skills","Power systems, resource optimization, DIY electronics")],
  sec=[("The problem",PH),("The build",PH),("What I learned",PH)],
  gallery=[fig("ebike-battery-pack.jpg","Custom battery pack: cells, nickel strips and BMS"),
           fig("ebike-hub-motor.jpg","Rear hub motor fitted to the mountain bike"),
           figvid("ebike-2.mp4","Riding up a city street", "ebike-2-poster.jpg")]),
]

R = [
 dict(slug="karolinska-research", title="Brain Research at Karolinska", when="Jan 2024 – May 2024",
  desc="Mapping where the protein NEUROD6 appears in human brain tissue, at Karolinska Institute.",
  lede="As a research assistant at Karolinska Institute in Stockholm, I used fluorescent staining on human brain tissue to map where the protein NEUROD6 shows up, and in which kinds of cells.",
  hero='<figure class="poster-hero"><a class="media" href="../assets/img/neurod6-poster-full.jpg" target="_blank" rel="noopener"><img src="../assets/img/neurod6-poster.jpg" alt="Research poster: NEUROD6 protein analysis, by Ethan Wheeler"></a><figcaption class="hand">click the poster to open it full size</figcaption></figure>',
  facts=[("Role","Research Assistant"),("Where","Karolinska Institute Biomedicum, Stockholm"),("Mentors","Nick Mitsios and Jan Mulder"),("Methods","Immunohistochemistry, TSA fluorescent staining, image analysis")],
  sec=[("The question","NEUROD6 is a transcription factor thought to help develop and maintain the nervous system. Which brain regions and cell types express it, and how might that relate to what it does?"),
       ("What I did","I prepared paraffin-embedded samples from different brain regions, ran antigen retrieval in a pressure cooker, incubated them overnight with an antibody against NEUROD6, then used TSA fluorescent amplification to see where the protein sits under the microscope."),
       ("What I found","NEUROD6 shows up mainly in neurons, especially in the cortex, hippocampus and cerebellum. In the cerebellum about 80% of neurons overlapped with NEUROD6, and every hippocampal sample showed dense expression along the dentate gyrus.")],
  gallery=[fig("neurod6-hippocampus.jpg","Hippocampal formation: NEUROD6 (yellow) concentrated along the dentate gyrus"),
           fig("neurod6-astrocytes.jpg","Astrocytes (red), NEUROD6 (green) and nuclei (blue)"),
           fig("neurod6-cerebellum-nuclei.jpg","Cerebellum: astrocytes (magenta) and nuclei (blue)"),
           fig("neurod6-cerebellum-neurons.jpg","Cerebellum: astrocytes (magenta) and neurons (green)")],
  back=("../index.html#experience","← Back to experience")),
]
TPL = open(os.path.join(HERE, 'page_tpl.html')).read()
for i,p in enumerate(P+R):
    prev, nxt = P[i-1], P[(i+1)%len(P)]
    facts = "\n".join(f"                        <dt>{k}</dt><dd>{v}</dd>" for k,v in p["facts"])
    sec = "\n".join(f'                <div class="panel"><h2>{h}</h2><p>{b}</p></div>' for h,b in p["sec"])
    gal = "\n".join(f"                    {g}" for g in p["gallery"])
    badge = f'<span class="badge {p["badge"][0]}" style="position:relative;top:auto;left:auto;display:inline-block;transform:none;margin:0 10px 12px 0">{p["badge"][1]}</span>\n                    ' if p.get("badge") else ""
    out = TPL
    pager = f'''            <nav class="pager" aria-label="More projects">
                <a class="panel" href="{prev["slug"]}.html"><small>← Previous</small><span>{prev["title"]}</span></a>
                <a class="panel next" href="{nxt["slug"]}.html"><small>Next →</small><span>{nxt["title"]}</span></a>
            </nav>
''' if p in P else ""
    back = p.get("back", ("../index.html#projects","← All projects"))
    wu = " all-placeholder" if all(b == PH for _, b in p["sec"]) else ""
    for k,v in dict(WU_CLASS=wu, EXTRA=p.get("extra",""), PAGER=pager, BACK_HREF=back[0], BACK_TEXT=back[1], TITLE=p["title"], DESC=p["desc"], WHEN=p["when"], LEDE=p["lede"], HERO=p["hero"], FACTS=facts, SECTIONS=sec,
                    GALLERY=gal, BADGE=badge, PREV_SLUG=prev["slug"], PREV_TITLE=prev["title"], NEXT_SLUG=nxt["slug"], NEXT_TITLE=nxt["title"]).items():
        out = out.replace("{{"+k+"}}", v)
    open(os.path.join(ROOT, 'projects', f'{p["slug"]}.html'),'w').write(out)
print("ok")
