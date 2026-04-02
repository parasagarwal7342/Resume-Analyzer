import { PortfolioData } from "../data/portfolioData";
import { jsPDF } from "jspdf";

export const generateResume = (data: PortfolioData) => {
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
  doc.setTextColor(10, 14, 23); // Dark
  doc.text(data.personal.name.toUpperCase(), 20, y);
  
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`${data.personal.location} | ${data.personal.phone} | ${data.personal.email}`, 20, y);
  y += 5;
  doc.text(`${data.personal.linkedin} | ${data.personal.github}`, 20, y);

  y += 12;
  
  // Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(10, 14, 23);
  doc.text("PROFESSIONAL SUMMARY", 20, y);
  y += 2;
  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 240, 255); // Cyan line
  doc.line(20, y, pageWidth - 20, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  
  const splitBio = doc.splitTextToSize(data.personal.bio, pageWidth - 40);
  doc.text(splitBio, 20, y);
  y += (splitBio.length * 5) + 8;

  // Experience
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(10, 14, 23);
  doc.text("EXPERIENCE", 20, y);
  y += 2;
  doc.line(20, y, pageWidth - 20, y);
  y += 6;

  data.experience.forEach((exp) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(exp.role, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${exp.startDate} - ${exp.endDate}`, pageWidth - 20, y, { align: "right" });
    y += 5;
    doc.setFont("helvetica", "italic");
    doc.text(exp.company, 20, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    exp.achievements.forEach(ach => {
      const splitAch = doc.splitTextToSize(`• ${ach}`, pageWidth - 45);
      doc.text(splitAch, 25, y);
      y += (splitAch.length * 5);
    });
    y += 4;
  });

  y += 4;

  // Projects
  if (y > 250) { doc.addPage(); y = 20; }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(10, 14, 23);
  doc.text("PROJECTS & STARTUP (Paraditi Corp)", 20, y);
  y += 2;
  doc.line(20, y, pageWidth - 20, y);
  y += 6;

  data.projects.forEach((proj) => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const title = `${proj.name} ${proj.isParaditiCorp ? "(Paraditi Corp)" : ""}`;
    doc.text(title, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(proj.year, pageWidth - 20, y, { align: "right" });
    y += 5;
    doc.setFont("helvetica", "italic");
    doc.text(proj.subtitle, 20, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitDesc = doc.splitTextToSize(proj.description, pageWidth - 40);
    doc.text(splitDesc, 20, y);
    y += (splitDesc.length * 5) + 2;
    doc.setFont("helvetica", "italic");
    doc.text(`Tech: ${proj.techStack.join(", ")}`, 20, y);
    y += 6;
  });

  // Education
  if (y > 250) { doc.addPage(); y = 20; }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(10, 14, 23);
  doc.text("EDUCATION", 20, y);
  y += 2;
  doc.line(20, y, pageWidth - 20, y);
  y += 6;

  data.education.forEach((edu) => {
    if (y > 280) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(edu.degree, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${edu.startDate} - ${edu.endDate}`, pageWidth - 20, y, { align: "right" });
    y += 5;
    doc.text(`${edu.institution} - ${edu.field}`, 20, y);
    y += 6;
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
  doc.text(`${data.personal.linkedin}`, 20, y);

  y += 20;
  
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.setTextColor(10, 14, 23);
  doc.text(today, 20, y);
  y += 10;
  doc.text("Dear Hiring Manager,", 20, y);
  y += 10;

  doc.setFontSize(11);
  const p1 = `I am writing to express my strong interest in joining your team as a Cybersecurity Professional. With a foundation in Penetration Testing, Ethical Hacking, and Vulnerability Assessment, coupled with my entrepreneurial experience as the Founder of Paraditi Corp, I bring a unique blend of offensive security expertise and product-building vision.`;
  const splitP1 = doc.splitTextToSize(p1, pageWidth - 40);
  doc.text(splitP1, 20, y);
  y += (splitP1.length * 5) + 5;

  const p2 = `Currently pursuing my M.Tech in Information Security at Netaji Subhas University of Technology, I have dedicated myself to understanding the complexities of the digital frontier. Through my hands-on certifications, including CEH and Penetration Testing from Craw Security, and my practical experience in developing zero-trust fraud prevention systems, I have honed my ability to identify vulnerabilities and engineer robust defenses.`;
  const splitP2 = doc.splitTextToSize(p2, pageWidth - 40);
  doc.text(splitP2, 20, y);
  y += (splitP2.length * 5) + 5;

  const p3 = `What sets me apart is my ability to approach security both as a hacker and an architect. At Paraditi Corp, I've built AI-powered security OS prototypes designed to intercept digital payment fraud in real-time. This dual perspective ensures that I not only understand how systems break but also how to build them securely from the ground up.`;
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
