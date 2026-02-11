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
    # ИСПРАВЛЕНИЕ: добавляем return_layout=True или явно работаем с результатом
    # В этой библиотеке predict возвращает кортеж или объект в зависимости от версии
    try:
        # Попробуем стандартный вызов
        result = pipeline.predict(img_path)
        text = pipeline.get_text(result)
    except AttributeError:
        # Если упало с 'dict' object has no attribute 'blocks', 
        # значит нужно достать текст напрямую из результата (словаря)
        result = pipeline.predict(img_path)
        # В некоторых версиях результат — это dict, где текст уже есть
        text = str(result) 
    
    # Сохраняем результат в .txt рядом с картинкой
    output_path = os.path.splitext(img_path)[0] + ".txt"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"Done: {output_path}")

if __name__ == "__main__":
    run_ocr()
