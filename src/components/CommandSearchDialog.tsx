import * as React from "react";

import type { qrycboProjectList } from "@/app/actions";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDistributionSystem } from "../lib/hooks/DistributionSystemContext";
import { PROJECT_LINKS, SITE_LINKS } from "../lib/siteLinks";

export default function CommandSearchDialog({
  projects,
}: {
  projects: Awaited<ReturnType<typeof qrycboProjectList>>;
}) {
  const router = useRouter();
  const {
    distributionSystem,
    setDistributionSystem,
    setSelectedCommand: setOtherCommand,
    selectedCommand: prevCommand,
  } = useDistributionSystem();
  const [open, setOpen] = React.useState(false);

  const [selectedCommand, setSelectedCommand] = useState(prevCommand);
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (value: (typeof projects)[number], command: string) => {
    setSelectedCommand(command);
    setOtherCommand(command);
    setDistributionSystem(value.projectId);
    setOpen(false);
  };
  return (
    <CommandDialog showCloseButton={false} open={open} onOpenChange={setOpen}>
      <div className="flex w-full flex-1 items-center justify-between">
        <CommandInput
          value={selectedCommand}
          onValueChange={setSelectedCommand}
          placeholder="Type a command or search..."
          name="projectId"
          className="w-full"
        />
      </div>
      <CommandList className="h-[300px]">
        <CommandGroup heading="Projects">
          {projects.map((item) => (
            <CommandItem
              onSelect={(e) => handleSelect(item, e)}
              className={cn(
                "flex w-full justify-between",
                distributionSystem === item.projectId && "bg-green-400"
              )}
              key={item.projectId}>
              <span>
                {item.projectId} | {item.projectTitle}
              </span>
              <p>{" " + item.projectDSID}</p>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Project Pages">
          {PROJECT_LINKS.map((link) => (
            <CommandItem
              key={link.title}
              className="flex w-full justify-between"
              onSelect={() =>
                router.push(`${link.href}/${distributionSystem ?? ""}`)
              }
              asChild>
              <Link href={`${link.href}/${distributionSystem ?? ""}`}>
                <div className="flex items-center gap-2">
                  {link.title} {link.icon}
                </div>
                <p className="text-muted-foreground">{link.description}</p>
              </Link>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Site Pages">
          {SITE_LINKS.map((link) => (
            <CommandItem
              key={link.title}
              className="flex w-full justify-between"
              asChild>
              <Link href={link.href}>
                <div className="flex items-center gap-2">
                  {link.title} {link.icon}
                </div>
                <p className="text-muted-foreground">{link.description}</p>
              </Link>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
