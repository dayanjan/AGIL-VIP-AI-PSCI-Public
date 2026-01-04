# AGIL: AI-Guided Inquiry Learning for Computational Drug Discovery

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![DOI](https://img.shields.io/badge/DOI-pending-blue.svg)]()

> **Companion repository for the AGIL theoretical framework manuscript**

## Overview

This repository contains open educational resources for the **AI-Guided Inquiry Learning (AGIL)** framework, a pedagogical synthesis designed for computational drug discovery education in the AI era.

AGIL integrates:
- **Process Oriented Guided Inquiry Learning (POGIL)** - structured collaborative inquiry
- **Just-in-Time Teaching (JiTT)** - adaptive instruction based on student work
- **AI as Learning Partner** - generative AI tools integrated into the scientific workflow

## Repository Contents

```
AGIL-Framework/           # Theoretical framework documentation
├── AGIL_Theoretical_Framework.md    # Full manuscript
├── AGIL_Principles.md               # Core principles
└── AGIL-Figure [1-4].png            # Publication figures

Curriculum/               # Course overview
└── CURRICULUM_OVERVIEW.md # Talktorial titles and structure

Talktorials/              # 20 guided inquiry notebooks (EMPTY versions)
├── AI-PSCI-001.ipynb     # Intro to Colab & AI-Assisted Coding
├── AI-PSCI-002.ipynb     # AI Collaboration & Prompt Engineering
├── ...
└── AI-PSCI-020.ipynb     # Communicating Results
```

## Talktorial Design

Unlike traditional tutorials where students run pre-written code, AGIL talktorials feature **empty code cells** where students:
1. Receive scientific context and learning objectives
2. Write code with AI assistance (GitHub Copilot, Claude, ChatGPT)
3. Verify their results against expected outputs
4. Document their process and AI interactions in lab notebooks

## 6-Target Drug Discovery Portfolio

Students select one target from six therapeutically diverse options:

| Target | Therapeutic Area | Application |
|--------|------------------|-------------|
| **DHFR** | Antibiotics | Trimethoprim resistance |
| **ABL1** | Cancer (CML) | Imatinib (Gleevec) |
| **EGFR** | Cancer (NSCLC) | Erlotinib (Tarceva) |
| **AChE** | Neurodegeneration | Donepezil (Alzheimer's) |
| **COX-2** | Inflammation | Celecoxib |
| **DPP-4** | Diabetes | Sitagliptin |

## For Educators

**Solution notebooks** with complete working code are available to instructors upon request. Just send an email from your institutional address to wijesingheds@vcu.edu.

See [FOR_EDUCATORS.md](FOR_EDUCATORS.md) for details.

## Citation

If you use AGIL materials in your teaching or research, please cite:

```bibtex
@article{wijesinghe2026agil,
  title={AI-Guided Inquiry Learning (AGIL): A Pedagogical Synthesis for
         Computational Drug Discovery Education},
  author={Wijesinghe, Dayanjan S.},
  journal={CBE-Life Sciences Education},
  year={2026},
  note={Preprint available on EdArXiv}
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

*This repository accompanies the AGIL theoretical framework manuscript submitted to CBE-Life Sciences Education.*
