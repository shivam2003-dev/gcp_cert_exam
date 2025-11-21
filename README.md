# Google Cloud Associate Cloud Engineer (ACE) Certification Course

A complete self-study course website for the Google Cloud Associate Cloud Engineer certification exam, built with Docusaurus and deployed on GitHub Pages.

## 🎯 Course Overview

This course provides comprehensive coverage of all exam domains for the Google Cloud Associate Cloud Engineer certification:

- Setting up a cloud solution environment
- Planning and configuring a cloud solution
- Deploying and implementing a cloud solution
- Ensuring successful operation of a cloud solution
- Configuring access and security

## 📚 Course Structure

The course is organized into 9 modules plus practice exams:

1. **Setting Up Cloud Solution Environment** - Projects, billing, APIs, gcloud SDK
2. **Identity & Access Management (IAM)** - IAM fundamentals, service accounts, roles, policies
3. **Networking Fundamentals** - VPC, firewall rules, load balancing, DNS, CDN
4. **Compute Services** - Compute Engine, GKE, Cloud Run, App Engine, Cloud Functions
5. **Storage Services** - Cloud Storage, Persistent Disks, Cloud SQL, Spanner, Firestore, Bigtable
6. **Managed Services & Databases** - BigQuery, Pub/Sub, Cloud Endpoints
7. **Monitoring, Logging & Operations** - Cloud Monitoring, Logging, Trace, Error Reporting
8. **Security Best Practices** - Encryption, Secret Manager, Cloud Armor, Binary Authorization
9. **Deployment & CI/CD** - Cloud Build, Deployment Manager, Terraform basics

Each module includes:
- Learning objectives
- Detailed explanations with examples
- CLI snippets and configuration samples
- Exam tips, warnings, and notes
- Practice questions (50+ MCQs and 30+ scenario-based questions)
- Answer keys with detailed explanations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Basic knowledge of cloud computing concepts

### Installation

1. Clone this repository:
```bash
git clone https://github.com/shivam2003-dev/gcp_cert_exam.git
cd gcp_cert_exam
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

This generates static content into the `build` directory.

### Deployment to GitHub Pages

1. **Configure the repository:**
   - Go to your repository Settings → Pages
   - Set Source to "GitHub Actions"

2. **Configuration:**
   - The `docusaurus.config.mjs` is already configured for this repository
   - URL: https://shivam2003-dev.github.io
   - Base URL: /gcp_cert_exam/

3. **Push to main branch:**
   - The GitHub Actions workflow will automatically deploy the site

## 📖 How to Use This Course

1. **Follow the learning path:** Start with Module 1 and progress sequentially
2. **Hands-on practice:** Use the Google Cloud Free Tier to practice concepts
3. **Review practice questions:** Complete all practice questions at the end of each module
4. **Take practice exams:** Use the full-length practice exams to assess readiness
5. **Review answer keys:** Understand why answers are correct or incorrect

## 🎓 Learning Path

The course is designed as a **4-6 week self-study program**:

- **Week 1:** Modules 1-2 (Setup, IAM)
- **Week 2:** Modules 3-4 (Networking, Compute)
- **Week 3:** Modules 5-6 (Storage, Managed Services)
- **Week 4:** Modules 7-8 (Operations, Security)
- **Week 5:** Module 9 (Deployment) + Review
- **Week 6:** Practice Exams + Final Review

## 📝 License

This course material is provided for educational purposes. Please refer to Google Cloud's official documentation for the most up-to-date information.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📚 Additional Resources

- [Official ACE Exam Guide](https://cloud.google.com/certification/cloud-engineer)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Google Cloud Free Tier](https://cloud.google.com/free)
- [Google Cloud Training](https://cloud.google.com/training)

## ⚠️ Important Notes

- This course is designed to supplement, not replace, hands-on experience with Google Cloud
- Always refer to official Google Cloud documentation for production deployments
- Exam content may change; verify current exam guide before taking the exam
- Practice questions are designed to test understanding, not replicate exact exam questions
