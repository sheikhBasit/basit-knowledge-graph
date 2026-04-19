import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

PROFESSIONAL_SLUGS = {'AUC-Backend', 'VoiceAgentAPI'}


def main():
    projects_path = Path(os.environ.get("PROJECTS_PATH", Path.home() / "Me"))
    villaex_path = Path.home() / "Villaex"
    output_dir = Path(__file__).parent.parent / "public" / "data"
    output_dir.mkdir(parents=True, exist_ok=True)

    from analyzer.detector import build_graph

    personal = [
        p for p in sorted(projects_path.iterdir())
        if p.is_dir() and not p.name.startswith(".")
    ]
    professional = [
        villaex_path / name
        for name in PROFESSIONAL_SLUGS
        if (villaex_path / name).is_dir()
    ]

    all_projects = [(p, 'personal') for p in personal] + [(p, 'professional') for p in professional]
    index = []

    for project_path, category in all_projects:
        print(f"Analyzing {project_path.name} [{category}]...")
        try:
            graph = build_graph(project_path.name, project_path)
            slug = graph["slug"]
            out_file = output_dir / f"{slug}.json"
            out_file.write_text(json.dumps(graph, indent=2))
            index.append({
                "slug": slug,
                "project": graph["project"],
                "description": graph["description"],
                "category": category,
                "hasGraph": True,
            })
            print(f"  ✓ {len(graph['nodes'])} nodes → public/data/{slug}.json")
        except Exception as e:
            print(f"  ✗ Failed: {e}", file=sys.stderr)

    (output_dir / "index.json").write_text(json.dumps(index, indent=2))
    print(f"\nDone. {len(index)} projects indexed.")


if __name__ == "__main__":
    main()
