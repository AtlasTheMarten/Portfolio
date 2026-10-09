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
 dict(slug="third-arm", title="Motion-Tracked Third Arm", when="May 2026 – now", badge=("","Currently building"),
  desc="A wearable, backpack-mounted 5-axis robotic arm that copies the wearer's arm in real time.",
  lede="A 6.85 kg, backpack-mounted, 5-axis robotic arm that copies my arm's motion in real time. I demonstrated it live, worn and working, at the UTK Engineering Expo in September 2026. In the video I'm walking around with it on.",
  hero=video("BMUnyKhH5vU","Walking with the third arm on"),
  facts=[("Status","Wearable prototype, demoed live at the UTK Engineering Expo (Sept 2026)"),("Hardware","5 brushless motors on FOC controllers and a CAN bus, 36 V packs I built, 4 IMU trackers"),("Tools","Fusion 360, carbon fiber, 3D printing"),("Skills","Mechanism design, motor control, wearable robotics")],
  sec=[("The problem","I wanted an extra arm that moves the way I move, with no joystick. That means reading where my own arm is, turning that into joint angles for an arm shaped nothing like mine, and doing it fast and safely on a machine strapped to my back."),
       ("The build","An excavator-style arm: a worm drive at the base, ball screws driving the boom and elbow, and a two-motor belt and bevel differential wrist. The frame is carbon fiber tubes with aluminum collars, after I found 3D-printed PLA would creep under load. Five brushless motors run on FOC controllers over a shared CAN bus, powered by 36 V packs I built, with a hardware e-stop. Four wireless IMU trackers based on the SlimeVR design read my arm, and a three-finger gripper closes on Dyneema tendons, controlled by pressure sensors in a glove."),
       ("What I'm learning","Thirteen days before the expo the base worm drive skipped teeth under load, so I cut both links from 880 to 460 mm and redesigned the worm gear, roughly halving the worst-case joint torque. Replaying recordings of my own arm offline cut the median boom error from 4.3° to 0.7° before the arm ever moved. I directed the control software, written mostly with AI coding tools, and tested every piece on the hardware: layered safety stops, stall detection and overheating protection.")],
  gallery=[fig("third-arm-assembly.jpg","Full assembly, from the body mount to the gripper"),
           fig("third-arm-teleop.gif","Teleoperation simulation"),
           fig("third-arm-gripper.jpg","Gripper with jointed fingers"),
           fig("third-arm-worm-drive.jpg","Joint drive: pancake motor turning a worm gear"),
           fig("third-arm-wrist-section.jpg","Section view through the wrist gearing"),
           fig("third-arm-finger-section.jpg","Section view of the finger joints")]),
 dict(slug="led-tissue-sealer", title="LED Tissue Sealing Device", when="Aug 2026 – May 2027", badge=("","Senior design"),
  desc="UTK biomedical engineering capstone: a handheld, disposable LED device that activates Rose Bengal dye to seal tissue without sutures.",
  lede="My UTK biomedical engineering capstone, sponsored by a surgeon at UT Medical Center. Our team is designing a handheld, battery-powered, disposable LED device that activates Rose Bengal dye to seal tissue without sutures, as a low-cost alternative to laser systems that cost around $99k.",
  hero=media_ph("527 nm", "CAD and photos coming soon"),
  facts=[("Status","In design, team project (expected May 2027)"),("My role","Internal optical and electrical system"),("Targets","0.5 W/cm² over 1 cm² at 10 mm, 90 J/cm² dose, ≤ $30 in parts"),("Standards","IEC 62471, ISO 10993, ISO 11135")],
  sec=[("The problem","Sealing tissue with light and Rose Bengal dye works, but the laser systems that do it cost around $99k. We want a handheld, disposable device that does the same job with LEDs for a small fraction of that."),
       ("My part","I'm designing most of the internal optical and electrical system: a 527 nm LED array on a constant-current boost driver running from three AA batteries, with no microcontroller. I set the design targets of 0.5 W/cm² over a 1 cm² spot at 10 mm, a 90 J/cm² dose, and $30 or less in parts."),
       ("Requirements","I wrote the Statement of Work for the sponsor proposal, and the sponsor approved our needs assessment. I also built a requirements matrix of 27 requirements and 23 test cases tied to light safety, biocompatibility and sterilization standards.")],
  gallery=[]),
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
  facts=[("Budget","$600, self-funded"),("Tools","Fusion 360, 3D printing, firmware"),("Skills","Rapid prototyping, mechanical interfaces")],
  sec=[("The problem","Build a machine that hands someone a copy of my resume: a robotic arm and a paper dispenser, made as much as possible from hardware I already had, and paid for myself."),
       ("The build","I worked out what the hardware I had on hand could do and what else I'd need, then sourced parts and designed the mechanisms and interfaces in CAD, iterating quickly through 3D-printed versions. I built a frame and tested extensively while wiring and coding the arm and the dispenser."),
       ("What I learned","Plenty of problems only showed up once it was built, so I adjusted the design during the build to fix them. Because it was self-funded I optimized for cost throughout, and it came in at $600.")],
  gallery=[fig("resume-arm-chain-drive.jpg","Brushless motor and chain drive on the real build"),
           fig("resume-arm-gripper.jpg","Gripper CAD: servo-driven linkage with its design angles", light=True),
           fig("resume-arm-dispenser.jpg","Paper dispenser housing", light=True)]),
 dict(slug="ebike", title="Electric Bike Conversions", when="Oct 2024 – May 2025",
  desc="Mountain and road bikes converted to electric power on a $250 budget.",
  lede="I converted mountain and road bikes to electric power, designing and building custom battery packs safely while keeping to a strict $250 budget through cost-effective hardware sourcing.",
  hero=vid("ebike-1.mp4", "Riding the converted e-bike on the beach", "ebike-1-poster.jpg"),
  facts=[("Budget","$250"),("Built","Custom battery packs"),("Skills","Power systems, resource optimization, DIY electronics")],
  sec=[("The problem","Could I convert the mountain and road bikes I already had to electric, battery packs included, for $250?"),
       ("The build","I researched how commercial e-bikes and their batteries work and what it would take to build my own packs, then bought cost-effective hardware and kept to the budget."),
       ("What I learned","How to build battery packs safely. The packs I made powered my bikes for many months.")],
  gallery=[fig("ebike-battery-pack.jpg","Custom battery pack: cells, nickel strips and BMS"),
           fig("ebike-hub-motor.jpg","Rear hub motor fitted to the mountain bike"),
           figvid("ebike-2.mp4","Riding up a city street", "ebike-2-poster.jpg")]),
]

R = [
 dict(slug="karolinska-research", title="Brain Research at Karolinska", when="Jan 2024 – May 2024",
  desc="Mapping where the protein NEUROD6 appears in human brain tissue, at Karolinska Institute.",
  lede="As a research assistant at Karolinska Institute in Stockholm, I used fluorescent staining on human brain tissue to map where the protein NEUROD6 shows up, and in which kinds of cells.",
  hero='<figure class="poster-hero"><a class="media" href="../assets/img/neurod6-poster-full.jpg" target="_blank" rel="noopener"><img src="../assets/img/neurod6-poster.jpg" alt="Research poster: NEUROD6 protein analysis, by Ethan Wheeler"></a><figcaption class="hand">the original poster from May 2024 · click to open it full size</figcaption></figure>',
  facts=[("Role","Research Assistant"),("Where","Karolinska Institute Biomedicum, Stockholm"),("Mentors","Nick Mitsios and Jan Mulder"),("Methods","Immunofluorescence with TSA detection, co-staining for cell types, fluorescence slide scanning, overlap analysis")],
  sec=[("The question","NEUROD6 is a transcription factor thought to help develop and maintain the nervous system. Where in the human brain is it expressed, and in which kinds of cells?"),
       ("What I did","I stained human brain tissue from the hippocampus, cortex, basal ganglia and cerebellum, running the immunofluorescence protocol from deparaffinization through antigen retrieval, overnight antibody incubation and TSA fluorescent detection. I co-stained for neurons (NeuN), astrocytes (GFAP) and microglia (Iba1), scanned the slides on a fluorescence microscope, and measured overlap between channels by thresholding each one, multiplying the images together and counting the overlapping particles."),
       ("What I found","The protein sat mostly in neurons, with the densest signal in the cortex and hippocampus and little overlap with glia. The overlap numbers shifted with small changes to the analysis settings, and every sample came from an older donor, so I proposed looking next at how expression changes with age.")],
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
    gal_sec = f'''            <div class="gallery-section">
                <p class="label">Gallery</p>
                <div class="gallery">
{gal}
                </div>
            </div>
''' if p["gallery"] else ""
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
                    GALLERY_SECTION=gal_sec, BADGE=badge, PREV_SLUG=prev["slug"], PREV_TITLE=prev["title"], NEXT_SLUG=nxt["slug"], NEXT_TITLE=nxt["title"]).items():
        out = out.replace("{{"+k+"}}", v)
    open(os.path.join(ROOT, 'projects', f'{p["slug"]}.html'),'w').write(out)
print("ok")
