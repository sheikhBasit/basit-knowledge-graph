import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { ProjectGraph, GraphNode } from "../types";

interface Props {
  slug: string;
  onBack: () => void;
}

const DEPTH_COLORS = ["#58a6ff", "#3fb950", "#f0883e", "#a371f7"];
const DEPTH_RADII = [18, 12, 8, 5];

export default function GraphView({ slug, onBack }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [graph, setGraph] = useState<ProjectGraph | null>(null);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  useEffect(() => {
    fetch(`/data/${slug}.json`)
      .then((r) => r.json())
      .then((g: ProjectGraph) => {
        setGraph(g);
        const rootId = g.nodes.find((n) => n.depth === 0)?.id;
        if (rootId) setVisibleIds(new Set([rootId]));
      });
  }, [slug]);

  useEffect(() => {
    if (!graph || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const visibleNodes = graph.nodes.filter((n) => visibleIds.has(n.id));
    const visibleEdges = graph.edges.filter(
      (e) => visibleIds.has(e.source) && visibleIds.has(e.target),
    );

    const sim = d3
      .forceSimulation(visibleNodes as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink(
            visibleEdges as d3.SimulationLinkDatum<d3.SimulationNodeDatum>[],
          )
          .id((d: d3.SimulationNodeDatum) => (d as GraphNode).id)
          .distance(80),
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(30));

    const g = svg.append("g");
    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .on("zoom", (e) => g.attr("transform", e.transform)) as d3.ZoomBehavior<
        SVGSVGElement,
        unknown
      >,
    );

    const link = g
      .append("g")
      .selectAll("line")
      .data(visibleEdges)
      .join("line")
      .attr("stroke", "#30363d")
      .attr("stroke-width", 1.5);

    const node = g
      .append("g")
      .selectAll<SVGGElement, GraphNode>("g")
      .data(visibleNodes)
      .join("g")
      .style("cursor", "pointer")
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) sim.alphaTarget(0.3).restart();
            (d as d3.SimulationNodeDatum).fx = (d as d3.SimulationNodeDatum).x;
            (d as d3.SimulationNodeDatum).fy = (d as d3.SimulationNodeDatum).y;
          })
          .on("drag", (event, d) => {
            (d as d3.SimulationNodeDatum).fx = event.x;
            (d as d3.SimulationNodeDatum).fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) sim.alphaTarget(0);
            (d as d3.SimulationNodeDatum).fx = null;
            (d as d3.SimulationNodeDatum).fy = null;
          }),
      )
      .on("click", (_event, d: GraphNode) => {
        if (d.children.length === 0) return;
        setVisibleIds((prev) => {
          const next = new Set(prev);
          const allChildrenVisible = d.children.every((c) => prev.has(c));
          if (allChildrenVisible) {
            const collect = (id: string) => {
              const n = graph.nodes.find((n) => n.id === id);
              if (!n) return;
              next.delete(id);
              n.children.forEach(collect);
            };
            d.children.forEach(collect);
          } else {
            d.children.forEach((c) => next.add(c));
          }
          return next;
        });
      })
      .on("mouseover", (event, d: GraphNode) => {
        setTooltip({
          x: event.clientX + 12,
          y: event.clientY - 8,
          text: d.summary,
        });
      })
      .on("mouseout", () => setTooltip(null));

    node
      .append("circle")
      .attr("r", (d) => DEPTH_RADII[d.depth])
      .attr("fill", (d) => DEPTH_COLORS[d.depth])
      .attr("stroke", "#0d1117")
      .attr("stroke-width", 2);

    node
      .append("text")
      .text((d) => d.label)
      .attr("dy", (d) => DEPTH_RADII[d.depth] + 12)
      .attr("text-anchor", "middle")
      .attr("fill", "#e6edf3")
      .attr("font-size", (d) => Math.max(9, 13 - d.depth * 2));

    type SimNode = GraphNode & d3.SimulationNodeDatum;
    type SimLink = { source: SimNode; target: SimNode };

    sim.on("tick", () => {
      link
        .attr("x1", (d) => (d as unknown as SimLink).source.x ?? 0)
        .attr("y1", (d) => (d as unknown as SimLink).source.y ?? 0)
        .attr("x2", (d) => (d as unknown as SimLink).target.x ?? 0)
        .attr("y2", (d) => (d as unknown as SimLink).target.y ?? 0);
      node.attr(
        "transform",
        (d) => `translate(${(d as SimNode).x ?? 0},${(d as SimNode).y ?? 0})`,
      );
    });

    return () => {
      sim.stop();
    };
  }, [graph, visibleIds]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          zIndex: 10,
          background: "#161b22",
          border: "1px solid #30363d",
          color: "#e6edf3",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
      {graph && (
        <h2
          style={{
            position: "absolute",
            top: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          {graph.project}
        </h2>
      )}
      <svg ref={svgRef} width="100%" height="100%" />
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y,
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: "6px",
            padding: "0.5rem 0.8rem",
            fontSize: "0.8rem",
            maxWidth: "260px",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
