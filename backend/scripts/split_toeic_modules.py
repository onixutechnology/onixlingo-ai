import json

def split_toeic_modules():
    master_path = r"c:\Users\jeico\onixlingo\language-ai-tutor\backend\app\data\lessons\en\toeic_mock_v1.json"
    listening_path = r"c:\Users\jeico\onixlingo\language-ai-tutor\backend\app\data\lessons\en\toeic_listening_v1.json"
    reading_path = r"c:\Users\jeico\onixlingo\language-ai-tutor\backend\app\data\lessons\en\toeic_reading_v1.json"

    with open(master_path, "r", encoding="utf-8") as f:
        master_data = json.load(f)

    # Extract Listening stages
    listening_stages = [s for s in master_data["stages"] if s["type"] == "listening"]
    
    # Extract Reading stages
    reading_stages = [s for s in master_data["stages"] if s["type"] == "reading"]

    # Create Listening JSON
    listening_data = {
        "id": "toeic_listening_v1",
        "title": "TOEIC® Listening Official Module",
        "difficulty": "advanced",
        "category": "certification",
        "author": "OnixLingo Assessment Board",
        "total_xp": 1000,
        "completion_message": "Congratulations! Your Listening module has been submitted.",
        "stages": listening_stages
    }

    # Create Reading JSON
    reading_data = {
        "id": "toeic_reading_v1",
        "title": "TOEIC® Reading Official Module",
        "difficulty": "advanced",
        "category": "certification",
        "author": "OnixLingo Assessment Board",
        "total_xp": 1000,
        "completion_message": "Congratulations! Your Reading module has been submitted.",
        "stages": reading_stages
    }

    with open(listening_path, "w", encoding="utf-8") as f:
        json.dump(listening_data, f, ensure_ascii=False, indent=2)

    with open(reading_path, "w", encoding="utf-8") as f:
        json.dump(reading_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    split_toeic_modules()
    print("Cloned premium content into individual Listening and Reading modules.")
