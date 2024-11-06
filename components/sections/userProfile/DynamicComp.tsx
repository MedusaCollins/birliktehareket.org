"use client";

import { useParams } from "next/navigation";
import SavedWalks from "./savedWalks";
import AttendedWalks from "./attendedWalks";
import OrganizedWalks from "./organizedWalks";

interface SectionMap {
  attendedwalks: JSX.Element;
  organizedwalks: JSX.Element;
  savedwalks: JSX.Element;
}

export default function DynamicComponent(): JSX.Element {
  const { section } = useParams<{ section: string }>();

  const sectionMap: SectionMap = {
    attendedwalks: <AttendedWalks />,
    organizedwalks: <OrganizedWalks />,
    savedwalks: <SavedWalks />,
  };

  return sectionMap[section as keyof SectionMap] || null;
}
