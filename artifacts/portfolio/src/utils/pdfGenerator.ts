import { PortfolioData } from "../data/portfolioData";
import { jsPDF } from "jspdf";

export const generateResume = (data: PortfolioData) => {
  // Sanitize data to replace non-standard characters like ₹ which are not supported by standard PDF fonts
  // Also clean up any potential weird whitespace characters
  const sanitize = (text: string) => {
    if (!text) return "";
    return text
      .replace(/₹/g, "INR ")
      .replace(/\u00A0/g, " ") // Replace non-breaking spaces
      .trim();
  };

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let y = 15;

  // Helper for Section Headers
  const addSectionHeader = (title: string) => {
    if (y > pageHeight - 30) {
      doc.addPage();
      y = 15;
    }
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(title, margin, y);
    y += 6;
  };

  // Header Section - Single Column, Left Aligned
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text(sanitize(data.personal.name), margin, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(`Location: ${sanitize(data.personal.location)}`, margin, y);
  y += 5;
  doc.text(`Phone: ${sanitize(data.personal.phone)}`, margin, y);
  y += 5;
  doc.text(`Email: ${sanitize(data.personal.email)}`, margin, y);
  y += 5;
  doc.text(`Portfolio: ${sanitize(data.personal.website.replace("https://", ""))}`, margin, y);
  y += 10;
  
  // Professional Summary
  addSectionHeader("Professional Summary");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const splitBio = doc.splitTextToSize(sanitize(data.personal.bio), contentWidth);
  doc.text(splitBio, margin, y);
  y += (splitBio.length * 5) + 4;

  // Education
  addSectionHeader("Education");
  data.education.forEach((edu) => {
    if (y > pageHeight - 20) { doc.addPage(); y = 15; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(sanitize(edu.degree), margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(sanitize(`${edu.startDate} - ${edu.endDate}`), pageWidth - margin, y, { align: "right" });
    y += 4.5;
    doc.text(sanitize(`${edu.institution} | ${edu.field}`), margin, y);
    y += 6;
  });

  // Core Skills
  addSectionHeader("Technical Skills");
  const skillsByCategory: Record<string, string[]> = {};
  data.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill.name);
  });

  doc.setFontSize(10);
  Object.entries(skillsByCategory).forEach(([category, skills]) => {
    if (y > pageHeight - 15) { doc.addPage(); y = 15; }
    doc.setFont("helvetica", "bold");
    doc.text(sanitize(`${category}:`), margin, y);
    doc.setFont("helvetica", "normal");
    const skillList = skills.join(", ");
    const splitSkills = doc.splitTextToSize(sanitize(skillList), contentWidth - 45);
    doc.text(splitSkills, margin + 42, y);
    y += (splitSkills.length * 5) + 1.5;
  });

  y += 4;

  // Work Experience
  addSectionHeader("Work Experience");
  data.experience.forEach((exp) => {
    if (y > pageHeight - 30) { doc.addPage(); y = 15; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text(sanitize(exp.role), margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(sanitize(`${exp.startDate} - ${exp.endDate}`), pageWidth - margin, y, { align: "right" });
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text(sanitize(exp.company), margin, y);
    doc.setTextColor(0, 0, 0);
    y += 5.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    exp.achievements.forEach(ach => {
      const splitAch = doc.splitTextToSize(sanitize(`• ${ach}`), contentWidth - 5);
      if (y > pageHeight - 15) { doc.addPage(); y = 15; }
      doc.text(splitAch, margin + 2, y);
      y += (splitAch.length * 5);
    });
    y += 4;
  });

  // Projects & Entrepreneurship
  addSectionHeader("Technical Projects");
  data.projects.forEach((proj) => {
    if (y > pageHeight - 40) { doc.addPage(); y = 15; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    const title = sanitize(`${proj.name} | ${proj.subtitle}`);
    doc.text(title, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(sanitize(proj.year), pageWidth - margin, y, { align: "right" });
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const splitDesc = doc.splitTextToSize(sanitize(proj.description), contentWidth);
    doc.text(splitDesc, margin, y);
    y += (splitDesc.length * 5) + 2;
    doc.setFont("helvetica", "bold");
    doc.text("Technologies: ", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(sanitize(proj.techStack.join(", ")), margin + 25, y);
    y += 8;
  });

  // Certifications
  addSectionHeader("Certifications");
  data.certifications.forEach((cert) => {
    if (y > pageHeight - 15) { doc.addPage(); y = 15; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(sanitize(cert.name), margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(sanitize(cert.date), pageWidth - margin, y, { align: "right" });
    y += 4.5;
    doc.setFontSize(9);
    doc.text(sanitize(`${cert.issuer} | Credential ID: ${cert.credentialId}`), margin, y);
    y += 5;
  });

  // Virtual Internships
  addSectionHeader("Virtual Internships");
  data.jobSimulations.forEach((sim) => {
    if (y > pageHeight - 20) { doc.addPage(); y = 15; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(sanitize(`${sim.company} - ${sim.program}`), margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(sanitize(sim.date), pageWidth - margin, y, { align: "right" });
    y += 4.5;
    doc.setFontSize(9);
    const splitSimDesc = doc.splitTextToSize(sanitize(sim.description), contentWidth);
    doc.text(splitSimDesc, margin, y);
    y += (splitSimDesc.length * 4.5) + 2;
  });

  doc.save(`${data.personal.name.replace(" ", "_")}_Resume.pdf`);
};

export const generateCoverLetter = (data: PortfolioData) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(10, 14, 23);
  doc.text(data.personal.name.toUpperCase(), 20, y);
  
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`${data.personal.location}`, 20, y);
  y += 5;
  doc.text(`${data.personal.phone} | ${data.personal.email}`, 20, y);
  y += 5;
  const website = data.personal.website || "https://portfolio-a6ccb.web.app";
  doc.text(`${data.personal.linkedin.replace("https://", "")} | ${website.replace("https://", "")}`, 20, y);

  y += 20;
  
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.setTextColor(10, 14, 23);
  doc.text(today, 20, y);
  y += 10;
  doc.text("Dear Hiring Manager,", 20, y);
  y += 10;

  doc.setFontSize(11);
  const p1 = `I am writing to express my strong interest in joining your team as a Cybersecurity Professional. With a foundation in Penetration Testing, Ethical Hacking, and Vulnerability Assessment, coupled with my entrepreneurial experience as the Founder of Paravion Tech, I bring a unique blend of offensive security expertise and product-building vision.`;
  const splitP1 = doc.splitTextToSize(p1, pageWidth - 40);
  doc.text(splitP1, 20, y);
  y += (splitP1.length * 5) + 5;

  const p2 = `Currently pursuing my M.Tech in Information Security at Netaji Subhas University of Technology, I have dedicated myself to understanding the complexities of the digital frontier. Through my hands-on certifications, including CEH and Penetration Testing from Craw Security, and my practical experience in developing zero-trust fraud prevention systems, I have honed my ability to identify vulnerabilities and engineer robust defenses.`;
  const splitP2 = doc.splitTextToSize(p2, pageWidth - 40);
  doc.text(splitP2, 20, y);
  y += (splitP2.length * 5) + 5;

  const p3 = `What sets me apart is my ability to approach security both as a hacker and an architect. At Paravion Tech, I've built AI-powered security OS prototypes designed to intercept digital payment fraud in real-time. This dual perspective ensures that I not only understand how systems break but also how to build them securely from the ground up.`;
  const splitP3 = doc.splitTextToSize(p3, pageWidth - 40);
  doc.text(splitP3, 20, y);
  y += (splitP3.length * 5) + 5;

  const p4 = `I am eager to bring my relentless drive, technical acumen, and strategic mindset to your organization. I have attached my resume for your review and would welcome the opportunity to discuss how my skills align with your security objectives.`;
  const splitP4 = doc.splitTextToSize(p4, pageWidth - 40);
  doc.text(splitP4, 20, y);
  y += (splitP4.length * 5) + 15;

  doc.text("Sincerely,", 20, y);
  y += 15;
  doc.setFont("helvetica", "bold");
  doc.text(data.personal.name, 20, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text(data.personal.title, 20, y);

  doc.save(`${data.personal.name.replace(" ", "_")}_Cover_Letter.pdf`);
};
