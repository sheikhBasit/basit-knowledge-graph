import re
from pathlib import Path
from analyzer.summarizer import summarize

SKIP_DIRS = {
    ".git", "node_modules", "__pycache__", ".venv", "venv",
    "env", "dist", "build", ".next", "migrations", ".idea",
}

SKIP_EXTS = {".zip", ".log", ".jsonl", ".lock", ".png", ".jpg", ".jpeg", ".svg", ".ico"}

ENTRY_FILES = {"app.py", "main.py", "index.js", "index.ts", "server.js", "server.ts"}


def _node_id(project_slug: str, path: Path, root: Path) -> str:
    rel = path.relative_to(root)
    return f"{project_slug}/{rel}"


def _extract_symbols(path: Path) -> list[str]:
    if path.suffix not in {".py", ".js", ".ts", ".tsx", ".jsx"}:
        return []
    text = path.read_text(encoding="utf-8", errors="ignore")
    if path.suffix == ".py":
        return re.findall(r"^(?:def|class)\s+(\w+)", text, re.MULTILINE)
    return re.findall(r"(?:function|const|class)\s+(\w+)", text)


def build_graph(project_name: str, project_path: Path) -> dict:
    slug = project_path.name.lower().replace(" ", "-")
    nodes: list[dict] = []
    edges: list[dict] = []
    node_ids: set[str] = set()

    root_id = slug
    root_summary = summarize(project_name, project_path, "project")
    nodes.append({
        "id": root_id,
        "label": project_name,
        "depth": 0,
        "summary": root_summary,
        "children": [],
        "expanded": False,
    })
    node_ids.add(root_id)

    top_level = sorted(project_path.iterdir())
    for item in top_level:
        if item.name in SKIP_DIRS or item.suffix in SKIP_EXTS:
            continue
        if item.name.startswith("."):
            continue

        if item.is_dir():
            feat_id = _node_id(slug, item, project_path.parent)
            summary = summarize(project_name, item, "folder")
            nodes.append({
                "id": feat_id,
                "label": item.name,
                "depth": 1,
                "summary": summary,
                "children": [],
                "expanded": False,
            })
            node_ids.add(feat_id)
            nodes[0]["children"].append(feat_id)
            edges.append({"source": root_id, "target": feat_id})

            for f in sorted(item.rglob("*")):
                if not f.is_file():
                    continue
                if f.suffix in SKIP_EXTS or any(p in SKIP_DIRS for p in f.parts):
                    continue
                file_id = _node_id(slug, f, project_path.parent)
                file_summary = summarize(project_name, f, "file")
                file_node = {
                    "id": file_id,
                    "label": f.name,
                    "depth": 2,
                    "summary": file_summary,
                    "children": [],
                    "expanded": False,
                }
                nodes.append(file_node)
                node_ids.add(file_id)
                edges.append({"source": feat_id, "target": file_id})
                for n in nodes:
                    if n["id"] == feat_id:
                        n["children"].append(file_id)
                        break

                symbols = _extract_symbols(f)[:10]
                for sym in symbols:
                    sym_id = f"{file_id}/{sym}"
                    nodes.append({
                        "id": sym_id,
                        "label": sym,
                        "depth": 3,
                        "summary": f"{sym} defined in {f.name}",
                        "children": [],
                        "expanded": False,
                    })
                    node_ids.add(sym_id)
                    file_node["children"].append(sym_id)
                    edges.append({"source": file_id, "target": sym_id})

        elif item.is_file() and item.name in ENTRY_FILES:
            file_id = _node_id(slug, item, project_path.parent)
            summary = summarize(project_name, item, "entry point file")
            nodes.append({
                "id": file_id,
                "label": item.name,
                "depth": 1,
                "summary": summary,
                "children": [],
                "expanded": False,
            })
            node_ids.add(file_id)
            nodes[0]["children"].append(file_id)
            edges.append({"source": root_id, "target": file_id})

    return {
        "project": project_name,
        "slug": slug,
        "description": root_summary,
        "nodes": nodes,
        "edges": edges,
    }
