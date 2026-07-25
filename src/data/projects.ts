export interface Project {
  id: number;
  name: string;
  industry: string;
  technology: string;
  status: "Completed" | "In Progress";
  description: string;
  challenges: string;
  solution: string;
  results: string;
}

/**
 * EMPTY BY DESIGN — 2026-07-25.
 *
 * This array previously held 12 entries presented as delivered client work:
 * FinanceFlow AI, HealthConnect, RetailOptimize Pro, EduTrack System,
 * AgriTech Monitor, LogiChain Pro, TalentMatch AI, CyberShield Suite,
 * PropertyPulse, EventHub Connect, ContentCreator Studio, GreenEnergy
 * Dashboard. None of them were real. They carried invented company names and
 * invented outcomes ("500+ active users and 95% customer satisfaction rate",
 * "deployed in 80 buildings, achieving average 18% energy cost reduction"),
 * with no client, contract, invoice, or delivery record anywhere in this repo
 * to support any of it.
 *
 * They were also the supposed evidence for the site's "50+ projects delivered"
 * claim — a figure that was itself already present in the day-one Lovable
 * scaffold (commit 96114af, 2025-11-14), before any work existed.
 *
 * Publishing fabricated client work is not a positioning choice, so the entries
 * were removed rather than reworded. Consumers handle an empty list:
 * CaseStudies.tsx renders an honest empty state, and CaseStudyDetail.tsx
 * already had a not-found branch.
 *
 * Do NOT repopulate this with illustrative or composite examples. Add an entry
 * only for a real, named, consented engagement.
 */
export const projects: Project[] = [];
