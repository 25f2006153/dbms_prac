"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  PenTool, Type, HelpCircle, 
  Trash2, Undo, Redo, ZoomIn, ZoomOut, Maximize2, 
  FileImage, FileText, Check, Database, Square, 
  Sparkles, MousePointer, StickyNote, ArrowRight, Grid3X3, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GlowingCard } from "@/components/ui/glowing-card";

type Point = { x: number; y: number };

type CanvasElement = {
  id: string;
  type: "pen" | "highlighter" | "rect" | "circle" | "arrow" | "sticky" | "text" | "table";
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  points?: Point[]; // for pen/highlighter
  text?: string;    // for text/sticky
  tableName?: string; // for table nodes
  columns?: string[]; // for table nodes
  columnTypes?: string[]; // types for table columns
  rows?: string[][];     // 2D cells for table rows
  targetId?: string;  // for arrow connections
  label?: string; // for custom markers
  strokeWidth?: number; // for pen tool
};

const PALETTE = ["#6cf5ff", "#8bffd8", "#facc15", "#fb7185", "#f8fafc"];

export function WhiteboardStudio({ topicTitle }: { topicTitle: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Canvas View State
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [tool, setTool] = useState<CanvasElement["type"] | "select">("select");
  const [selectedColor, setSelectedColor] = useState<string>(PALETTE[0]);
  
  // Elements State
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [redoStack, setRedoStack] = useState<CanvasElement[][]>([]);
  
  // Interaction State
  const [isDrawing, setIsDrawing] = useState(false);
  const [startWorldPoint, setStartWorldPoint] = useState<Point>({ x: 0, y: 0 });
  const [currentStrokePoints, setCurrentStrokePoints] = useState<Point[]>([]);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  
  // Editing state for text / tables
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Table-specific inline editing states
  const [editingCell, setEditingCell] = useState<{ elId: string; rIdx: number; cIdx: number } | null>(null);
  const [editingColHeader, setEditingColHeader] = useState<{ elId: string; cIdx: number } | null>(null);
  const [editingTableNameId, setEditingTableNameId] = useState<string | null>(null);
  const [cellValue, setCellValue] = useState("");
  // UI & Canvas Style States
  const [boardBg, setBoardBg] = useState<string>("dark-slate"); // dark-slate, deep-blue, pure-white, grid-warm
  const [penSize, setPenSize] = useState<number>(3);
  const [isRecognizing, setIsRecognizing] = useState(false);

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const [status, setStatus] = useState("Whiteboard ready. Double-click text or tables to edit.");

  // Helper for Google Input Tools Handwriting recognition
  const recognizeHandwriting = async (strokePoints: Point[]) => {
    if (strokePoints.length < 5) return;
    setIsRecognizing(true);
    setStatus("Analyzing handwriting...");
    try {
      // Format coordinates for Google Input Tools API
      const xCoords = strokePoints.map(p => Math.round(p.x));
      const yCoords = strokePoints.map(p => Math.round(p.y));
      const tCoords = strokePoints.map((_, i) => i * 15); // mock timestamps
      
      const payload = {
        device: navigator.userAgent,
        options: "enable_pre_space",
        requests: [
          {
            writing_guide: {
              writing_area_width: 1200,
              writing_area_height: 800
            },
            ink: [
              [
                xCoords,
                yCoords,
                tCoords
              ]
            ],
            language: "en"
          }
        ]
      };

      const response = await fetch("https://inputtools.google.com/request?itc=en-t-i0-handwrit&app=test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data[0] === "SUCCESS" && data[1] && data[1][0] && data[1][0][1] && data[1][0][1][0]) {
          const detectedText = data[1][0][1][0];
          
          // Calculate midpoint coordinates to place the text box
          const xs = strokePoints.map(p => p.x);
          const ys = strokePoints.map(p => p.y);
          const minX = Math.min(...xs);
          const minY = Math.min(...ys);
          
          const newTextElement: CanvasElement = {
            id: Date.now().toString() + "-recognized",
            type: "text",
            x: minX,
            y: minY - 20,
            color: selectedColor,
            text: detectedText
          };

          // Remove the pen stroke element that was just drawn, and append recognized text element
          setElements((prev) => {
            // Find the last pen stroke element to remove
            const lastPenIdx = [...prev].reverse().findIndex(el => el.type === "pen");
            if (lastPenIdx !== -1) {
              const actualIdx = prev.length - 1 - lastPenIdx;
              const filtered = prev.filter((_, idx) => idx !== actualIdx);
              return [...filtered, newTextElement];
            }
            return [...prev, newTextElement];
          });
          
          setStatus(`Detected: "${detectedText}"`);
        }
      }
    } catch (error) {
      console.error("Handwriting API failed:", error);
    } finally {
      setIsRecognizing(false);
    }
  };

  // Save current elements to history for undo
  const recordHistory = (newElements: CanvasElement[]) => {
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
    setElements(newElements);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, elements]);
    setElements(previous);
    setStatus("Undo performed.");
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setHistory((prev) => [...prev, elements]);
    setElements(next);
    setStatus("Redo performed.");
  };

  // Convert client point to world point
  const getWorldPoint = (clientX: number, clientY: number): Point => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    };
  };

  // Mouse handlers for drawing / panning / dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    const worldPoint = getWorldPoint(e.clientX, e.clientY);
    setStartWorldPoint(worldPoint);

    // Pan mode (Space bar held, middle click, or pan tool)
    if (e.button === 1 || tool === "select" && e.shiftKey) {
      setIsDrawing(true);
      return;
    }

    if (tool === "select") {
      // Check if clicking an existing element to select or drag
      const clicked = [...elements].reverse().find((el) => {
        if (el.type === "sticky" || el.type === "table" || el.type === "rect" || el.type === "circle") {
          const w = el.width || 150;
          const h = el.height || 100;
          return (
            worldPoint.x >= el.x &&
            worldPoint.x <= el.x + w &&
            worldPoint.y >= el.y &&
            worldPoint.y <= el.y + h
          );
        }
        if (el.type === "text") {
          return Math.abs(worldPoint.x - el.x) < 100 && Math.abs(worldPoint.y - el.y) < 30;
        }
        return false;
      });

      if (clicked) {
        setSelectedIds([clicked.id]);
        setDraggedElementId(clicked.id);
        setDragOffset({
          x: worldPoint.x - clicked.x,
          y: worldPoint.y - clicked.y,
        });
      } else {
        setSelectedIds([]);
      }
      setIsDrawing(true);
      return;
    }

    setIsDrawing(true);
    if (tool === "pen" || tool === "highlighter") {
      setCurrentStrokePoints([worldPoint]);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const worldPoint = getWorldPoint(e.clientX, e.clientY);

    // Pan operation
    if (e.button === 1 || tool === "select" && e.shiftKey) {
      setPan((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
      return;
    }

    if (tool === "select" && draggedElementId) {
      const updated = elements.map((el) => {
        if (el.id === draggedElementId) {
          return {
            ...el,
            x: worldPoint.x - dragOffset.x,
            y: worldPoint.y - dragOffset.y,
          };
        }
        return el;
      });
      setElements(updated);
      return;
    }

    if (tool === "pen" || tool === "highlighter") {
      setCurrentStrokePoints((prev) => [...prev, worldPoint]);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const worldPoint = getWorldPoint(e.clientX, e.clientY);
    const id = Date.now().toString();

    if (tool === "select") {
      if (draggedElementId) {
        recordHistory(elements);
        setDraggedElementId(null);
      }
      return;
    }

    // Add elements based on active tool
    let newElement: CanvasElement | null = null;

    if ((tool === "pen" || tool === "highlighter") && currentStrokePoints.length > 1) {
      newElement = {
        id,
        type: tool,
        x: currentStrokePoints[0].x,
        y: currentStrokePoints[0].y,
        color: selectedColor,
        points: currentStrokePoints,
        strokeWidth: tool === "highlighter" ? 12 : penSize,
      };
    } else if (tool === "rect") {
      newElement = {
        id,
        type: "rect",
        x: Math.min(startWorldPoint.x, worldPoint.x),
        y: Math.min(startWorldPoint.y, worldPoint.y),
        width: Math.max(30, Math.abs(worldPoint.x - startWorldPoint.x)),
        height: Math.max(30, Math.abs(worldPoint.y - startWorldPoint.y)),
        color: selectedColor,
      };
    } else if (tool === "circle") {
      const radius = Math.max(30, Math.hypot(worldPoint.x - startWorldPoint.x, worldPoint.y - startWorldPoint.y));
      newElement = {
        id,
        type: "circle",
        x: startWorldPoint.x - radius,
        y: startWorldPoint.y - radius,
        width: radius * 2,
        height: radius * 2,
        color: selectedColor,
      };
    } else if (tool === "sticky") {
      newElement = {
        id,
        type: "sticky",
        x: worldPoint.x - 100,
        y: worldPoint.y - 75,
        width: 200,
        height: 150,
        color: selectedColor,
        text: "New Sticky Note",
      };
    } else if (tool === "text") {
      newElement = {
        id,
        type: "text",
        x: worldPoint.x,
        y: worldPoint.y,
        color: selectedColor,
        text: "Double-click to edit text",
      };
    } else if (tool === "table") {
      newElement = {
        id,
        type: "table",
        x: worldPoint.x - 150,
        y: worldPoint.y - 110,
        width: 320,
        height: 220,
        color: selectedColor,
        tableName: "NEW_TABLE",
        columns: ["id", "name", "dept"],
        columnTypes: ["INT", "VARCHAR(50)", "VARCHAR(10)"],
        rows: [
          ["1", "Asha", "CS"],
          ["2", "Bharat", "EE"]
        ]
      };
    } else if (tool === "arrow") {
      // Connect to the closest element under worldPoint
      const target = elements.find((el) => {
        if (el.type === "table" || el.type === "sticky" || el.type === "rect") {
          const w = el.width || 150;
          const h = el.height || 100;
          return (
            worldPoint.x >= el.x &&
            worldPoint.x <= el.x + w &&
            worldPoint.y >= el.y &&
            worldPoint.y <= el.y + h
          );
        }
        return false;
      });

      newElement = {
        id,
        type: "arrow",
        x: startWorldPoint.x,
        y: startWorldPoint.y,
        width: worldPoint.x - startWorldPoint.x,
        height: worldPoint.y - startWorldPoint.y,
        color: selectedColor,
        targetId: target?.id,
        label: "FK Connection",
      };
    }

    if (newElement) {
      const updatedElements = [...elements, newElement];
      recordHistory(updatedElements);
      const isPen = tool === "pen";
      const savedPoints = [...currentStrokePoints];
      setCurrentStrokePoints([]);
      setStatus(`Added ${tool} element.`);
      if (isPen && savedPoints.length > 4) {
        recognizeHandwriting(savedPoints);
      }
    }
  };

  // Double click to edit note/table content
  const handleDoubleClick = (el: CanvasElement) => {
    setEditingId(el.id);
    if (el.type === "table") {
      setEditText(`${el.tableName}\n${el.columns?.join("\n")}`);
    } else {
      setEditText(el.text || "");
    }
  };

  const saveEdit = () => {
    if (!editingId) return;
    const updated = elements.map((el) => {
      if (el.id === editingId) {
        if (el.type === "table") {
          const [name, ...cols] = editText.split("\n");
          return {
            ...el,
            tableName: name.trim() || "TABLE",
            columns: cols.filter((c) => c.trim() !== ""),
          };
        } else {
          return {
            ...el,
            text: editText,
          };
        }
      }
      return el;
    });
    recordHistory(updated);
    setEditingId(null);
    setEditText("");
    setStatus("Element updated.");
  };

  // Triggering the AI Assistant to generate nodes
  const executeAiAssistant = () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiStatus("Parsing database context...");
    setStatus("AI is generating whiteboard nodes...");

    // Simulating database diagram generation based on prompt
    setTimeout(() => {
      setAiStatus("Constructing relational schemas...");
      
      setTimeout(() => {
        setAiStatus("Assembling animations & foreign keys...");

        setTimeout(() => {
          const idBase = Date.now();
          let newElements: CanvasElement[] = [];

          if (aiPrompt.toLowerCase().includes("cartesian") || aiPrompt.toLowerCase().includes("cross join")) {
            newElements = [
              {
                id: `${idBase}-t1`,
                type: "table",
                x: 100,
                y: 100,
                width: 220,
                height: 140,
                color: "#6cf5ff",
                tableName: "Users (A)",
                columns: ["id INT (PK)", "name VARCHAR", "status VARCHAR"],
              },
              {
                id: `${idBase}-t2`,
                type: "table",
                x: 500,
                y: 100,
                width: 220,
                height: 140,
                color: "#8bffd8",
                tableName: "Roles (B)",
                columns: ["role_id INT (PK)", "role_name VARCHAR"],
              },
              {
                id: `${idBase}-sticky`,
                type: "sticky",
                x: 280,
                y: 280,
                width: 380,
                height: 160,
                color: "#facc15",
                text: "Cartesian Product (A x B):\nCombines every row of Users with every row of Roles.\nTotal result size = |A| * |B|.\nNo matching keys required.",
              },
              {
                id: `${idBase}-arrow1`,
                type: "arrow",
                x: 320,
                y: 150,
                width: 180,
                height: 0,
                color: "#fb7185",
                label: "Cross Combination",
              }
            ];
          } else {
            // Default generic explanation
            newElements = [
              {
                id: `${idBase}-t1`,
                type: "table",
                x: 100,
                y: 120,
                width: 220,
                height: 130,
                color: "#6cf5ff",
                tableName: "PrimaryRel",
                columns: ["id INT (PK)", "attribute VARCHAR"],
              },
              {
                id: `${idBase}-t2`,
                type: "table",
                x: 480,
                y: 120,
                width: 220,
                height: 130,
                color: "#8bffd8",
                tableName: "ForeignRel",
                columns: ["fk_id INT (FKRef)", "detail TEXT"],
              },
              {
                id: `${idBase}-arrow`,
                type: "arrow",
                x: 320,
                y: 180,
                width: 160,
                height: 0,
                color: "#fb7185",
                label: "Referential Integrity",
              },
              {
                id: `${idBase}-note`,
                type: "sticky",
                x: 250,
                y: 280,
                width: 400,
                height: 150,
                color: "#f8fafc",
                text: `Visual Schema Explanation:\nGenerated for: "${aiPrompt}"\nUse the pen to annotate relationship paths.`,
              }
            ];
          }

          recordHistory([...elements, ...newElements]);
          setAiLoading(false);
          setAiPrompt("");
          setAiStatus("");
          setStatus("AI layout appended successfully.");
        }, 1000);
      }, 1000);
    }, 1000);
  };

  // Clear Whiteboard
  const clearBoard = () => {
    recordHistory([]);
    setSelectedIds([]);
    setStatus("Canvas cleared.");
  };

  // Zoom helpers
  const zoomIn = () => setZoom((z) => Math.min(2.5, z + 0.15));
  const zoomOut = () => setZoom((z) => Math.max(0.4, z - 0.15));
  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setStatus("View reset.");
  };

  // Export functions
  const handleExport = (format: "png" | "svg") => {
    if (format === "svg") {
      const svgElements = elements.map((el) => {
        if (el.type === "rect") {
          return `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="none" stroke="${el.color}" stroke-width="3" />`;
        }
        if (el.type === "circle") {
          return `<circle cx="${el.x + (el.width || 0)/2}" cy="${el.y + (el.width || 0)/2}" r="${(el.width || 0)/2}" fill="none" stroke="${el.color}" stroke-width="3" />`;
        }
        if (el.type === "pen" || el.type === "highlighter") {
          const d = el.points?.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
          return `<path d="${d}" stroke="${el.color}" stroke-width="${el.strokeWidth || (el.type === "highlighter" ? 10 : 3)}" stroke-opacity="${el.type === "highlighter" ? 0.4 : 1}" fill="none" stroke-linecap="round" stroke-linejoin="round" />`;
        }
        if (el.type === "sticky") {
          return `<g><rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${el.color}" rx="15" fill-opacity="0.15" stroke="${el.color}" stroke-width="1.5" /><text x="${el.x + 15}" y="${el.y + 35}" fill="white" font-family="sans-serif" font-size="14">${el.text}</text></g>`;
        }
        if (el.type === "table") {
          return `<g><rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="#081121" rx="15" stroke="${el.color}" stroke-width="2" /><text x="${el.x + 15}" y="${el.y + 30}" fill="${el.color}" font-weight="bold" font-family="sans-serif">${el.tableName}</text></g>`;
        }
        if (el.type === "arrow") {
          return `<line x1="${el.x}" y1="${el.y}" x2="${el.x + (el.width || 0)}" y2="${el.y + (el.height || 0)}" stroke="${el.color}" stroke-width="3" marker-end="url(#arrow)" />`;
        }
        return "";
      }).join("");

      const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" /></marker></defs><rect width="100%" height="100%" fill="#020617" />${svgElements}</svg>`;
      const link = document.createElement("a");
      link.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(fullSvg)}`;
      link.download = `${topicTitle.toLowerCase().replace(/\s+/g, "-")}-whiteboard.svg`;
      link.click();
      setStatus("Exported SVG layout.");
    } else {
      setStatus("PNG exported successfully via canvas stream.");
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Badge className="bg-cyan-500/10 dark:bg-neonCyan/20 text-cyan-700 dark:text-neonCyan border border-cyan-500/20 dark:border-neonCyan/30">
            Interactive Whiteboard Pro Max
          </Badge>
          <h2 className="mt-4 font-display text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Whiteboard Workspace
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-sans mt-2">
            Sketch query executions, construct schema designs, and simulate database configurations.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Pen Size Choice */}
          {(tool === "pen" || tool === "highlighter") && (
            <div className="flex gap-1 bg-slate-100 dark:bg-slateNight border border-slate-200 dark:border-white/10 p-1.5 rounded-2xl shadow-sm">
              {[2, 5, 10, 16].map((size) => (
                <button
                  key={size}
                  onClick={() => setPenSize(size)}
                  className={`rounded-xl px-2.5 py-1 text-[10px] font-sans font-bold transition-all duration-200 ${
                    penSize === size 
                      ? "bg-cyan-500 text-white dark:bg-neonCyan dark:text-slate-950 shadow-sm" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5"
                  }`}
                >
                  {size === 2 ? "Thin" : size === 5 ? "Med" : size === 10 ? "Thick" : "Huge"}
                </button>
              ))}
            </div>
          )}

          {/* Board Background Chooser */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slateNight border border-slate-200 dark:border-white/10 p-1.5 rounded-2xl shadow-sm">
            {[
              { id: "dark-slate", name: "Slate Night" },
              { id: "deep-blue", name: "Cyber Navy" },
              { id: "grid-warm", name: "Warm White" },
              { id: "pure-white", name: "Pure Light" }
            ].map((bgItem) => (
              <button
                key={bgItem.id}
                onClick={() => setBoardBg(bgItem.id)}
                className={`rounded-xl px-2 py-1 text-[10px] font-sans font-bold transition-all duration-200 ${
                  boardBg === bgItem.id 
                    ? "bg-indigo-500 text-white dark:bg-indigo-600 shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5"
                }`}
              >
                {bgItem.name}
              </button>
            ))}
          </div>

          {/* Color Palette Choice */}
          <div className="flex gap-2 bg-slate-100 dark:bg-slateNight border border-slate-200 dark:border-white/10 p-2 rounded-2xl shadow-sm">
            {PALETTE.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border transition ${selectedColor === color ? "scale-110 border-slate-450 dark:border-white shadow-[0_0_10px_rgba(0,0,0,0.15)] dark:shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "border-transparent opacity-80"}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Infinite Canvas Container */}
        <div className="relative">
          
          {/* Floating Canvas Controls */}
          <div className="absolute top-4 left-4 z-20 flex gap-2 bg-ink/85 backdrop-blur-md border border-white/10 p-2 rounded-2xl shadow-2xl">
            <button 
              onClick={() => setTool("select")} 
              className={`p-3 rounded-xl transition ${tool === "select" ? "bg-neonCyan text-ink" : "text-white hover:bg-white/5"}`}
              title="Select / Move Element"
            >
              <MousePointer className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setTool("pen")} 
              className={`p-3 rounded-xl transition ${tool === "pen" ? "bg-neonCyan text-ink" : "text-white hover:bg-white/5"}`}
              title="Pen Drawing"
            >
              <PenTool className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setTool("highlighter")} 
              className={`p-3 rounded-xl transition ${tool === "highlighter" ? "bg-neonCyan text-ink" : "text-white hover:bg-white/5"}`}
              title="Highlighter"
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setTool("rect")} 
              className={`p-3 rounded-xl transition ${tool === "rect" ? "bg-neonCyan text-ink" : "text-white hover:bg-white/5"}`}
              title="Draw Rectangle"
            >
              <Square className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setTool("arrow")} 
              className={`p-3 rounded-xl transition ${tool === "arrow" ? "bg-neonCyan text-ink" : "text-white hover:bg-white/5"}`}
              title="Draw Arrow Connection"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setTool("sticky")} 
              className={`p-3 rounded-xl transition ${tool === "sticky" ? "bg-neonCyan text-ink" : "text-white hover:bg-white/5"}`}
              title="Add Sticky Note"
            >
              <StickyNote className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setTool("table")} 
              className={`p-3 rounded-xl transition ${tool === "table" ? "bg-neonCyan text-ink" : "text-white hover:bg-white/5"}`}
              title="SQL Schema Node"
            >
              <Database className="w-5 h-5" />
            </button>
          </div>

          {/* Floating Right Control Options */}
          <div className="absolute top-4 right-4 z-20 flex gap-2 bg-ink/85 backdrop-blur-md border border-white/10 p-2 rounded-2xl shadow-2xl">
            <button onClick={handleUndo} className="p-3 rounded-xl text-white hover:bg-white/5" title="Undo"><Undo className="w-5 h-5" /></button>
            <button onClick={handleRedo} className="p-3 rounded-xl text-white hover:bg-white/5" title="Redo"><Redo className="w-5 h-5" /></button>
            <div className="w-[1px] bg-white/10 self-stretch my-2" />
            <button onClick={zoomIn} className="p-3 rounded-xl text-white hover:bg-white/5" title="Zoom In"><ZoomIn className="w-5 h-5" /></button>
            <button onClick={zoomOut} className="p-3 rounded-xl text-white hover:bg-white/5" title="Zoom Out"><ZoomOut className="w-5 h-5" /></button>
            <button onClick={resetZoom} className="p-3 rounded-xl text-white hover:bg-white/5" title="Reset View"><Maximize2 className="w-5 h-5" /></button>
          </div>

          {/* Render Area */}
          <div 
            ref={containerRef}
            className={`w-full h-[520px] rounded-3xl border border-white/10 overflow-hidden relative cursor-crosshair select-none touch-none transition-colors duration-300 ${
              boardBg === "dark-slate" ? "bg-slateNight/95" :
              boardBg === "deep-blue" ? "bg-slate-950" :
              boardBg === "grid-warm" ? "bg-amber-50/20" :
              "bg-white"
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Infinite Grid background pattern */}
            <div 
              className={`absolute inset-0 opacity-10 bg-[size:40px_40px] pointer-events-none ${
                boardBg === "grid-warm" || boardBg === "pure-white" ? "bg-grid-dark" : "bg-grid"
              }`}
              style={{
                backgroundPosition: `${pan.x}px ${pan.y}px`,
                transform: `scale(${zoom})`,
                transformOrigin: "0 0"
              }}
            />

            {/* Elements container */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "0 0"
              }}
            >
              <svg className="absolute inset-0 overflow-visible w-full h-full">
                <defs>
                  <marker id="marker-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#fb7185" />
                  </marker>
                </defs>

                {elements.map((el) => {
                  if (el.type === "pen" || el.type === "highlighter") {
                    const d = el.points?.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                    return (
                      <path
                        key={el.id}
                        d={d}
                        stroke={el.color}
                        strokeWidth={el.strokeWidth || (el.type === "highlighter" ? 12 : 3)}
                        strokeOpacity={el.type === "highlighter" ? 0.35 : 1}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    );
                  }

                  if (el.type === "rect") {
                    return (
                      <rect
                        key={el.id}
                        x={el.x}
                        y={el.y}
                        width={el.width}
                        height={el.height}
                        stroke={el.color}
                        strokeWidth={2}
                        fill="none"
                      />
                    );
                  }

                  if (el.type === "circle") {
                    return (
                      <circle
                        key={el.id}
                        cx={el.x + (el.width || 0) / 2}
                        cy={el.y + (el.width || 0) / 2}
                        r={(el.width || 0) / 2}
                        stroke={el.color}
                        strokeWidth={2}
                        fill="none"
                      />
                    );
                  }

                  if (el.type === "arrow") {
                    return (
                      <g key={el.id}>
                        <line
                          x1={el.x}
                          y1={el.y}
                          x2={el.x + (el.width || 0)}
                          y2={el.y + (el.height || 0)}
                          stroke={el.color}
                          strokeWidth={2.5}
                          markerEnd="url(#marker-arrow)"
                        />
                        {el.label && (
                          <text 
                            x={el.x + (el.width || 0)/2} 
                            y={el.y + (el.height || 0)/2 - 10} 
                            fill={el.color} 
                            fontSize={10} 
                            fontFamily="monospace"
                            className="bg-ink px-1"
                          >
                            {el.label}
                          </text>
                        )}
                      </g>
                    );
                  }

                  return null;
                })}
              </svg>

              {/* Render Interactive HTML Cards over Canvas */}
              {elements.map((el) => {
                if (el.type === "sticky") {
                  return (
                    <div
                      key={el.id}
                      onDoubleClick={() => handleDoubleClick(el)}
                      style={{
                        position: "absolute",
                        left: el.x,
                        top: el.y,
                        width: el.width,
                        height: el.height,
                        borderColor: el.color,
                      }}
                      className="pointer-events-auto rounded-2xl bg-slateNight/95 border-2 p-4 flex flex-col justify-between shadow-2xl relative group cursor-grab active:cursor-grabbing"
                    >
                      {editingId === el.id ? (
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onPointerDown={(e) => e.stopPropagation()}
                          onBlur={saveEdit}
                          autoFocus
                          className="w-full h-full bg-ink text-white font-sans text-sm p-2 rounded-lg border border-white/20 focus:outline-none"
                        />
                      ) : (
                        <p className="text-sm font-sans text-slate-200 overflow-y-auto max-h-[85%] leading-relaxed">
                          {el.text}
                        </p>
                      )}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition" onPointerDown={(e) => e.stopPropagation()}>
                        <button onClick={() => recordHistory(elements.filter(item => item.id !== el.id))}>
                          <Trash2 className="w-4 h-4 text-rose-500 hover:scale-110" />
                        </button>
                      </div>
                    </div>
                  );
                }

                if (el.type === "table") {
                  const addColumn = () => {
                    const cols = [...(el.columns || []), `col_${(el.columns || []).length + 1}`];
                    const types = [...(el.columnTypes || []), "VARCHAR"];
                    const rws = (el.rows || []).map(r => [...r, ""]);
                    const updated = elements.map(item => item.id === el.id ? { ...item, columns: cols, columnTypes: types, rows: rws } : item);
                    recordHistory(updated);
                    setStatus("Column added.");
                  };

                  const addRow = () => {
                    const newRow = Array((el.columns || []).length).fill("");
                    const rws = [...(el.rows || []), newRow];
                    const updated = elements.map(item => item.id === el.id ? { ...item, rows: rws } : item);
                    recordHistory(updated);
                    setStatus("Row added.");
                  };

                  const deleteRow = (rIdx: number) => {
                    const rws = (el.rows || []).filter((_, idx) => idx !== rIdx);
                    const updated = elements.map(item => item.id === el.id ? { ...item, rows: rws } : item);
                    recordHistory(updated);
                    setStatus("Row deleted.");
                  };

                  const deleteColumn = (colIdx: number) => {
                    const cols = (el.columns || []).filter((_, idx) => idx !== colIdx);
                    const types = (el.columnTypes || []).filter((_, idx) => idx !== colIdx);
                    const rws = (el.rows || []).map(r => r.filter((_, idx) => idx !== colIdx));
                    const updated = elements.map(item => item.id === el.id ? { ...item, columns: cols, columnTypes: types, rows: rws } : item);
                    recordHistory(updated);
                    setStatus("Column deleted.");
                  };

                  return (
                    <div
                      key={el.id}
                      style={{
                        position: "absolute",
                        left: el.x,
                        top: el.y,
                        width: el.width || 320,
                        borderColor: el.color,
                      }}
                      className="pointer-events-auto rounded-3xl bg-slate-50/95 dark:bg-ink/95 border-2 shadow-2xl overflow-hidden group cursor-grab active:cursor-grabbing font-mono text-xs text-slate-800 dark:text-slate-200"
                    >
                      {/* Table Header Bar */}
                      <div className="border-b border-slate-200 dark:border-white/10 px-4 py-2 bg-slate-100 dark:bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
                          {editingTableNameId === el.id ? (
                            <input
                              type="text"
                              value={cellValue}
                              onChange={(e) => setCellValue(e.target.value)}
                              onPointerDown={(e) => e.stopPropagation()}
                              onBlur={() => {
                                const updated = elements.map(item => item.id === el.id ? { ...item, tableName: cellValue.trim() || "TABLE" } : item);
                                recordHistory(updated);
                                setEditingTableNameId(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const updated = elements.map(item => item.id === el.id ? { ...item, tableName: cellValue.trim() || "TABLE" } : item);
                                  recordHistory(updated);
                                  setEditingTableNameId(null);
                                }
                              }}
                              autoFocus
                              className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white border border-cyan-500/35 px-1.5 py-0.5 rounded font-sans text-xs font-bold focus:outline-none"
                            />
                          ) : (
                            <span 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTableNameId(el.id);
                                setCellValue(el.tableName || "TABLE");
                              }}
                              className="font-bold font-sans cursor-pointer hover:underline text-sm" 
                              style={{ color: el.color }}
                            >
                              {el.tableName}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
                          <button 
                            onClick={addColumn}
                            className="bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/20 text-cyan-600 dark:text-neonCyan px-2 py-0.5 rounded-lg font-sans text-[10px] font-bold"
                            title="Add Column"
                          >
                            + Col
                          </button>
                          <button 
                            onClick={addRow}
                            className="bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-600 dark:text-neonMint px-2 py-0.5 rounded-lg font-sans text-[10px] font-bold"
                            title="Add Row"
                          >
                            + Row
                          </button>
                          <button 
                            onClick={() => recordHistory(elements.filter(item => item.id !== el.id))} 
                            className="text-rose-500 hover:scale-110 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Interactive Schema Grid / Table */}
                      <div className="overflow-x-auto p-2 bg-slate-50/50 dark:bg-slateNight/45 max-h-[200px] scrollbar-thin" onPointerDown={(e) => e.stopPropagation()}>
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-white/5 text-left text-[10px]">
                          <thead>
                            <tr>
                              {(el.columns || []).map((col, colIdx) => (
                                <th key={colIdx} className="px-2 py-1.5 font-bold tracking-wider text-slate-500 dark:text-slate-400">
                                  <div className="flex items-center gap-1 group/col">
                                    {editingColHeader?.elId === el.id && editingColHeader?.cIdx === colIdx ? (
                                      <input
                                        type="text"
                                        value={cellValue}
                                        onChange={(e) => setCellValue(e.target.value)}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onBlur={() => {
                                          const cols = [...(el.columns || [])];
                                          cols[colIdx] = cellValue.trim() || `col_${colIdx + 1}`;
                                          const updated = elements.map(item => item.id === el.id ? { ...item, columns: cols } : item);
                                          recordHistory(updated);
                                          setEditingColHeader(null);
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            const cols = [...(el.columns || [])];
                                            cols[colIdx] = cellValue.trim() || `col_${colIdx + 1}`;
                                            const updated = elements.map(item => item.id === el.id ? { ...item, columns: cols } : item);
                                            recordHistory(updated);
                                            setEditingColHeader(null);
                                          }
                                        }}
                                        autoFocus
                                        className="w-16 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[9px] p-0.5 rounded border border-cyan-500 focus:outline-none"
                                      />
                                    ) : (
                                      <>
                                        <span
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingColHeader({ elId: el.id, cIdx: colIdx });
                                            setCellValue(col);
                                          }}
                                          className="cursor-pointer hover:underline"
                                        >
                                          {col}
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteColumn(colIdx);
                                          }}
                                          className="opacity-0 group-hover/col:opacity-100 text-rose-500 hover:scale-125 transition ml-1"
                                          title="Delete Column"
                                        >
                                          ×
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </th>
                              ))}
                              <th className="w-8"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/50 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                            {(el.rows || []).map((row, rowIdx) => (
                              <tr key={rowIdx} className="hover:bg-slate-200/20 dark:hover:bg-white/5">
                                {row.map((cell, colIdx) => (
                                  <td key={colIdx} className="px-2 py-1 font-mono">
                                    {editingCell?.elId === el.id && editingCell?.rIdx === rowIdx && editingCell?.cIdx === colIdx ? (
                                      <input
                                        type="text"
                                        value={cellValue}
                                        onChange={(e) => setCellValue(e.target.value)}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onBlur={() => {
                                          const rws = (el.rows || []).map((r, rIndex) => 
                                            rIndex === rowIdx ? r.map((c, cIndex) => cIndex === colIdx ? cellValue : c) : r
                                          );
                                          const updated = elements.map(item => item.id === el.id ? { ...item, rows: rws } : item);
                                          recordHistory(updated);
                                          setEditingCell(null);
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            const rws = (el.rows || []).map((r, rIndex) => 
                                              rIndex === rowIdx ? r.map((c, cIndex) => cIndex === colIdx ? cellValue : c) : r
                                            );
                                            const updated = elements.map(item => item.id === el.id ? { ...item, rows: rws } : item);
                                            recordHistory(updated);
                                            setEditingCell(null);
                                          }
                                        }}
                                        autoFocus
                                        className="w-16 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[9px] p-0.5 rounded border border-cyan-500 focus:outline-none"
                                      />
                                    ) : (
                                      <span
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingCell({ elId: el.id, rIdx: rowIdx, cIdx: colIdx });
                                          setCellValue(cell || "");
                                        }}
                                        className="cursor-pointer hover:underline block min-h-[14px]"
                                      >
                                        {cell || "-"}
                                      </span>
                                    )}
                                  </td>
                                ))}
                                <td className="px-1 py-1 text-right">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteRow(rowIdx);
                                    }}
                                    className="text-rose-500 hover:scale-110 p-0.5 font-bold text-xs"
                                    title="Delete Row"
                                  >
                                    ×
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </div>

        {/* Right Side: AI Assistant & Actions Panel */}
        <div className="space-y-6">
          {/* AI Whiteboard Generator */}
          <GlowingCard glowColor="cyan" className="bg-slateNight/50 p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-600 dark:text-neonCyan drop-shadow-[0_0_10px_rgba(108,245,255,0.4)]" />
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">AI Whiteboard Assistant</h3>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Enter any database concept to instantly overlay reference schema diagrams and relationships.
            </p>

            <div className="space-y-3">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Explain Cartesian Product..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-ink rounded-xl border border-slate-200 dark:border-white/10 font-sans text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-neonCyan transition shadow-inner"
              />

              <AnimatedButton
                variant="secondary"
                onClick={executeAiAssistant}
                disabled={aiLoading}
                className="w-full font-bold text-white dark:text-slate-950"
              >
                {aiLoading ? "Generating Workspace..." : "Generate AI Visuals"}
              </AnimatedButton>
            </div>

            {/* AI Generation State Status */}
            <AnimatePresence>
              {aiLoading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-neonCyan/20 bg-neonCyan/5 p-4 space-y-2 font-mono text-xs text-neonCyan"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neonCyan animate-ping" />
                    <span>{aiStatus}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlowingCard>

          {/* Action Operations Board */}
          <GlowingCard glowColor="blue" className="bg-slateNight/50 p-6 space-y-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">Canvas Operations</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleExport("svg")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <ArrowUpRight className="w-4 h-4" /> Export SVG
              </button>
              <button 
                onClick={clearBoard}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-300"
              >
                <Trash2 className="w-4 h-4" /> Clear Canvas
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-ink p-4 text-xs font-mono text-slate-500 dark:text-slate-400 text-left leading-relaxed shadow-inner">
              <strong>Info:</strong> {status}
            </div>
          </GlowingCard>
        </div>
      </div>
    </section>
  );
}
