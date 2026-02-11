import sys
import os
from manuscript import Pipeline

def run_ocr():
    if len(sys.argv) < 2:
        print("Usage: python ocr/script.py <path_to_image>")
        return

    img_path = sys.argv[1]
    if not os.path.exists(img_path):
        return
    
    # Инициализация и обработка
    pipeline = Pipeline()
    result = pipeline.predict(img_path)
    text = pipeline.get_text(result)
    
    # Сохраняем результат в .txt рядом с картинкой
    output_path = os.path.splitext(img_path)[0] + ".txt"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"Done: {output_path}")

if __name__ == "__main__":
    run_ocr()
