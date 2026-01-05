# AGIL: AI-Guided Inquiry Learning for Computational Drug Discovery

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.18152188.svg)](https://doi.org/10.5281/zenodo.18152188)

> **Companion repository for the AGIL theoretical framework manuscript**

---

## Quick Tour

| If you are... | Start here |
|---------------|------------|
| **A reviewer** evaluating the manuscript | Read [Why Are the Notebooks Empty?](#why-are-the-notebooks-empty) below, then browse `Talktorials/AI-PSCI-001-Scaffold.ipynb` for a fully annotated example |
| **An educator** considering adoption | See [FOR_EDUCATORS.md](FOR_EDUCATORS.md) to request solution notebooks |
| **A student** ready to learn | Open any notebook in `Talktorials/` in Google Colab and start coding with AI assistance |
| **A researcher** interested in the framework | Read `AGIL-Framework/AGIL_Theoretical_Framework.md` |

### What's in This Repository

| Folder | Contents | Manuscript Reference |
|--------|----------|---------------------|
| `AGIL-Framework/` | Theoretical framework, core principles, figures | Sections 1-8 |
| `Curriculum/` | Course structure and talktorial sequence | Section 3, Table 1 |
| `Talktorials/` | 20 guided inquiry notebooks (empty code cells) | Section 4 |
| `Talktorials/AI-PSCI-001-Scaffold.ipynb` | Annotated example showing teaching design | Section 4.2-4.4 |

---

## Why Are the Notebooks Empty?

**This is intentional, not incomplete.**

Unlike traditional tutorials where students run pre-written code, AGIL talktorials are designed with **empty code cells** as a core pedagogical feature. Here's why:

### The AGIL Learning Model

```
Traditional Tutorial          AGIL Talktorial
─────────────────────         ─────────────────────
Pre-written code        →     Empty code cell
Student runs code       →     Student writes code (with AI)
Passive observation     →     Active construction
"Did it work?"          →     "Is my code correct?"
```

### What Students Actually Do

1. **Read** the scientific context and learning objectives
2. **Consult** AI assistants (Claude, ChatGPT) to write code
3. **Verify** their results against expected outputs provided in the notebook
4. **Document** their process, AI interactions, and reasoning in lab notebooks

### What Instructors Get

Solution notebooks with complete working code are available under institutional license. See [FOR_EDUCATORS.md](FOR_EDUCATORS.md).

### See It In Action

Browse **`Talktorials/AI-PSCI-001-Scaffold.ipynb`** for a fully annotated example that shows:
- The complete teaching scaffold (all prompts and instructions)
- Expected outputs for each inquiry
- Verification criteria students use
- Pedagogical notes explaining the design intent

---

## Overview

This repository contains open educational resources for the **AI-Guided Inquiry Learning (AGIL)** framework, a pedagogical synthesis designed for computational drug discovery education in the AI era.

AGIL integrates:
- **Process Oriented Guided Inquiry Learning (POGIL)** - structured collaborative inquiry *(Section 2.1)*
- **Just-in-Time Teaching (JiTT)** - adaptive instruction based on student work *(Section 2.2)*
- **AI as Learning Partner** - generative AI tools integrated into the scientific workflow *(Section 4)*

## Repository Contents

```
AGIL-Framework/           # Theoretical framework documentation
├── AGIL_Theoretical_Framework.md    # Full manuscript
├── AGIL_Principles.md               # Core principles (Section 5)
└── AGIL-Figure [1-4].png            # Publication figures

Curriculum/               # Course overview
└── CURRICULUM_OVERVIEW.md # Talktorial titles and structure (Table 1)

Talktorials/              # 20 guided inquiry notebooks
├── AI-PSCI-001-Scaffold.ipynb  # ANNOTATED EXAMPLE - start here!
├── AI-PSCI-001.ipynb     # Intro to Colab & AI-Assisted Coding
├── AI-PSCI-002.ipynb     # AI Collaboration & Prompt Engineering
├── ...
└── AI-PSCI-020.ipynb     # Communicating Results
```

## Manuscript Cross-References

| Repository Content | Manuscript Section |
|-------------------|-------------------|
| AGIL pedagogical synthesis | Section 2: Theoretical Foundations |
| Three-exposure learning cycle | Section 3: Curriculum Architecture |
| Empty-cell talktorial design | Section 4.2: AI-Partnered Inquiry |
| Verification as learning outcome | Section 4.4: Verification Framework |
| 6-target drug discovery portfolio | Section 3.2, Table 2 |
| Assessment and badges | Section 6: Assessment Design |
| Infrastructure (Google Colab) | Section 7: Implementation |

## 6-Target Drug Discovery Portfolio

Students select one target from six therapeutically diverse options (see manuscript Section 3.2, Table 2):

| Target | Therapeutic Area | Application |
|--------|------------------|-------------|
| **DHFR** | Antibiotics | Trimethoprim resistance |
| **ABL1** | Cancer (CML) | Imatinib (Gleevec) |
| **EGFR** | Cancer (NSCLC) | Erlotinib (Tarceva) |
| **AChE** | Neurodegeneration | Donepezil (Alzheimer's) |
| **COX-2** | Inflammation | Celecoxib |
| **DPP-4** | Diabetes | Sitagliptin |

## Getting Started

### For Students

1. Open any talktorial in Google Colab: Click the notebook → "Open in Colab" button
2. Follow the guided inquiries, using AI assistants to help write code
3. Verify your results against the expected outputs
4. Document your process in your lab notebook

### For Educators

**Solution notebooks** with complete working code are available to instructors upon request.

1. Review this repository and the manuscript
2. Email from your institutional address to wijesingheds@vcu.edu
3. Receive access to solution notebooks and instructor materials

See [FOR_EDUCATORS.md](FOR_EDUCATORS.md) for details.

### Technical Requirements

- **Platform**: Google Colab (free, browser-based)
- **GPU**: Required for AI-PSCI-011 through 016 (AlphaFold, docking)
- **Packages**: All installed automatically in Colab (RDKit, BioPython, py3Dmol, etc.)
- **AI Assistant**: Claude, ChatGPT, or GitHub Copilot

## Citation

If you use AGIL materials in your teaching or research, please cite:

**APA Format:**
> Wijesinghe, D. S. (2026). AI-Guided Inquiry Learning (AGIL): A Pedagogical Synthesis for Computational Drug Discovery Education. Zenodo. https://doi.org/10.5281/zenodo.18152188

```bibtex
@misc{wijesinghe2026agil,
  author       = {Wijesinghe, Dayanjan S.},
  title        = {{AI-Guided Inquiry Learning (AGIL): A Pedagogical
                   Synthesis for Computational Drug Discovery Education}},
  year         = {2026},
  publisher    = {Zenodo},
  doi          = {10.5281/zenodo.18152188},
  url          = {https://doi.org/10.5281/zenodo.18152188}
}
```

## Acknowledgements

AGIL builds upon the excellent work of:

- **[TeachOpenCADD](https://github.com/volkamerlab/teachopencadd)** by the Volkamer Lab - The "talktorial" format and open-source philosophy
- **Google Colaboratory** - Zero-install Python/GPU access
- **Open-source cheminformatics tools** - RDKit, ChEMBL, PDB, UniProt, AlphaFold, AutoDock Vina, and many others

## License

This work is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License](http://creativecommons.org/licenses/by-nc/4.0/).

You are free to:
- **Share** - copy and redistribute the material in any medium or format
- **Adapt** - remix, transform, and build upon the material

Under the following terms:
- **Attribution** - You must give appropriate credit
- **NonCommercial** - You may not use the material for commercial purposes

## Contact

**Dayanjan S. Wijesinghe, Ph.D.**
Department of Pharmacotherapy and Outcomes Sciences
VCU School of Pharmacy
Virginia Commonwealth University
Email: wijesingheds@vcu.edu
ORCID: [0000-0002-2124-5109](https://orcid.org/0000-0002-2124-5109)

---

*This repository accompanies the AGIL theoretical framework manuscript (submitted to EdArXiv, January 2026).*
