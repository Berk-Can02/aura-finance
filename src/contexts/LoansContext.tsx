import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";

export type LoanType = "lent" | "borrowed";
export type LoanStatus = "open" | "settled";

export interface Loan {
  id: string;
  type: LoanType;
  amount: number;
  person: string;
  date: string; // ISO
  description?: string;
  status: LoanStatus;
  createdAt: string;
}

interface LoansContextValue {
  loans: Loan[];
  addLoan: (loan: Omit<Loan, "id" | "createdAt" | "status"> & { status?: LoanStatus }) => void;
  updateLoan: (id: string, patch: Partial<Loan>) => void;
  deleteLoan: (id: string) => void;
  toggleSettled: (id: string) => void;
}

const STORAGE_KEY = "aura.loans";
const LoansContext = createContext<LoansContextValue | null>(null);

const seed: Loan[] = [
  {
    id: "seed-1",
    type: "lent",
    amount: 250,
    person: "Alex Johnson",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    description: "Concert tickets",
    status: "open",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    type: "borrowed",
    amount: 80,
    person: "Sam Lee",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    description: "Lunch & taxi",
    status: "open",
    createdAt: new Date().toISOString(),
  },
];

export function LoansProvider({ children }: { children: ReactNode }) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setLoans(raw ? (JSON.parse(raw) as Loan[]) : seed);
    } catch {
      setLoans(seed);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
  }, [loans, hydrated]);

  const addLoan: LoansContextValue["addLoan"] = useCallback((loan) => {
    setLoans((prev) => [
      {
        ...loan,
        id: crypto.randomUUID(),
        status: loan.status ?? "open",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const updateLoan = useCallback((id: string, patch: Partial<Loan>) => {
    setLoans((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }, []);

  const deleteLoan = useCallback((id: string) => {
    setLoans((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const toggleSettled = useCallback((id: string) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: l.status === "open" ? "settled" : "open" } : l))
    );
  }, []);

  const value = useMemo(
    () => ({ loans, addLoan, updateLoan, deleteLoan, toggleSettled }),
    [loans, addLoan, updateLoan, deleteLoan, toggleSettled]
  );

  return <LoansContext.Provider value={value}>{children}</LoansContext.Provider>;
}

export function useLoans() {
  const ctx = useContext(LoansContext);
  if (!ctx) throw new Error("useLoans must be used within LoansProvider");
  return ctx;
}
