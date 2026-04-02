import { useState, useEffect, useCallback } from "react";
import { portfolioData as defaultData, PortfolioData } from "../data/portfolioData";

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(defaultData);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio_admin_edits");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults in case shape changed
        setData({ ...defaultData, ...parsed });
      } catch (e) {
        console.error("Failed to parse saved portfolio data", e);
      }
    }
  }, []);

  const updateData = useCallback((newData: PortfolioData) => {
    setData(newData);
    localStorage.setItem("portfolio_admin_edits", JSON.stringify(newData));
  }, []);

  const resetData = useCallback(() => {
    setData(defaultData);
    localStorage.removeItem("portfolio_admin_edits");
  }, []);

  return { data, updateData, resetData };
}
