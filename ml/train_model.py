"""
KrishiDrishti Crop Disease Model Training Pipeline
====================================================
This script trains a Random Forest Classifier on crop leaf images.

Expected Dataset Structure:
dataset/
   train/
      tomato_healthy/
      tomato_early_blight/
      potato_late_blight/
      rice_bacterial_blight/
      wheat_rust/
   validation/
"""

import os
import pickle
import numpy as np
from PIL import Image
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

DATASET_DIR = os.path.join(os.path.dirname(__file__), 'dataset')
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model')
MODEL_SAVE_PATH = os.path.join(MODEL_DIR, 'crop_model.pkl')

def load_images_from_folder(folder_path, img_size=(64, 64)):
    X, y = [], []
    if not os.path.exists(folder_path):
        print(f"[Warning] Dataset folder path not found: {folder_path}")
        return np.array(X), np.array(y), {}

    categories = [d for d in os.listdir(folder_path) if os.path.isdir(os.path.join(folder_path, d))]
    label_map = {idx: cat for idx, cat in enumerate(categories)}

    print(f"Found categories: {categories}")

    for idx, cat in enumerate(categories):
        cat_dir = os.path.join(folder_path, cat)
        for img_name in os.listdir(cat_dir):
            if img_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                try:
                    img_path = os.path.join(cat_dir, img_name)
                    img = Image.open(img_path).convert('RGB').resize(img_size)
                    X.append(np.array(img).flatten())
                    y.append(idx)
                except Exception as e:
                    print(f"Error loading {img_name}: {e}")

    return np.array(X), np.array(y), label_map

def train():
    os.makedirs(MODEL_DIR, exist_ok=True)
    train_dir = os.path.join(DATASET_DIR, 'train')
    val_dir = os.path.join(DATASET_DIR, 'validation')

    print("Loading training dataset...")
    X_train, y_train, label_map = load_images_from_folder(train_dir)

    if len(X_train) == 0:
        print("==========================================================")
        print("Notice: No images found in dataset/train/ directory.")
        print("To train a real ML model:")
        print("1. Place crop leaf images in: ml/dataset/train/<category_name>/")
        print("2. Place validation images in: ml/dataset/validation/<category_name>/")
        print("3. Run: python ml/train_model.py")
        print("==========================================================")
        return

    print(f"Training on {len(X_train)} samples across {len(label_map)} classes...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)

    # Evaluate if validation set exists
    if os.path.exists(val_dir):
        X_val, y_val, _ = load_images_from_folder(val_dir)
        if len(X_val) > 0:
            y_pred = clf.predict(X_val)
            print("\n--- MODEL EVALUATION METRICS ---")
            print(f"Accuracy Score: {accuracy_score(y_val, y_pred) * 100:.2f}%")
            print("\nClassification Report:")
            print(classification_report(y_val, y_pred, target_names=[label_map[i] for i in range(len(label_map))]))
            print("\nConfusion Matrix:")
            print(confusion_matrix(y_val, y_pred))

    with open(MODEL_SAVE_PATH, 'wb') as f:
        pickle.dump({'model': clf, 'labels': label_map}, f)
    print(f"\nTrained model saved successfully to: {MODEL_SAVE_PATH}")

if __name__ == '__main__':
    train()
