<div align="center"> 
  
 <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=30&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=Resume+Analyzer+%F0%9F%93%84;AI-Powered+Resume+Intelligence;Match.+Optimize.+Get+Hired." alt="Typing SVG" /> 
  
 <br/> 
  
 [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) 
 [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) 
 [![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://netlify.com) 
 [![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com) 
 [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE) 
  
 <br/> 
  
 > **Parse smarter. Match better. Land the job.**   
 > An AI-powered resume analyzer that extracts insights, scores job compatibility, and helps you stand out. 
  
 <br/> 
  
 [🚀 Live Demo](#demo) · [📖 Documentation](#docs) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues) 
  
 <br/> 
  
 ![Resume Analyzer Banner](https://via.placeholder.com/900x300/6366F1/ffffff?text=Resume+Analyzer+-+AI+Powered+Resume+Intelligence)  
  
 </div> 
  
 --- 
  
 ## ✨ Features 
  
 <table> 
 <tr> 
 <td width="50%"> 
  
 ### 🧠 AI-Powered Parsing 
 Intelligently extracts skills, experience, education, and achievements from any resume format using advanced OpenAI GPT models. 
  
 </td> 
 <td width="50%"> 
  
 ### 🎯 Job Matching 
 Compares your resume against job descriptions with a compatibility score and gap analysis. 
  
 </td> 
 </tr> 
 <tr> 
 <td width="50%"> 
  
 ### 📊 Skills Intelligence 
 Identifies skill clusters, highlights technical proficiencies, and suggests relevant improvements. 
  
 </td> 
 <td width="50%"> 
  
 ### 💡 Smart Recommendations 
 Generates actionable, personalized suggestions to improve your resume's impact. 
  
 </td> 
 </tr> 
 <tr> 
 <td width="50%"> 
  
 ### 🎨 Modern UI 
 A sleek, responsive dashboard built with Radix UI, Framer Motion, and Tailwind CSS. 
  
 </td> 
 <td width="50%"> 
  
 ### 🛠️ Monorepo Power 
 Cleanly separated frontend, backend, and shared libraries using a high-performance pnpm workspace. 
  
 </td> 
 </tr> 
 </table> 
  
 --- 
  
 ## 🏗️ Architecture 
  
 ``` 
 Resume-Analyzer/ 
 ├── 📁 artifacts/            # Main applications 
 │   ├── 📁 portfolio/        # Frontend React application 
 │   ├── 📁 api-server/       # Backend Express API 
 │   └── 📁 mockup-sandbox/   # UI Component sandbox 
 ├── 📁 lib/                  # Shared libraries & integrations 
 │   ├── 📁 integrations-openai-ai-server/ # OpenAI logic 
 │   ├── 📁 api-zod/          # Shared validation schemas 
 │   ├── 📁 db/               # Database & ORM configuration 
 │   └── ... 
 ├── 📁 attached_assets/      # Example resumes & static assets 
 ├── 📁 scripts/              # Build & utility scripts 
 ├── 📄 package.json          # Workspace configuration 
 ├── 📄 .vercel.json          # Vercel deployment config 
 └── 📄 netlify.toml          # Netlify deployment config 
 ``` 
  
 --- 
  
 ## 🚀 Getting Started 
  
 ### Prerequisites 
  
 - Node.js `v20+` 
 - pnpm `v9+` 
  
 ```bash 
 npm install -g pnpm 
 ``` 
  
 ### Installation 
  
 ```bash 
 # 1. Clone the repository 
 git clone https://github.com/parasagarwal7342/Resume-Analyzer.git 
 cd Resume-Analyzer 
  
 # 2. Install dependencies 
 pnpm install 
  
 # 3. Set up environment variables 
 cp .env.example .env 
 # Add your API keys to .env 
  
 # 4. Start the development server 
 pnpm dev 
 ``` 
  
 --- 
  
 ## 🔧 Configuration 
  
 Create a `.env` file in the root directory: 
  
 ```env 
 # AI Provider 
 AI_INTEGRATIONS_OPENAI_API_KEY=your_openai_api_key 
 AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1 
  
 # Database 
 DATABASE_URL=your_database_connection_string 
  
 # Admin Auth 
 ADMIN_PASSWORD=your_secure_password 
 ``` 
  
 --- 
  
 ## 📦 Deployment 
  
 <details> 
 <summary><b>Deploy to Netlify</b></summary> 
  
 ```bash 
 # Install Netlify CLI 
 npm install -g netlify-cli 
  
 # Deploy 
 netlify deploy --prod 
 ``` 
  
 Or click the button below: 
  
 [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/parasagarwal7342/Resume-Analyzer) 
  
 </details> 
  
 <details> 
 <summary><b>Deploy to Vercel</b></summary> 
  
 ```bash 
 # Install Vercel CLI 
 npm install -g vercel 
  
 # Deploy 
 vercel --prod 
 ``` 
  
 Or click the button below: 
  
 [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/parasagarwal7342/Resume-Analyzer) 
  
 </details> 
  
 --- 
  
 ## 🛠️ Tech Stack 
  
 | Category | Technology | 
 |----------|-----------| 
 | **Language** | TypeScript | 
 | **Frontend** | React, Vite, Tailwind CSS | 
 | **Backend** | Node.js, Express.js | 
 | **Database** | PostgreSQL, Drizzle ORM | 
 | **AI Engine** | OpenAI GPT Models | 
 | **Deployment** | Netlify / Vercel | 
  
 --- 
  
 ## 📊 How It Works 
  
 ```mermaid 
 graph LR 
     A[📄 Upload Resume] --> B[🔍 AI Parser] 
     B --> C[📊 Skills Extractor] 
     B --> D[🏢 Experience Analyzer] 
     C --> E[🎯 Job Matcher] 
     D --> E 
     E --> F[📈 Score & Report] 
     F --> G[💡 Recommendations] 
 ``` 
  
 1. **Upload** your resume (PDF, DOCX, or plain text). 
 2. **AI parses** the document using GPT models, extracting structured data. 
 3. **Match** against a job description (optional). 
 4. **Receive** a detailed score, gap analysis, and professional PDF summary. 
  
 --- 
  
 ## 🤝 Contributing 
  
 Contributions are welcome! Here's how to get started: 
  
 1. **Fork** the repository. 
 2. Create your feature branch: `git checkout -b feature/amazing-feature`. 
 3. Commit your changes: `git commit -m 'feat: add amazing feature'`. 
 4. Push to the branch: `git push origin feature/amazing-feature`. 
 5. Open a **Pull Request**. 
  
 --- 
  
 ## 📄 License 
  
 This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details. 
  
 --- 
  
 ## 🙏 Acknowledgements 
  
 - [OpenAI](https://openai.com/) — AI backbone for parsing and analysis. 
 - [Radix UI](https://www.radix-ui.com/) — Accessible primitive components. 
 - [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework. 
  
 --- 
  
 <div align="center"> 
  
 **Built with ❤️ by [Paras Agarwal](https://github.com/parasagarwal7342)** 
  
 ⭐ If you found this helpful, please star this repo! 
  
 </div> 
