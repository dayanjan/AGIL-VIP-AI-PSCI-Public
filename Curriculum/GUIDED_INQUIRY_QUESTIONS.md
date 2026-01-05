# AI-Guided Inquiry Learning (AGIL): Pedagogical Framework and Talktorial Mapping

## VIP: AI in Pharmaceutical Sciences — Bench to Bedside
### Spring 2026 Curriculum Guide

---

## Part 1: Pedagogical Classification

### What Is This Approach Called?

Your approach represents a **novel synthesis** of several established pedagogies, enhanced by AI as a learning partner. After reviewing the literature, I propose calling this:

**AI-Guided Inquiry Learning (AGIL)** or **AI-Enhanced Just-in-Time Guided Inquiry (AI-JiTGI)**

### How AGIL Relates to Established Pedagogies

**Table 1. Comparison of AGIL with established pedagogical approaches.** AGIL synthesises elements from multiple frameworks while introducing AI as an inquiry partner requiring verification.

| Pedagogy | Key Features | AGIL Incorporates | Key Differences |
|----------|--------------|---------------------------|-----------------|
| **POGIL** (Process Oriented Guided Inquiry Learning) | Team-based in-class worksheets; exploration → concept formation → application cycle; defined student roles | Guided inquiry questions, Learning cycle structure, Process skill development | POGIL uses in-class worksheets with instructor facilitation; AGIL uses pre-class AI exploration with verification requirements |
| **JiTT** (Just-in-Time Teaching) | Pre-class "warmup" questions; instructor reviews responses before class; adapts in-class activities | Pre-class questions, Feedback loop to in-class, Uncovering misconceptions | JiTT traditionally uses brief factual questions; AGIL uses exploratory AI-assisted inquiry with documentation |
| **Flipped Classroom** | Content acquisition before class; higher-order activities during class | Pre-class learning, In-class synthesis and application | Traditional flipped uses videos/readings; AGIL uses AI-assisted exploration |
| **Inquiry-Based Learning** | Student-driven questions; investigation and evidence gathering | Guided inquiry questions, Evidence verification, Documentation of process | Traditional inquiry doesn't include AI; AGIL positions AI as exploration partner requiring verification |
| **Talktorial Model** (Volkamer Lab) | Interactive notebooks combining theory + code; talk + tutorial | Colab notebooks, Theory + hands-on structure | TeachOpenCADD provides complete code; AGIL requires students to write code with AI assistance |

### What Makes AGIL Novel?

Your approach adds three distinctive elements not found in existing frameworks:

1. **AI as Exploratory Partner**: Students use AI tools to investigate questions, but must critically evaluate and verify AI outputs against primary sources. This teaches "learning with AI" as a core professional skill.

2. **Two-Phase Learning Cycle**: Theory (via AI-guided inquiry) → Implementation (via talktorial). The inquiry phase builds conceptual understanding; the talktorial phase builds procedural fluency.

3. **Dual Documentation**: Lab notebook (reflective, conceptual, verification-focused) + Colab notebook (technical, procedural, code-focused). Two distinct artifacts demonstrating different competencies.

### Proposed Definition

> **AI-Guided Inquiry Learning (AGIL)** is a pedagogical approach that combines guided inquiry questions explored through AI assistance with hands-on computational implementation. Students engage in a two-phase learning cycle: first investigating theoretical concepts through AI-assisted exploration with mandatory source verification, then applying that understanding through interactive coding notebooks (talktorials). The approach develops both conceptual knowledge and the meta-skill of learning effectively with AI tools.

### Literature Positioning

If you publish on this approach, you could position it as:

- An extension of **JiTT** to AI-assisted exploration
- A **flipped POGIL** model with AI integration
- A novel **AI-enhanced inquiry learning** framework for computational sciences

Key citations to include:
- Novak et al. (1999) on JiTT
- POGIL Project literature
- Volkamer Lab TeachOpenCADD papers
- Emerging AI-flipped classroom literature (2022-2025)

---

## Part 2: Complete Talktorial ↔ Guided Inquiry Mapping

Below is the complete mapping of all 20 talktorials to prerequisite guided inquiry question sets. Each inquiry set is designed to build the theoretical foundation students need before engaging with the hands-on talktorial.

### Design Principles

1. **Inquiry questions precede talktorials** — Students complete inquiry before attempting the notebook
2. **Questions scaffold from foundational → applied** — Each set builds progressively
3. **Verification is embedded** — At least one question per set requires primary source verification
4. **AI limitations are explored** — At least one question per set probes where AI might struggle
5. **6-Target Portfolio Integration** — Questions connect to students' chosen drug target where appropriate (Weeks 5+)

### 6-Target Portfolio

Students work with ONE target from this portfolio starting in Week 5:

**Table 2. Six-target therapeutic portfolio.** Students select one target in Week 5 and apply all subsequent computational techniques to their chosen target throughout the semester.

| Target | Therapeutic Area | PDB | UniProt | ChEMBL | Reference Drug |
|--------|------------------|-----|---------|--------|----------------|
| **DHFR** | Antibiotics | 1RX1 | P0ABQ4 | CHEMBL202 | Trimethoprim |
| **ABL1** | Cancer (CML) | 1IEP | P00519 | CHEMBL1862 | Imatinib |
| **EGFR** | Cancer (NSCLC) | 1M17 | P00533 | CHEMBL203 | Erlotinib |
| **AChE** | Neurodegeneration | 4EY7 | P22303 | CHEMBL220 | Donepezil |
| **COX-2** | Inflammation | 3LN1 | P35354 | CHEMBL230 | Celecoxib |
| **DPP-4** | Diabetes | 1X70 | P27487 | CHEMBL284 | Sitagliptin |

---

## Module 1: Introduction to AI in Pharmaceuticals (Weeks 1-2)

> **Target-Agnostic Phase**: Weeks 1-4 use diverse examples from multiple therapeutic areas. Students do NOT select their target until Week 5.

### Week 1, Talktorial Set A

#### AI-PSCI-001: Introduction to Google Colab & AI-Assisted Coding
**Talktorial Focus**: Setting up Google Colab, Python basics, AI-assisted coding workflow

**Prerequisite Guided Inquiry Questions**:

1. **What is Google Colab and why has it become essential for computational drug discovery research?**
   - Explore: Cloud computing, GPU access, reproducibility, collaboration features
   - Verify: Find at least one published paper that used Google Colab for drug discovery research

2. **How do pharmaceutical scientists use Python differently than software developers?**
   - Explore: Domain-specific libraries (RDKit, Biopython), data types (molecules, proteins, clinical data), reproducibility requirements
   - Compare: General-purpose Python vs. scientific Python ecosystems

3. **What are the most common data formats used in pharmaceutical research, and why do they matter?**
   - Explore: SMILES, SDF, PDB, FASTA, CSV for clinical data
   - Connect: How each format relates to different stages of drug development

4. **What are the advantages and limitations of cloud-based computational environments for pharmaceutical research?**
   - Explore: Data security, HIPAA compliance, computational resources, cost
   - Verify: Find FDA or regulatory guidance on cloud computing in pharmaceutical development

5. **Where might AI struggle to help you learn Python for pharmaceutical applications?**
   - Explore: Domain-specific conventions, deprecated libraries, version-specific syntax
   - Document: Ask AI about a very recent Python library update and verify its accuracy

---

#### AI-PSCI-002: Effective AI Collaboration & Prompt Engineering
**Talktorial Focus**: Prompt engineering, AI verification strategies, critical evaluation of AI outputs

**Prerequisite Guided Inquiry Questions**:

1. **What are the major categories of AI tools used in pharmaceutical research today?**
   - Explore: Structure prediction (AlphaFold), molecular generation, property prediction, clinical trial optimization
   - Categorize: Which are open-source vs. commercial? Cloud vs. local?

2. **How do large language models (LLMs) like ChatGPT and Claude differ from specialized scientific AI models?**
   - Explore: Training data, capabilities, limitations, hallucination risks
   - Compare: General LLM vs. specialized model (e.g., ESM for proteins)

3. **What is prompt engineering, and why is it critical for using AI effectively in scientific research?**
   - Explore: Specificity, context, iteration, output formatting
   - Practice: Document three versions of a prompt and how the AI response changed

4. **What are the ethical considerations when using AI tools in pharmaceutical research?**
   - Explore: Data privacy, bias in training data, attribution, intellectual property
   - Verify: Find institutional or FDA guidance on AI use in drug development

5. **How should you verify AI-generated code or scientific claims?**
   - Explore: Testing strategies, primary literature verification, expert review
   - Document: Identify a claim AI makes about drug discovery and verify it against primary literature

---

### Week 2, Talktorial Set B

#### AI-PSCI-003: Molecular Representations
**Talktorial Focus**: SMILES notation, PDB format, converting between representations

**Prerequisite Guided Inquiry Questions**:

1. **What is SMILES notation and why was it developed?**
   - Explore: History, syntax rules, canonical vs. non-canonical SMILES
   - Practice: Write the SMILES for aspirin, caffeine, and a molecule of your choice

2. **How do different molecular formats (SMILES, InChI, PDB) serve different purposes?**
   - Explore: 1D (SMILES), 2D (connection tables), 3D (coordinates)
   - Compare: What information is preserved vs. lost in each format?

3. **Why is 3D structure important for understanding drug-target interactions?**
   - Explore: Shape complementarity, binding site geometry, conformational flexibility
   - Example: Find an example where 2D similarity does not predict 3D binding similarity

4. **How do pharmaceutical scientists convert between molecular representations?**
   - Explore: Software tools, coordinate generation, structure optimization
   - Document: What decisions must be made when converting 2D SMILES to 3D coordinates?

5. **What are the limitations of molecular representations for complex drugs (peptides, antibodies)?**
   - Explore: Size limitations, flexibility, post-translational modifications
   - Research: How do representations differ for small molecules vs. biologics?

---

#### AI-PSCI-004: RDKit Fundamentals
**Talktorial Focus**: RDKit library, molecular objects, property calculations, visualization

**Prerequisite Guided Inquiry Questions**:

1. **What is RDKit and why is it the standard cheminformatics toolkit?**
   - Explore: Open-source origins, community, industrial adoption
   - Verify: Find pharmaceutical companies or publications that use RDKit

2. **What molecular properties are most important for drug development?**
   - Explore: Molecular weight, LogP, hydrogen bond donors/acceptors, TPSA
   - Calculate: What are these values for aspirin? For trimethoprim?

3. **How do pharmaceutical scientists use substructure searching in drug discovery?**
   - Explore: SMARTS patterns, pharmacophore searching, scaffold analysis
   - Example: How would you find all compounds containing a sulfonamide group?

4. **What visualizations help communicate molecular structure effectively?**
   - Explore: 2D depictions, 3D renderings, aligned depictions for SAR
   - Compare: When is 2D sufficient vs. when is 3D necessary?

5. **What are common pitfalls when working with molecular data computationally?**
   - Explore: Stereochemistry handling, tautomers, salt forms, standardization
   - Document: Ask AI about handling stereochemistry in RDKit and verify against documentation

---

## Module 2: Cheminformatics Foundations (Weeks 3-4)

### Week 3, Talktorial Set C

#### AI-PSCI-005: Compound Data Acquisition from ChEMBL
**Talktorial Focus**: Querying ChEMBL database, retrieving bioactivity data, data cleaning

**Prerequisite Guided Inquiry Questions**:

1. **What is ChEMBL and why is it considered a gold standard for drug discovery data?**
   - Explore: Data sources, curation process, coverage, update frequency
   - Verify: Find the ChEMBL documentation on data quality and curation standards

2. **How is bioactivity data measured and reported in drug discovery?**
   - Explore: IC50, Ki, EC50, pIC50 — what do these mean and how do they relate?
   - Calculate: If IC50 = 10 nM, what is pIC50?

3. **What are the six drug targets in our portfolio and why were they selected?**
   - Explore: DHFR (antibiotics), ABL1 (CML), EGFR (lung cancer), AChE (Alzheimer's), COX-2 (inflammation), DPP-4 (diabetes)
   - Research: Find one approved drug for each target

4. **How do researchers handle missing or inconsistent bioactivity data?**
   - Explore: Data cleaning strategies, outlier detection, assay variability
   - Compare: How would you handle a compound with IC50 values of 10 nM and 1000 nM from different assays?

5. **What are the limitations of database-derived bioactivity data compared to experimental data you generate yourself?**
   - Explore: Assay conditions, protein variants, measurement variability
   - Document: What information would you need to reproduce a ChEMBL assay result?

---

#### AI-PSCI-006: ADMET Filtering & Drug-Likeness
**Talktorial Focus**: Lipinski's rules, ADMET properties, filtering compound libraries

**Prerequisite Guided Inquiry Questions**:

1. **What is ADMET and why do most drug candidates fail in development?**
   - Explore: Absorption, Distribution, Metabolism, Excretion, Toxicity
   - Verify: Find statistics on drug attrition rates and causes from FDA or pharmaceutical industry reports

2. **What are Lipinski's Rule of Five and its limitations?**
   - Explore: Original rules, exceptions (natural products, antibiotics), "beyond Rule of Five" compounds
   - Analyze: Do the reference drugs for our 6 targets obey Lipinski's rules? (Check trimethoprim, imatinib, erlotinib, donepezil, celecoxib, sitagliptin)

3. **How do computational tools predict toxicity, and how reliable are these predictions?**
   - Explore: QSAR models, structural alerts, in silico toxicity prediction
   - Verify: Compare AI's toxicity prediction for a known toxic compound against actual data

4. **What is the difference between drug-likeness and lead-likeness?**
   - Explore: Different optimization stages, property ranges, synthetic accessibility
   - Connect: Why might early-stage compounds need different filters than late-stage candidates?

5. **How do different therapeutic areas have different ADMET requirements?**
   - Explore: CNS drugs need to cross blood-brain barrier, antibiotics need bacterial penetration
   - Research: Compare ADMET requirements for an Alzheimer's drug (AChE target) vs. a diabetes drug (DPP-4 target)

---

### Week 4, Talktorial Set D

#### AI-PSCI-007: Molecular Fingerprints & Similarity
**Talktorial Focus**: Fingerprint generation, Tanimoto similarity, similarity searching

**Prerequisite Guided Inquiry Questions**:

1. **How do molecular fingerprints encode chemical structure, and why are they useful for drug discovery?**
   - Explore: ECFP/Morgan fingerprints, MACCS keys, bit vectors
   - Compare: What information is preserved vs. lost in fingerprint encoding?

2. **What does "chemical similarity" mean, and how is it measured computationally?**
   - Explore: Tanimoto coefficient, Dice similarity, similarity searching
   - Connect: If two molecules have Tanimoto = 0.8, what does that tell you about their likely biological activity?

3. **How do structural modifications affect drug activity (structure-activity relationships)?**
   - Explore: Pharmacophore concept, bioisosteres, scaffold hopping
   - Example: Find an example of a drug where a small structural change significantly altered activity

4. **How do pharmaceutical companies use similarity searching in drug development programs?**
   - Explore: Lead optimization, analog searching, patent landscaping
   - Research: Find a published example of similarity-based virtual screening

5. **What are the limitations of 2D fingerprints for predicting drug behavior?**
   - Explore: Stereochemistry, conformational flexibility, 3D shape
   - Document: Ask AI to explain when 2D fingerprints fail and verify against literature

---

#### AI-PSCI-008: Compound Clustering & Visualization
**Talktorial Focus**: Clustering molecules, dimensionality reduction (t-SNE, UMAP), chemical space visualization

**Prerequisite Guided Inquiry Questions**:

1. **What is "chemical space" and why is exploring it important for drug discovery?**
   - Explore: Dimensionality, drug-like space, natural product space, exploration strategies
   - Estimate: How many drug-like molecules are theoretically possible?

2. **How do clustering algorithms group similar compounds, and what does this reveal?**
   - Explore: K-means, hierarchical clustering, Butina clustering
   - Connect: Why might compounds in the same cluster have similar biological activity?

3. **What is dimensionality reduction, and how does it help visualize molecular datasets?**
   - Explore: PCA, t-SNE, UMAP — what each preserves and distorts
   - Compare: When would you use t-SNE vs. PCA for drug discovery data?

4. **How can chemical space analysis inform target selection and drug design?**
   - Explore: Comparing chemical space of actives vs. inactives, coverage analysis
   - Research: Find a published example of chemical space analysis in a drug discovery paper

5. **What biases exist in drug discovery datasets, and how might they affect AI models?**
   - Explore: Historical bias, target bias, property bias
   - Document: What types of molecules are underrepresented in ChEMBL?

---

## Module 3: AI Tools for Structural Biology (Weeks 5-6)

> **Target Selection**: Starting with AI-PSCI-009, students select ONE target from the 6-target portfolio. All subsequent work uses their chosen target.

### Week 5, Talktorial Set E

#### AI-PSCI-009: Protein Data Acquisition
**Talktorial Focus**: PDB and UniProt databases, protein structure files, sequence formats
**⭐ TARGET SELECTION HAPPENS HERE**

**Prerequisite Guided Inquiry Questions**:

1. **What is the Protein Data Bank (PDB) and how are structures determined experimentally?**
   - Explore: X-ray crystallography, cryo-EM, NMR — strengths and limitations of each
   - Verify: Find the resolution and method for your chosen target's structure

2. **How do you read a PDB file, and what information does it contain?**
   - Explore: ATOM records, HETATM (ligands), resolution, R-factor, B-factors
   - Practice: What does a high B-factor for an amino acid tell you?

3. **What are the 6 targets in our portfolio, and what makes each clinically important?**
   - Explore each target's therapeutic area, disease relevance, and approved drugs
   - Decide: Which target will you select and why?

4. **How do wild-type and mutant protein structures differ, and why does this matter for drug resistance?**
   - Explore: Resistance mutations, binding site changes, structural plasticity
   - Research: Find a clinically relevant mutation for your chosen target

5. **When should you use an experimental structure vs. a predicted structure (AlphaFold)?**
   - Explore: Confidence scores, experimental validation, drug-bound vs. apo structures
   - Compare: Find your target protein in both PDB and AlphaFold DB and note differences

---

#### AI-PSCI-010: Protein Structure Visualization
**Talktorial Focus**: py3Dmol, NGLview, publication-quality molecular graphics

**Prerequisite Guided Inquiry Questions**:

1. **What visualization approaches best communicate protein structure to different audiences?**
   - Explore: Cartoon, surface, stick representations; when to use each
   - Practice: How would you visualize your target for a scientific paper vs. a general audience?

2. **What makes a protein binding site "druggable"?**
   - Explore: Pocket volume, hydrophobicity, druggability scores
   - Analyze: Locate the binding site in your chosen target — what makes it druggable?

3. **How do mutations in the binding site affect drug binding?**
   - Explore: Resistance mechanisms, binding affinity changes, structural rearrangements
   - Research: Find a documented mutation in your target that affects drug binding

4. **What color schemes and styles are standard in scientific publications?**
   - Explore: Element coloring, secondary structure coloring, surface electrostatics
   - Document: Find examples of molecular graphics in high-impact journals

5. **What are the limitations of static images for understanding protein dynamics?**
   - Explore: Conformational flexibility, induced fit, molecular dynamics
   - Compare: When is a static image sufficient vs. when do you need an animation?

---

### Week 6, Talktorial Set F

#### AI-PSCI-011: AlphaFold2 for Structure Prediction
**Talktorial Focus**: Running ColabFold, interpreting pLDDT and PAE scores, comparing to experimental structures

**Prerequisite Guided Inquiry Questions**:

1. **How did AlphaFold2 revolutionize protein structure prediction, and what are its key innovations?**
   - Explore: CASP competition history, attention mechanisms, MSA processing
   - Verify: Find the original AlphaFold2 paper and note its reported accuracy

2. **What do AlphaFold confidence scores (pLDDT, PAE) tell you, and what are their limitations?**
   - Explore: Per-residue confidence, predicted aligned error, when to trust predictions
   - Interpret: What does pLDDT < 50 mean for a region of your target?

3. **How does ColabFold make AlphaFold accessible, and what are the tradeoffs?**
   - Explore: MMseqs2 vs. jackhmmer, computational requirements, speed vs. accuracy
   - Document: How long does ColabFold take for your target protein?

4. **Can AlphaFold capture the effects of disease or resistance mutations?**
   - Explore: Point mutations, resistance mutations, structural stability
   - Test: What would you expect to see when predicting a mutant vs. wild-type structure?

5. **When should you use AlphaFold vs. searching for an experimental structure for drug design?**
   - Explore: Drug-bound conformations, crystal contacts, physiological conditions
   - Decision: For docking a drug to your target, which structure source would you use?

---

#### AI-PSCI-012: ESMFold for Rapid Structure Prediction
**Talktorial Focus**: ESMFold API, speed vs. accuracy tradeoffs, batch processing

**Prerequisite Guided Inquiry Questions**:

1. **How does ESMFold differ from AlphaFold2 in its approach to structure prediction?**
   - Explore: Language models, single-sequence prediction, no MSA required
   - Compare: Speed, accuracy, computational requirements

2. **What are the advantages of language model-based structure prediction?**
   - Explore: Speed for screening, evolutionary information implicit in model, batch processing
   - Calculate: If AlphaFold takes 15 min and ESMFold takes 2 min, what's the time savings for 100 sequences?

3. **When is ESMFold accuracy "good enough" for drug discovery applications?**
   - Explore: Applications where approximate structures suffice, error tolerance
   - Research: Find published benchmarks comparing ESMFold to AlphaFold2

4. **How do you decide which structure prediction method to use?**
   - Explore: Speed requirements, accuracy needs, resource constraints
   - Decision tree: Create a decision tree for choosing between AlphaFold2 and ESMFold

5. **What are the current limitations of AI structure prediction for drug discovery?**
   - Explore: Ligand-bound conformations, flexible loops, membrane proteins
   - Document: Ask AI about ESMFold limitations and verify against the literature

---

## Module 4: AI-Powered Analysis (Weeks 7-9)

### Week 7, Talktorial Set G

#### AI-PSCI-013: ESM-1v for Variant Effect Prediction
**Talktorial Focus**: ESM-1v language model, log-likelihood scores, mutation effect prediction

**Prerequisite Guided Inquiry Questions**:

1. **What is a protein language model and how does it learn from sequences?**
   - Explore: Transformer architecture, self-supervised learning, evolutionary information
   - Compare: How is training a protein language model similar to/different from training GPT?

2. **How does ESM-1v predict the effects of mutations without any experimental data?**
   - Explore: Zero-shot prediction, log-likelihood scores, conservation signals
   - Interpret: What does a negative log-likelihood ratio mean for a mutation?

3. **How can variant effect prediction inform drug resistance studies?**
   - Explore: Identifying deleterious mutations, prioritizing variants for testing
   - Connect: How would ESM-1v help predict resistance to drugs targeting your target?

4. **What are the limitations of sequence-based variant effect prediction?**
   - Explore: Context-dependent effects, gain-of-function mutations, epistasis
   - Research: Find examples where sequence-based predictions disagreed with experiments

5. **How do you validate computational mutation effect predictions?**
   - Explore: Experimental benchmarks, clinical data, deep mutational scanning
   - Document: What experimental data exists for validating predictions on your target?

---

#### AI-PSCI-014: Building an End-to-End Drug Discovery Pipeline
**Talktorial Focus**: Pipeline integration, workflow automation, reproducibility

**Prerequisite Guided Inquiry Questions**:

1. **What does an end-to-end computational drug discovery pipeline look like?**
   - Explore: Target → structure → compounds → screening → optimization
   - Map: Which AI tools and talktorials fit at each stage?

2. **What are the key principles of reproducible computational research?**
   - Explore: Version control, environment management, documentation standards
   - Practice: How would you ensure someone could reproduce your pipeline in 5 years?

3. **How do you decide which AI tools to combine for a specific drug discovery problem?**
   - Explore: Tool capabilities, data requirements, computational resources
   - Design: What pipeline would you build for your chosen target?

4. **What validation strategies should be built into an automated pipeline?**
   - Explore: Intermediate checkpoints, sanity checks, benchmark comparisons
   - Document: How would you know if your pipeline is producing unreliable results?

5. **How can pipelines be shared and reused across different drug targets?**
   - Explore: Containerization, parameterization, documentation
   - Connect: How would your pipeline need to change to work on a different target?

---

### Week 8, Talktorial Set H (Midterm Week)

#### AI-PSCI-015: Molecular Docking with AutoDock Vina
**Talktorial Focus**: Protein/ligand preparation, docking configuration, pose analysis

**Prerequisite Guided Inquiry Questions**:

1. **What is molecular docking and what problem does it solve in drug discovery?**
   - Explore: Pose prediction, binding affinity estimation, virtual screening
   - History: When was docking first used in drug discovery?

2. **How do docking scoring functions work, and what are their limitations?**
   - Explore: Force field-based, empirical, knowledge-based scoring
   - Compare: Why might a compound rank highly in docking but fail experimentally?

3. **How do you prepare proteins and ligands for docking?**
   - Explore: Adding hydrogens, assigning charges, handling waters, ligand conformations
   - Document: What decisions must you make when preparing your target for docking?

4. **How do you validate a docking protocol?**
   - Explore: Redocking known ligands, RMSD thresholds, enrichment factors
   - Practice: What does RMSD < 2 Å mean for a docking pose?

5. **What factors affect docking accuracy for your specific target?**
   - Explore: Binding site flexibility, water molecules, metal ions
   - Research: Are there published docking studies for your target? What did they find?

---

### Week 9, Talktorial Set I

#### AI-PSCI-016: AI-Powered Docking (DiffDock & GNINA)
**Talktorial Focus**: Diffusion-based docking, CNN-enhanced scoring, method comparison

**Prerequisite Guided Inquiry Questions**:

1. **How does DiffDock use diffusion models for molecular docking?**
   - Explore: Generative modeling, pose generation, confidence estimation
   - Compare: How does this differ from the search-based approach of Vina?

2. **How does GNINA enhance docking with neural networks?**
   - Explore: CNN scoring functions, training data, pose refinement
   - Research: What training data was GNINA trained on?

3. **What are the advantages and disadvantages of AI docking methods vs. classical methods?**
   - Explore: Speed, accuracy, interpretability, applicability domain
   - Document: Compare reported performance of DiffDock vs. Vina in publications

4. **How do you choose between different docking methods for your project?**
   - Explore: Blind docking vs. site-specific, speed requirements, accuracy needs
   - Decision: Which method(s) would you use for your target and why?

5. **How do ensemble approaches improve docking predictions?**
   - Explore: Consensus scoring, pose clustering, confidence weighting
   - Design: How would you combine results from Vina, DiffDock, and GNINA?

---

## Module 5: Validation & Optimization (Weeks 10-12)

### Week 10, Talktorial Set J

#### AI-PSCI-017: Model Validation & Performance Metrics
**Talktorial Focus**: RMSD analysis, cross-validation, method benchmarking, statistical comparison

**Prerequisite Guided Inquiry Questions**:

1. **Why is proper validation critical for drug discovery AI models, and how can it go wrong?**
   - Explore: Data leakage, overfitting, spurious correlations
   - Example: Find a published case where a drug discovery ML model failed to generalize

2. **What metrics should you use to evaluate docking predictions?**
   - Explore: RMSD, scoring correlations, enrichment factors, success rates
   - Calculate: If a docking pose has RMSD = 1.5 Å from the crystal structure, is that good?

3. **How do you compare different AI methods fairly?**
   - Explore: Same test sets, appropriate metrics, statistical significance
   - Design: How would you design a fair comparison of Vina, DiffDock, and GNINA?

4. **What is bootstrap resampling and when should you use it?**
   - Explore: Confidence intervals, significance testing, sample size considerations
   - Calculate: If you bootstrap 1000 times and 95% of R² values are between 0.65-0.72, what does this tell you?

5. **How do you communicate model uncertainty and limitations responsibly?**
   - Explore: Confidence intervals, applicability domain, responsible AI practices
   - Draft: Write a paragraph describing your docking results that honestly conveys uncertainty

---

### Week 11, Talktorial Set K

#### AI-PSCI-018: Debugging & Optimization Strategies
**Talktorial Focus**: Troubleshooting pipelines, error analysis, performance optimization

**Prerequisite Guided Inquiry Questions**:

1. **What are the most common failure modes in computational drug discovery pipelines?**
   - Explore: Data issues, parameter choices, software bugs, resource limitations
   - Categorize: Which errors are silent vs. obvious?

2. **How do you systematically debug a complex multi-tool workflow?**
   - Explore: Isolation testing, intermediate outputs, version control
   - Practice: Describe your debugging strategy when a pipeline produces unexpected results

3. **What optimization strategies improve computational efficiency without sacrificing accuracy?**
   - Explore: Parallelization, GPU utilization, caching, early filtering
   - Calculate: If docking takes 1 minute per compound, how long for 1 million compounds?

4. **How do you handle edge cases and unexpected inputs gracefully?**
   - Explore: Input validation, error handling, logging, documentation
   - Design: What edge cases might occur when processing your target?

5. **What resources exist for getting help when debugging scientific code?**
   - Explore: Documentation, GitHub issues, forums, AI assistants
   - Document: When is AI helpful vs. unhelpful for debugging domain-specific code?

---

### Week 12, Talktorial Set L

#### AI-PSCI-019: Documentation for Reproducibility
**Talktorial Focus**: Code documentation, requirements files, methods writing, GitHub preparation

**Prerequisite Guided Inquiry Questions**:

1. **What makes computational research reproducible, and why does pharmaceutical research demand high reproducibility?**
   - Explore: FAIR principles, regulatory requirements, scientific integrity
   - Verify: Find journal or funder requirements for computational reproducibility

2. **How should you document code for other researchers (and your future self)?**
   - Explore: Comments, docstrings, README files, notebooks vs. scripts
   - Practice: Write documentation for a function you've created this semester

3. **What should a Methods section include for computational drug discovery work?**
   - Explore: Software versions, parameter settings, data sources, hardware
   - Example: Find a well-documented Methods section in a drug discovery paper

4. **What platforms exist for sharing code and data from pharmaceutical AI research?**
   - Explore: GitHub, Zenodo, ChEMBL depositions, journal supplementary information
   - Document: What are the licensing considerations for sharing your work?

5. **How do you balance openness with intellectual property protection in pharmaceutical research?**
   - Explore: Open science vs. proprietary research, patent considerations, preprints
   - Reflect: How would you approach sharing your VIP project work?

---

## Module 6: Integrative Reflection (Weeks 13-14)

### Week 13-14, Talktorial Set M

#### AI-PSCI-020: Communicating AI Results to Stakeholders
**Talktorial Focus**: Visualization, abstracts, plain language summaries, presentations

**Prerequisite Guided Inquiry Questions**:

1. **How do you explain AI/ML concepts to non-technical stakeholders?**
   - Explore: Analogies, visualizations, avoiding jargon
   - Practice: Explain "molecular docking" to a physician without using technical terms

2. **What visualizations effectively communicate drug discovery results?**
   - Explore: Molecular graphics, activity plots, pipeline diagrams
   - Compare: When is a 3D molecular visualization helpful vs. confusing?

3. **How do different stakeholders (scientists, clinicians, regulators, investors) need information presented differently?**
   - Explore: Technical depth, risk communication, business implications
   - Adapt: How would you present the same results to a chemist vs. a business executive?

4. **What makes a compelling scientific abstract and poster?**
   - Explore: Structure (background, methods, results, conclusion), key figures, take-home messages
   - Practice: Write a 150-word abstract summarizing your work on your target

5. **How do you communicate uncertainty and limitations without undermining confidence in your work?**
   - Explore: Honest assessment, contextualization, future directions
   - Draft: Write a "Limitations" paragraph for your project that is honest but constructive

---

## Implementation Guide

### Weekly Workflow (Three-Exposure Learning Cycle)

```
FRIDAY EVENING (Exposure 1: Inquiry Phase Begins)
├── Release guided inquiry questions via class communication channel
├── Students begin exploring 5 questions using AI tools
└── Questions designed to surface key concepts and reveal misconceptions

SATURDAY - SUNDAY
├── Students complete inquiry exploration with AI assistance
├── Document AI interactions in lab notebook:
│   ├── Prompts used
│   ├── Responses received
│   ├── Conflicting information between AI tools
│   └── Unresolved questions
└── Verify key claims against primary sources

SUNDAY (Exposure 2: Talktorial Phase)
├── Release empty talktorial notebook (Google Colab)
├── Students implement concepts through guided coding
├── Write code with AI assistance
└── Verify results against expected outputs

MONDAY
├── Complete talktorial implementation
├── Document technical work in lab notebook
└── Compare approaches with solution notebooks (released Monday)

TUESDAY (Exposure 3: In-Class Synthesis)
├── In-class synthesis session
│   ├── Students walk through inquiry findings
│   ├── Discuss misconceptions and AI errors encountered
│   ├── Faculty provides expert context
│   └── Address unresolved questions
└── Identify gaps for follow-up in next cycle
```

### Target Selection Integration

**Table 3. Target selection timeline.** The curriculum transitions from target-agnostic foundations to target-specific application in Week 5.

| Week | Phase | Target Usage |
|------|-------|--------------|
| 1-4 | Foundation | Target-agnostic (diverse examples) |
| 5 | Selection | Students choose ONE target (AI-PSCI-009) |
| 5-14 | Application | All work uses chosen target |

### Assessment Alignment

**Table 4. Assessment evidence by learning phase.** The dual-phase structure generates distinct evidence types for each component of student assessment.

| Component | Inquiry Phase Evidence | Talktorial Phase Evidence |
|-----------|----------------------|--------------------------|
| **Lab Notebook** | AI interaction logs, verification tables, conceptual reflections | Technical documentation, code explanations, troubleshooting notes |
| **Completion** | Inquiry questions answered with sources | Talktorial runs, produces expected outputs |
| **Quality** | Depth of exploration, verification rigor | Code quality, interpretation accuracy |
| **Integration** | Connections made between concepts | Application to chosen target |

---

## Appendix: Quick Reference

**Table 5. Talktorial quick reference with key verification tasks.** Each talktorial includes at least one verification task requiring students to validate AI-generated information against primary sources.

| Week | Talktorial | Topic | Key Verification Task |
|------|------------|-------|----------------------|
| 1 | AI-PSCI-001 | Google Colab & AI-Assisted Coding | Find paper using Colab for drug discovery |
| 1 | AI-PSCI-002 | Prompt Engineering & AI Verification | Verify an AI claim against literature |
| 2 | AI-PSCI-003 | Molecular Representations | Write SMILES for known drugs |
| 2 | AI-PSCI-004 | RDKit Fundamentals | Calculate properties for drug examples |
| 3 | AI-PSCI-005 | ChEMBL Data Acquisition | Verify ChEMBL curation standards |
| 3 | AI-PSCI-006 | ADMET Filtering | Check Lipinski compliance for 6 targets' drugs |
| 4 | AI-PSCI-007 | Fingerprints & Similarity | Find published similarity search example |
| 4 | AI-PSCI-008 | Clustering & Visualization | Find chemical space analysis paper |
| 5 | AI-PSCI-009 | Protein Data Acquisition ⭐ | Select target, find structure details |
| 5 | AI-PSCI-010 | Protein Visualization | Locate binding site in your target |
| 6 | AI-PSCI-011 | AlphaFold2 Structure Prediction | Find AlphaFold2 accuracy benchmarks |
| 6 | AI-PSCI-012 | ESMFold Rapid Prediction | Compare ESMFold vs AlphaFold speed/accuracy |
| 7 | AI-PSCI-013 | ESM-1v Variant Effects | Research validation data for your target |
| 7 | AI-PSCI-014 | End-to-End Pipeline | Design pipeline for your target |
| 8 | AI-PSCI-015 | AutoDock Vina Docking | Find docking studies for your target |
| 9 | AI-PSCI-016 | DiffDock & GNINA | Compare AI vs classical docking |
| 10 | AI-PSCI-017 | Validation & Metrics | Find model validation example |
| 11 | AI-PSCI-018 | Debugging & Optimization | Calculate screening time estimates |
| 12 | AI-PSCI-019 | Documentation | Find reproducibility requirements |
| 13-14 | AI-PSCI-020 | Communication | Write abstract for your project |

---

*Document Version: 2.1*
*Updated: January 2026*
*Aligned with: CURRICULUM_GUIDE.md, completed talktorial series, and AGIL manuscript three-exposure learning cycle*
*For: VIP AI in Pharmaceutical Sciences — Bench to Bedside, Spring 2026*
