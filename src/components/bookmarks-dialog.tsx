import { useEffect, useState } from "react"
import { MagnifyingGlass } from '@phosphor-icons/react'

import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandGroup, CommandList } from "./ui/command"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./ui/tooltip"
import type { HTMLAttributes } from "astro/types"

type BookmarksDialogProps = HTMLAttributes<'div'> & {
  config: {
    title: string,
    bookmarks: { title: string, url: string }[]
  }[]
}

export default function BookmarksDialog({ config }: BookmarksDialogProps) {
  const [open, setOpen] = useState(false)
  
  useEffect(() => {
    function down(e: KeyboardEvent) {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  function runCommand(command: () => unknown) {
    command()
    setOpen(false)
  }
  
  return (
    <TooltipProvider>
      <div className="relative">
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              aria-label="Search bookmarks"
              variant="outline"
              size='icon'
              className="peer"
              onClick={() => setOpen(true)}
            >
              <MagnifyingGlass />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Search bookmarks</TooltipContent>
        </Tooltip>
        <p className="invisible sm:visible sm:peer-focus:opacity-100 peer-hover:opacity-100 opacity-0 transition-opacity absolute top-1/2 -translate-y-1/2 right-0 translate-x-[calc(100%+8px)] w-max text-sm text-muted-foreground italic">
          or press{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </p>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {config.map((group) => (
            <CommandGroup heading={group.title} key={group.title}>
              {group.bookmarks.map((bookmark) => (
                <CommandItem
                  key={bookmark.url}
                  value={bookmark.title}
                  onSelect={() => runCommand(() => window.open(bookmark.url, "_blank"))}
                >
                  {bookmark.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </TooltipProvider> 
  )
}