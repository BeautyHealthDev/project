import sys
import os
from manuscript import Pipeline
from manuscript.utils.visualization import visualize_page
from manuscript.utils import organize_page
from manuscript.detectors import EAST
from manuscript.recognizers import TRBA

def run_ocr():
    if len(sys.argv) < 2:
        print("Usage: python ocr/script.py <path_to_image>")
        return

    img_path = sys.argv[1]
    if not os.path.exists(img_path):
        return
    
    # Инициализация и обработка
    # pipeline = Pipeline()
    # Создание OCR-пайплайна с моделями по умолчанию
    pipeline = Pipeline(
        detector=EAST(),
        recognizer=TRBA(weights="trba_lite_g1"),
    )
    # ИСПРАВЛЕНИЕ: добавляем return_layout=True или явно работаем с результатом
    # В этой библиотеке predict возвращает кортеж или объект в зависимости от версии
    try:
        # Попробуем стандартный вызов
        result = pipeline.predict(img_path, sort_reading_order=False)
        # text = pipeline.get_text(result)
        page = result["page"]
        # Organize into structured reading order
        organized_page = organize_page(page, max_splits=10, use_columns=True)
        text = pipeline.get_text(organized_page)
    except AttributeError:
        # Если упало с 'dict' object has no attribute 'blocks', 
        # значит нужно достать текст напрямую из результата (словаря)
        result = pipeline.predict(img_path)
        # В некоторых версиях результат — это dict, где текст уже есть
        text = str(result) 
    
    print("\n" + "="*50 + "\n")
    print("Распознанный текст:")
    print(text)
    print("\n" + "="*50 + "\n")
    
    # Сохраняем результат в .txt рядом с картинкой
    output_path = os.path.splitext(img_path)[0] + ".txt"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"Done: {output_path}")
    
    # Визуализация результата
    vis_img = visualize_page(img_path, organized_page, show_order=True, show_lines=True, show_numbers=True)
    # vis_img.show()  
    img_output_path = os.path.splitext(img_path)[0] + "_ocr.jpg"
    print("Изображение OCR:")
    print(vis_img)
    vis_img.save(img_output_path)
    print(f"Создан img_output_path: {img_output_path}")

if __name__ == "__main__":
    run_ocr()
