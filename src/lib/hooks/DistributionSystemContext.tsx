"use client";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type DistributionSystemContextType = {
  distributionSystem: string | undefined;
  setDistributionSystem: Dispatch<SetStateAction<string | undefined>>;
  selectedCommand: string;
  setSelectedCommand: Dispatch<SetStateAction<string>>;
};

const distContextDefaultValues: DistributionSystemContextType = {
  distributionSystem: undefined,
  setDistributionSystem: () => "",
  selectedCommand: "",
  setSelectedCommand: () => "",
};

const DistributionSystemContext = createContext<DistributionSystemContextType>(
  distContextDefaultValues
);

export function DistributionSystemProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [distributionSystem, setDistributionSystem] =
    useState<DistributionSystemContextType["distributionSystem"]>();

  const [selectedCommand, setSelectedCommand] = useState("");
  const value = {
    distributionSystem,
    setDistributionSystem,
    selectedCommand,
    setSelectedCommand,
  };

  return (
    <DistributionSystemContext.Provider value={value}>
      {children}
    </DistributionSystemContext.Provider>
  );
}

export function useDistributionSystem() {
  return useContext(DistributionSystemContext);
}
