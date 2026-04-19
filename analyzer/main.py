import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


def main():
    projects_path = Path(os.environ.get("PROJECTS_PATH", Path.home() / "Me"))
    output_dir = Path(__file__).parent.parent / "public" / "data"
    output_dir.mkdir(parents=True, exist_ok=True)

    from analyzer.detector import build_graph

    projects = [
        p for p in sorted(projects_path.iterdir())
        if p.is_dir() and not p.name.startswith(".")
    ]
    index = []

    for project_path in projects:
        print(f"Analyzing {project_path.name}...")
        try:
            graph = build_graph(project_path.name, project_path)
            slug = graph["slug"]
            out_file = output_dir / f"{slug}.json"
            out_file.write_text(json.dumps(graph, indent=2))
            index.append({
                "slug": slug,
                "project": graph["project"],
                "description": graph["description"],
            })
            print(f"  ✓ {len(graph['nodes'])} nodes → public/data/{slug}.json")
        except Exception as e:
            print(f"  ✗ Failed: {e}", file=sys.stderr)

    (output_dir / "index.json").write_text(json.dumps(index, indent=2))
    print(f"\nDone. {len(index)} projects indexed.")


if __name__ == "__main__":
    main()
