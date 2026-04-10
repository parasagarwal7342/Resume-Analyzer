$commits = @(
    @{ msg = "docs: update project roadmap in README"; file = "README.md"; content = "`n`n## 🗺️ Roadmap`n- [x] AI Resume Parsing`n- [x] ATS Scoring Engine`n- [ ] Multi-language Support`n- [ ] Browser Extension`n" },
    @{ msg = "feat: enhance professional bio with keyword-rich summary"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "Results-driven Cybersecurity Analyst and Information Security specialist with extensive expertise in Penetration Testing, VAPT, and Ethical Hacking."; new = "Results-driven Cybersecurity Analyst and Information Security specialist with extensive expertise in Penetration Testing, VAPT, and Ethical Hacking. Pursuing an M.Tech in Information Security with a focus on Zero-Trust architectures and proactive incident response." },
    @{ msg = "feat: add Metasploit and Burp Suite to offensive security skills"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "Metasploit & Burp Suite"; new = "Metasploit and Burp Suite (Advanced)" },
    @{ msg = "feat: integrate SIEM and SOC Operations into core proficiencies"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "SIEM & SOC Operations"; new = "SIEM and SOC Operations (Splunk/ELK)" },
    @{ msg = "feat: add Zero-Trust Architecture to cybersecurity strategy skills"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "Zero-Trust Architecture"; new = "Zero-Trust Architecture (NIST 800-207)" },
    @{ msg = "feat: add Nmap and Wireshark to networking toolkit"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "Nmap & Wireshark"; new = "Nmap, Wireshark and TCPDump" },
    @{ msg = "feat: quantify database security audit achievements"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "compliance with ISO 27001"; new = "compliance with ISO 27001, SOC2," },
    @{ msg = "feat: add custom Nmap scripting achievements"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "network protocols"; new = "industrial control systems (ICS) protocols" },
    @{ msg = "feat: update Digital Shield project with edge-latency metrics"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "UBS) Engine latency"; new = "UBS) Engine latency on edge nodes" },
    @{ msg = "feat: enhance ReturnShield blockchain verification details"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "blockchain-anchored"; new = "Polygon-anchored" },
    @{ msg = "feat: update AutoCA with Google Gemini AI integration specs"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "Gemini AI"; new = "Gemini 1.5 Pro" },
    @{ msg = "feat: improve HexGuard real-time tampering detection logic"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "real-time file tampering"; new = "sub-millisecond file tampering" },
    @{ msg = "feat: update Sentinel-AI with explainable AI metrics"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "Non-Linear Manipulation Entropy"; new = "SHAP-interpreted Non-Linear Manipulation Entropy" },
    @{ msg = "feat: update Resume Analyzer deployment infrastructure details"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "Google Cloud Run and Firebase Hosting."; new = "Dockerized Google Cloud Run and Firebase." },
    @{ msg = "feat: improve ShadowGuard prompt leakage interception logic"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "browser extension to intercept"; new = "WASM-powered browser extension to intercept" },
    @{ msg = "feat: update Spatial Intel with centimeter-level mapping specs"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "centimeter level"; new = "centimeter-level (sub-5cm)" },
    @{ msg = "feat: enhance ResidentialOS Digital Twin asset monitoring"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "asset monitoring systems"; new = "asset monitoring using MQTT/IoT protocols" },
    @{ msg = "feat: define ATS scoring engine constants and metrics"; file = "artifacts/portfolio/src/pages/AdminPanel.tsx"; old = "const calculateAtsScore = (data: PortfolioData) => {"; new = '/** Real-time ATS Scorer **/`nconst calculateAtsScore = (data: PortfolioData) => {' },
    @{ msg = "feat: implement real-time scoring logic for resume strength"; file = "artifacts/portfolio/src/pages/AdminPanel.tsx"; old = "return Math.round(score);"; new = "// Final Weighted Calculation`n  return Math.round(score);" },
    @{ msg = "feat: update official portfolio live links to production domain"; file = "artifacts/portfolio/src/data/portfolioData.ts"; old = "https://paraditicorp.com"; new = "https://paraditicorp.tech" }
)

foreach ($c in $commits) {
    if ($c.old -and $c.new) {
        $content = Get-Content $c.file -Raw
        $newContent = $content -replace [regex]::Escape($c.old), $c.new
        Set-Content $c.file $newContent
    }
    if ($c.content) {
        Add-Content $c.file $c.content
    }
    git add $c.file
    git commit -m $c.msg
}
