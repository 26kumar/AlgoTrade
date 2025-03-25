import os
import matplotlib.pyplot as plt
from flask import Flask, jsonify, send_from_directory, request
import pandas as pd
import joblib
import numpy as np
from sklearn.preprocessing import StandardScaler
from flask_cors import CORS, cross_origin

app = Flask(__name__, static_folder="public")  # ✅ Set static folder
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)  # ✅ Fix CORS issue

# ✅ Define global directory for storing generated assets
GLOBAL_ASSETS_DIR = os.path.join(os.path.dirname(__file__), "public")
os.makedirs(GLOBAL_ASSETS_DIR, exist_ok=True)  # Ensure directory exists

# Load model
model_path = "models/1_model_meanAveragCrossover.pkl"
model = joblib.load(model_path)


@app.route("/")
def home():
    return "🚀 Welcome to Stock Prediction API! Go to /api/predict to make predictions."


@app.route("/api/predict", methods=["GET"])
@cross_origin()  # Apply CORS only to this route
def predict():
    try:
        data_path = "data/stock_data.csv"

        # Load stock data
        try:
            stock_data = pd.read_csv(data_path)
        except FileNotFoundError:
            return jsonify({"message": "❌ Stock data file not found!"}), 404

        # Ensure required columns exist
        required_cols = ["open", "high", "low", "close", "volume"]
        for col in required_cols:
            if col not in stock_data.columns:
                return jsonify({"message": f"❌ Missing column: {col}"}), 400

        # Compute moving averages
        stock_data["SMA_50"] = stock_data["close"].rolling(window=50).mean()
        stock_data["SMA_200"] = stock_data["close"].rolling(window=200).mean()
        stock_data.dropna(inplace=True)

        if stock_data.empty:
            return jsonify({"message": "⚠️ Not enough stock data to make a prediction"}), 400

        # Load scaler and preprocess data
        scaler_path = "models/1_scaler.pkl"
        scaler = joblib.load(scaler_path)
        latest_data = stock_data[['SMA_50', 'SMA_200']].iloc[-1].values.reshape(1, -1)
        latest_data_scaled = scaler.transform(latest_data)

        # Make prediction
        prediction = model.predict(latest_data_scaled)
        signal = "📈 Uptrend (Buy)" if prediction[0] == 1 else "📉 Downtrend (Sell)"
        
        # Generate and save the plot
        plt.figure(figsize=(12, 6))
        plt.plot(stock_data['close'], label='Closing Price', color='blue')
        plt.plot(stock_data['SMA_50'], label='SMA 50', color='orange')
        plt.plot(stock_data['SMA_200'], label='SMA 200', color='red')
        plt.scatter(
            stock_data.index[stock_data['SMA_50'] > stock_data['SMA_200']],
            stock_data['close'][stock_data['SMA_50'] > stock_data['SMA_200']],
            color='green', label='Buy Signal', marker='^', alpha=1, zorder=5
        )
        plt.scatter(
            stock_data.index[stock_data['SMA_50'] < stock_data['SMA_200']],
            stock_data['close'][stock_data['SMA_50'] < stock_data['SMA_200']],
            color='red', label='Sell Signal', marker='v', alpha=1, zorder=5
        )
        plt.legend()
        plt.xlabel("Date")
        plt.ylabel("Price")
        plt.grid()

        # ✅ Save the plot to /public folder
        image_path = os.path.join(GLOBAL_ASSETS_DIR, "momentum_average_crossover.png")
        plt.savefig(image_path, dpi=300, bbox_inches='tight')
        plt.close()

        print(f"✅ Image successfully saved at: {image_path}")

        # ✅ Fix CORS Image URL Issue
        base_url = request.host_url.rstrip("/")  # Get base URL dynamically
        return jsonify({
            "message": signal,
            "image_url": f"{base_url}/public/momentum_average_crossover.png"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/get-image", methods=["GET"])
@cross_origin()
def get_image():
    image_name = "momentum_average_crossover.png"
    image_path = os.path.join(GLOBAL_ASSETS_DIR, image_name)

    if os.path.exists(image_path):
        return send_from_directory(GLOBAL_ASSETS_DIR, image_name)
    else:
        return jsonify({"message": "❌ Image not found!"}), 404


@app.route("/public/<path:filename>")
@cross_origin()
def serve_static(filename):
    return send_from_directory(GLOBAL_ASSETS_DIR, filename)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
