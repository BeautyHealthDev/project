import sys
import os
from manuscript import Pipeline
from manuscript.utils.visualization import visualize_page
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
        result = pipeline.predict(img_path)
        # text = pipeline.get_text(result)
        text = pipeline.get_text(result["page"])
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
    vis_img = visualize_page(image_path, result["page"])
    vis_img.show()  
    # vis_img.save(os.path.splitext(img_path)[0] + "result.jpg") для сохранения

if __name__ == "__main__":
    run_ocr()
