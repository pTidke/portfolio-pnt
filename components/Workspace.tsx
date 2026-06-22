"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { JumpItem, ModalId, SectionId, ViewId } from "@/lib/types";
import { accentColor, PROJECTS } from "@/lib/data";
import { modalLabel, modalNav } from "@/lib/graph";
import {
  WindowChrome,
  FileTree,
  ConsoleDock,
  MobileTopBar,
  MobileAskBar,
} from "./chrome";
import NavHeader, { type NavKey } from "./nav";
import Dag from "./dag";
import Modal from "./modal";
import { Section } from "./sections";
import CommandPalette from "./palette";
import MobileLineage from "./mobile-lineage";
import BootSequence from "./boot";

const ACCENT = accentColor.blue;

const MOBILE_ORDER: SectionId[] = [
  "about",
  "education",
  "certificates",
  "experience",
  "skills",
  "p1",
  "p2",
  "p3",
  "p4",
  "p5",
  "p6",
  "gallery",
  "contact",
];

export default function Workspace() {
  const [view, setView] = useState<ViewId>("overview");
  const [modalId, setModalId] = useState<ModalId | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteMode, setPaletteMode] = useState<"jump" | "ask">("jump");
  const [booted, setBooted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [vw, setVw] = useState(1200);

  useEffect(() => {
    setMounted(true);
    setVw(window.innerWidth);
    const onResize = () => setVw(window.innerWidth);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteMode("ask"); // ⌘K jumps straight into the AI assistant
        setPaletteOpen((p) => !p);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
        setModalId(null);
      }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const mobile = mounted && vw < 880;

  const goHome = useCallback(() => {
    setModalId(null);
    setView("overview");
  }, []);
  const expand = useCallback((v: Exclude<ViewId, "overview">) => {
    setModalId(null);
    setView(v);
  }, []);
  const openModal = useCallback((m: ModalId) => setModalId(m), []);
  const closeModal = useCallback(() => setModalId(null), []);

  const onNav = useCallback(
    (key: NavKey) => {
      setPaletteOpen(false);
      if (key === "about") openModal("about");
      else if (key === "contact") openModal("contact");
      else if (key === "skills") openModal("skills");
      else if (key === "education") openModal("education");
      else expand(key as Exclude<ViewId, "overview">);
    },
    [expand, openModal],
  );

  // file tree / palette: map a SectionId to the right action
  const openSection = useCallback(
    (id: SectionId) => {
      setPaletteOpen(false);
      if (id === "about" || id === "identity") openModal("about");
      else if (id === "contact") openModal("contact");
      else if (id === "experience") expand("experience");
      else if (id === "education") openModal("education");
      else if (id === "skills") openModal("skills");
      else if (id === "certificates") openModal("certificates");
      else if (id === "gallery") openModal("gallery");
      else if (id.startsWith("p")) {
        const i = PROJECTS.findIndex((p) => p.id === id);
        if (i >= 0) openModal(`proj:${i}`);
      }
    },
    [expand, openModal],
  );

  const activeFile: SectionId | undefined = useMemo(() => {
    if (modalId) {
      if (modalId === "about") return "about";
      if (modalId === "contact") return "contact";
      if (modalId === "education") return "education";
      if (modalId === "skills") return "skills";
      if (modalId === "certificates") return "certificates";
      if (modalId === "gallery") return "gallery";
      const [kind, n] = modalId.split(":");
      if (kind === "proj") return PROJECTS[Number(n)].id;
    }
    if (view === "experience") return "experience";
    if (view === "about") return "about";
    return undefined;
  }, [modalId, view]);

  const activeNav: NavKey | null = modalId
    ? modalNav(modalId)
    : view === "overview"
      ? null
      : (view as NavKey);

  const openJump = useCallback(() => {
    setPaletteMode("jump");
    setPaletteOpen(true);
  }, []);
  const openAsk = useCallback(() => {
    setPaletteMode("ask");
    setPaletteOpen(true);
  }, []);

  const handleJump = useCallback(
    (item: JumpItem) => {
      setPaletteOpen(false);
      if (item.modal) openModal(item.modal);
      else if (item.id) openSection(item.id);
    },
    [openModal, openSection],
  );

  const jumpTo = useCallback((id: SectionId) => {
    document
      .getElementById(`m-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <AnimatePresence>
        {!booted && <BootSequence onDone={() => setBooted(true)} />}
      </AnimatePresence>

      <div
        className="mx-auto flex w-full max-w-[1480px] flex-col overflow-hidden border border-line-mid bg-window"
        style={
          mobile
            ? { maxWidth: 640 }
            : {
                height: "calc(100vh - 32px)",
                boxShadow: "var(--shadow-window)",
              }
        }
      >
        {mobile ? (
          <MobileTopBar onOpenPalette={openAsk} />
        ) : (
          <>
            <WindowChrome onOpenPalette={openJump} />
            <NavHeader
              view={view}
              modalLabel={modalId ? modalLabel(modalId) : null}
              activeNav={activeNav}
              accent={ACCENT}
              onHome={goHome}
              onNav={onNav}
            />
          </>
        )}

        <div className={mobile ? "block" : "flex min-h-0 flex-1"}>
          {!mobile && (
            <FileTree
              activeSection={activeFile}
              activeModal={modalId}
              accent={ACCENT}
              onOpenSection={openSection}
              onOpenModal={openModal}
            />
          )}

          <div
            className={
              mobile
                ? "bg-window"
                : "dot-grid min-w-0 flex-1 overflow-y-auto bg-window"
            }
          >
            {mobile ? (
              <>
                <MobileLineage onJump={jumpTo} />
                {MOBILE_ORDER.map((id) => (
                  <div key={id} id={`m-${id}`} className="scroll-mt-2">
                    <Section id={id} accent={ACCENT} />
                  </div>
                ))}
              </>
            ) : (
              <Dag
                view={view}
                onExpand={expand}
                onModal={openModal}
                onHome={goHome}
              />
            )}
          </div>
        </div>

        {mobile ? (
          <MobileAskBar onOpenPalette={openAsk} />
        ) : (
          <ConsoleDock onAsk={openAsk} onJump={openJump} />
        )}
      </div>

      {!mobile && <Modal id={modalId} accent={ACCENT} onClose={closeModal} />}

      <CommandPalette
        open={paletteOpen}
        initialMode={paletteMode}
        accent={ACCENT}
        onClose={() => setPaletteOpen(false)}
        onJump={handleJump}
      />
    </>
  );
}
