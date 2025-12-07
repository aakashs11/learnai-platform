import json
import os
import shutil

def merge_content():
    lessons_path = 'ui/public/lessons.json'
    enriched_path = 'pipeline/output/handbook_enriched.json'
    assets_src = 'pipeline/assets'
    assets_dest = 'ui/public/assets'

    # 1. Load existing lessons
    with open(lessons_path, 'r') as f:
        lessons = json.load(f)

    # 2. Load new content
    with open(enriched_path, 'r') as f:
        new_content = json.load(f)

    # 3. Transform to Lesson Schema
    new_lesson = {
        "id": "lesson_handbook_01",
        "title": new_content.get("title", "Generated Lesson"),
        "lessonNumber": len(lessons) + 1,
        "unit": {
            "number": 99,
            "title": "Handbook Data",
            "pageStart": 1,
            "pageEnd": 99
        },
        "objectives": new_content.get("objectives", []),
        "keyConcepts": [],
        "realWorldApplication": "Extracted from Official CBSE Handbook",
        "progress": 0,
        "xpEarned": 0,
        "mastery": "beginner",
        "theory": new_content.get("contentBlocks", []),
        "quiz": new_content.get("quiz", {})
    }

    # 4. Remove previous version if exists (to avoid duplicates during dev)
    lessons = [l for l in lessons if l['id'] != 'lesson_handbook_01']
    
    # 5. Append
    lessons.append(new_lesson)

    # 6. Save
    with open(lessons_path, 'w') as f:
        json.dump(lessons, f, indent=2)
    
    print(f"Merged lesson into {lessons_path}")

    # 7. Copy Assets
    # We need to copy `pipeline/assets/handbook/*` to `ui/public/assets/handbook/*`
    # The JSON refs are "assets/handbook/..." which corresponds to "ui/public/assets/handbook/..."
    
    if os.path.exists(assets_src):
        if not os.path.exists(assets_dest):
            os.makedirs(assets_dest)
            
        # Recursive copy
        # We want to merge folders, shutil.copytree requires dest to NOT exist usually, or use dirs_exist_ok in py3.8+
        import distutils.dir_util
        distutils.dir_util.copy_tree(assets_src, assets_dest)
        print(f"Copied assets from {assets_src} to {assets_dest}")

if __name__ == "__main__":
    merge_content()
