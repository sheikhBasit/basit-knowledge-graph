import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { ProjectGraph, GraphNode } from "../types";

interface Props {
  slug: string;
  height?: number;
}

const DEPTH_COLORS = [
  "var(--node-0)",
  "var(--node-1)",
  "var(--node-2)",
  "var(--node-3)",
];
const DEPTH_RADII = [16, 11, 7, 4];

type SimNode = GraphNode & d3.SimulationNodeDatum;
type SimLink = { source: SimNode; target: SimNode };

export default function GraphView({ slug, height = 420 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [graph, setGraph] = useState<ProjectGraph | null>(null);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/data/${slug}.json`)
      .then((r) => r.json())
      .then((g: ProjectGraph) => {
        setGraph(g);
        const rootId = g.nodes.find((n) => n.depth === 0)?.id;
        if (rootId) setVisibleIds(new Set([rootId]));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!graph || !svgRef.current || loading) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth || 600;
    const h = height;

    const visibleNodes = graph.nodes.filter((n) =>
      visibleIds.has(n.id),
    ) as SimNode[];
    const visibleEdges = graph.edges
      .filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target))
      .map((e) => ({ ...e }));

    const sim = d3
      .forceSimulation<SimNode>(visibleNodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, d3.SimulationLinkDatum<SimNode>>(
            visibleEdges as d3.SimulationLinkDatum<SimNode>[],
          )
          .id((d) => d.id)
          .distance(70),
      )
      .force("charge", d3.forceManyBody().strength(-220))
      .force("center", d3.forceCenter(width / 2, h / 2))
      .force(
        "collision",
        d3.forceCollide<SimNode>((d) => DEPTH_RADII[d.depth] + 10),
      );

    const g = svg.append("g");

    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 3])
        .on("zoom", (e) => g.attr("transform", e.transform)),
    );

    const link = g
      .append("g")
      .selectAll("line")
      .data(visibleEdges)
      .join("line")
      .attr("stroke", "#2d1f4e")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.8);

    const node = g
      .append("g")
      .selectAll<SVGGElement, SimNode>("g")
      .data(visibleNodes)
      .join("g")
      .style("cursor", "pointer")
      .call(
        d3
          .drag<SVGGElement, SimNode>()
          .on("start", (event, d) => {
            if (!event.active) sim.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) sim.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      )
      .on("click", (_e, d: SimNode) => {
        if (d.children.length === 0) return;
        setVisibleIds((prev) => {
          const next = new Set(prev);
          const allVisible = d.children.every((c) => prev.has(c));
          if (allVisible) {
            const collapse = (id: string) => {
              const n = graph.nodes.find((n) => n.id === id);
              if (!n) return;
              next.delete(id);
              n.children.forEach(collapse);
            };
            d.children.forEach(collapse);
          } else {
            d.children.forEach((c) => next.add(c));
          }
          return next;
        });
      })
      .on("mouseover", (event, d: SimNode) => {
        const rect = containerRef.current?.getBoundingClientRect();
        const x = event.clientX - (rect?.left ?? 0) + 12;
        const y = event.clientY - (rect?.top ?? 0) - 8;
        setTooltip({ x, y, text: d.summary });
      })
      .on("mouseout", () => setTooltip(null));

    node
      .append("circle")
      .attr("r", (d) => DEPTH_RADII[d.depth])
      .attr("fill", (d) => DEPTH_COLORS[d.depth])
      .attr("stroke", "var(--bg)")
      .attr("stroke-width", 2)
      .attr("filter", (d) =>
        d.depth === 0 ? "drop-shadow(0 0 8px var(--node-0))" : "none",
      );

    node
      .append("text")
      .text((d) => (d.label.length > 18 ? d.label.slice(0, 16) + "…" : d.label))
      .attr("dy", (d) => DEPTH_RADII[d.depth] + 11)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--text-muted)")
      .attr("font-size", (d) => Math.max(8, 11 - d.depth * 1.5))
      .attr("pointer-events", "none");

    node
      .filter((d) => d.children.length > 0)
      .append("text")
      .text((d) => {
        const allVisible = d.children.every((c) => visibleIds.has(c));
        return allVisible ? "−" : "+";
      })
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "var(--bg)")
      .attr("font-size", (d) => DEPTH_RADII[d.depth] * 0.9)
      .attr("font-weight", 700)
      .attr("pointer-events", "none");

    sim.on("tick", () => {
      link
        .attr("x1", (d) => (d as unknown as SimLink).source.x ?? 0)
        .attr("y1", (d) => (d as unknown as SimLink).source.y ?? 0)
        .attr("x2", (d) => (d as unknown as SimLink).target.x ?? 0)
        .attr("y2", (d) => (d as unknown as SimLink).target.y ?? 0);
      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      sim.stop();
    };
  }, [graph, visibleIds, height, loading]);

  if (loading)
    return (
      <div
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-faint)",
          fontSize: "0.85rem",
        }}
      >
        Loading graph…
      </div>
    );

  return (
    <div ref={containerRef} style={{ position: "relative", height }}>
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        style={{ display: "block" }}
      />
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "0.4rem 0.7rem",
            fontSize: "0.75rem",
            maxWidth: "220px",
            zIndex: 10,
            color: "var(--text)",
            pointerEvents: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          {tooltip.text}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: "0.5rem",
          right: "0.5rem",
          display: "flex",
          gap: "0.5rem",
          fontSize: "0.65rem",
          color: "var(--text-faint)",
        }}
      >
        {(
          [
            ["Project", "var(--node-0)"],
            ["Folder", "var(--node-1)"],
            ["File", "var(--node-2)"],
            ["Symbol", "var(--node-3)"],
          ] as [string, string][]
        ).map(([label, color]) => (
          <span
            key={label}
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: color,
                display: "inline-block",
              }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
