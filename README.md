
# PharmaGuard | Pharmacogenomic Risk Engine

![PharmaGuard Banner](app/icon.png)

**Live Console:** [https://pharma-guard-sigma.vercel.app/](https://pharma-guard-sigma.vercel.app/)

> **Precision Pharmacogenomics for Clinical Excellence.**
>
> PharmaGuard is a Next.js-based clinical decision support system designed to automate the interpretation of pharmacogenomic (PGx) data. It translates raw VCF genomic data into actionable, evidence-based medication safety reports in milliseconds.

## 🎯 Problem Statement

**For Lab Technicians & Geneticists:**
Analyzing patient genomic data against medication guidelines is currently a manual, error-prone, and time-consuming process. Lab technicians must:
1.  Parse raw VCF files manually.
2.  Cross-reference hundreds of variants with CPIC/PharmGKB guidelines.
3.  Calculate complex star-allele activity scores.
4.  Draft clinical reports by hand.

**The Solution:**
PharmaGuard automates this entire pipeline. We use a **deterministic inference engine** to map genotype to phenotype with 100% reproducibility, providing instant "Traffic Light" safety assessments for drugs based on a patient's unique genetic profile.

## 👥 Target Audience

*   **Primary User:** Clinical Lab Technicians
*   **Secondary User:** Pharmacists & Genetic Counselors

**Key Use Cases:**
1.  **High-Throughput Analysis:** Instantly process VCF files to screen for dangerous drug-gene interactions.
2.  **Clinical Reporting:** Generate PDF-ready, JSON-standardized reports for Electronic Health Records (EHR).
3.  **Risk Management:** Flag "High Risk" (PM/UM) phenotypes before a prescription is written.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   npm / yarn / pnpm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/anuragkumart16/PharmaGuard.git
    cd PharmaGuard
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000
    # Add other necessary keys here if applicable
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Access the Console**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Documentation

PharmaGuard exposes a RESTful API for integration with Laboratory Information Management Systems (LIMS).

| Method | Endpoint | Description | Payload / Params |
| :--- | :--- | :--- | :--- |
| **POST** | `/api` | **Core Analysis Engine.** Uploads a VCF file and returns a full clinical risk report. | `FormData`: `file` (VCF)<br>`Query`: `?drug=Name` |
| **GET** | `/api` | **System Health.** Returns the engine status and supported gene list. | None |
| **GET** | `/api/history` | **Available History.** Retrieves the list of past analysis reports for the logged-in user. | `Query`: `?email=user@com` |
| **POST** | `/api/history` | **Archive Report.** Saves a newly generated report to the permanent patient record. | JSON Body: Report Object |
| **POST** | `/api/auth/signup` | **Practitioner Registration.** Creates a new lab technician account. | `{ firstName, lastName, email, password }` |
| **POST** | `/api/auth/login` | **Practitioner Access.** Authenticates a user and returns a session token. | `{ email, password }` |

### Sample Analysis Response (`POST /api`)
```json
{
  "patient_id": "HG002",
  "drug": "Codeine",
  "risk_assessment": {
    "risk_label": "High Risk",
    "risk_score": 85,
    "confidence_score": 0.99
  },
  "pharmacogenomic_profile": {
    "primary_gene": "CYP2D6",
    "phenotype": "Ultrarapid Metabolizer"
  }
}
```

---

## 🛠️ Technology Stack

*   **Frontend:** Next.js 14, React, Tailwind CSS, Framer Motion
*   **Engine:** Node.js, Custom VCF Parser, CPIC-based Logic Gates
*   **Authentication:** Custom JWT/Session Implementation
*   **Design:** Lucide Icons, Glassmorphism UI

---

## Team Members

*   Anurag Kumar Tiwari
*   Param Khodiyar
*   Aarush Gupta
*   Harshil Valecha
