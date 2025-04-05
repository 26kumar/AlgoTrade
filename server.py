import os
# Set matplotlib backend to non-interactive mode before importing pyplot
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend to avoid threading issues
import matplotlib.pyplot as plt
from flask import Flask, jsonify, send_from_directory, request
import pandas as pd
import joblib
import numpy as np
from sklearn.preprocessing import StandardScaler
from flask_cors import CORS, cross_origin
import traceback

app = Flask(__name__, static_folder="public")  # ✅ Set static folder
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)  # ✅ Fix CORS issue

# ✅ Define global directory for storing generated assets
GLOBAL_ASSETS_DIR = os.path.join(os.path.dirname(__file__), "public")
os.makedirs(GLOBAL_ASSETS_DIR, exist_ok=True)  # Ensure directory exists

# Ensure data directory exists
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# Ensure models directory exists
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODELS_DIR, exist_ok=True)

# Load model with better error handling
model_path = os.path.join(MODELS_DIR, "1_model_meanAveragCrossover.pkl")
scaler_path = os.path.join(MODELS_DIR, "1_scaler.pkl")

try:
    model = joblib.load(model_path)
    print(f"✅ Model successfully loaded from: {model_path}")
except FileNotFoundError:
    print(f"⚠️ Warning: Model file not found at: {model_path}")
    model = None
except Exception as e:
    print(f"⚠️ Warning: Error loading model: {str(e)}")
    model = None


@app.route("/")
def home():
    return "🚀 Welcome to Stock Prediction API! Go to /api/predict to make predictions."


@app.route("/api/predict", methods=["GET"])
@cross_origin()  # Apply CORS only to this route
def predict():
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({"message": "❌ Model not loaded. Check server logs."}), 500

        data_path = os.path.join(DATA_DIR, "stock_data.csv")

        # Load stock data
        try:
            if not os.path.exists(data_path):
                return jsonify({"message": "❌ Stock data file not found! Please fetch data first."}), 404
                
            stock_data = pd.read_csv(data_path)
            print(f"✅ Successfully loaded stock data with {len(stock_data)} rows")
        except Exception as e:
            print(f"❌ Error reading CSV: {str(e)}")
            return jsonify({"message": f"❌ Error reading stock data: {str(e)}"}), 400

        # Ensure required columns exist
        required_cols = ["open", "high", "low", "close", "volume"]
        missing_cols = [col for col in required_cols if col not in stock_data.columns]
        if missing_cols:
            print(f"❌ Missing columns: {missing_cols}")
            return jsonify({"message": f"❌ Missing columns: {', '.join(missing_cols)}"}), 400

        # Compute moving averages
        stock_data["SMA_50"] = stock_data["close"].rolling(window=50).mean()
        stock_data["SMA_200"] = stock_data["close"].rolling(window=200).mean()
        stock_data = stock_data.dropna()

        if stock_data.empty:
            return jsonify({"message": "⚠️ Not enough stock data to make a prediction"}), 400

        # Load scaler and preprocess data
        try:
            scaler = joblib.load(scaler_path)
            latest_data = stock_data[['SMA_50', 'SMA_200']].iloc[-1].values.reshape(1, -1)
            latest_data_scaled = scaler.transform(latest_data)
        except Exception as e:
            print(f"❌ Error preprocessing data: {str(e)}")
            return jsonify({"message": f"❌ Error preprocessing data: {str(e)}"}), 500

        # Make prediction
        prediction = model.predict(latest_data_scaled)
        
        # Simple signal - just what we need without extra info
        signal = "📈 Uptrend (Buy)" if prediction[0] == 1 else "📉 Downtrend (Sell)"
        
        # Get latest price for display but don't include in the main signal
        latest_price = stock_data['close'].iloc[-1]
        
        # Calculate price change from previous day if available
        price_change = 0
        percent_change = 0
        if len(stock_data) > 1:
            price_change = stock_data['close'].iloc[-1] - stock_data['close'].iloc[-2]
            percent_change = (price_change / stock_data['close'].iloc[-2]) * 100
        
        # Generate and save the plot
        try:
            plt.figure(figsize=(12, 6))
            
            # Plot only the last 90 days data to make it more readable
            last_n_days = min(90, len(stock_data))
            plot_data = stock_data.iloc[-last_n_days:]
            
            plt.plot(plot_data.index, plot_data['close'], label='Closing Price', color='blue')
            plt.plot(plot_data.index, plot_data['SMA_50'], label='SMA 50', color='orange')
            plt.plot(plot_data.index, plot_data['SMA_200'], label='SMA 200', color='red')
            
            # Add buy/sell markers
            buy_indices = plot_data.index[plot_data['SMA_50'] > plot_data['SMA_200']]
            sell_indices = plot_data.index[plot_data['SMA_50'] < plot_data['SMA_200']]
            
            plt.scatter(
                buy_indices,
                plot_data.loc[buy_indices, 'close'],
                color='green', label='Buy Signal', marker='^', alpha=1, s=100, zorder=5
            )
            plt.scatter(
                sell_indices,
                plot_data.loc[sell_indices, 'close'],
                color='red', label='Sell Signal', marker='v', alpha=1, s=100, zorder=5
            )
            
            plt.title(f"Stock Price with Moving Average Crossover Signals (Last {last_n_days} days)", fontsize=14)
            plt.legend()
            plt.xlabel("Day")
            plt.ylabel("Price ($)")
            plt.grid(True, alpha=0.3)

            # Save the plot to /public folder
            image_path = os.path.join(GLOBAL_ASSETS_DIR, "momentum_average_crossover.png")
            plt.savefig(image_path, dpi=300, bbox_inches='tight')
            plt.close('all')  # Close all figures to prevent memory leaks

            print(f"✅ Image successfully saved at: {image_path}")
        except Exception as e:
            print(f"❌ Error generating chart: {str(e)}")
            # Continue execution - we can still return the prediction even if chart fails

        # Return only the simple signal message but keep other data in the JSON
        base_url = request.host_url.rstrip("/")  # Get base URL dynamically
        return jsonify({
            "message": signal,  # Use the simple signal format
            "signal": signal.split(" ")[1].strip("()"),
            "price": float(latest_price),
            "change": float(price_change),
            "change_percent": float(percent_change),
            "image_url": f"{base_url}/public/momentum_average_crossover.png"
        })

    except Exception as e:
        error_traceback = traceback.format_exc()
        print(f"❌ Error in prediction: {str(e)}")
        print(f"Traceback: {error_traceback}")
        return jsonify({"message": f"❌ Error in prediction: {str(e)}"}), 500


@app.route("/api/check-file", methods=["GET"])
@cross_origin()
def check_file():
    data_path = os.path.join(DATA_DIR, "stock_data.csv")
    
    if os.path.exists(data_path):
        try:
            # Get file stats
            file_size = os.path.getsize(data_path) / 1024  # Size in KB
            
            # Try to read the file to verify it's valid
            data = pd.read_csv(data_path)
            rows = len(data)
            
            return jsonify({
                "message": f"✅ Stock data file found ({file_size:.2f} KB, {rows} rows)",
                "exists": True,
                "size_kb": round(file_size, 2),
                "rows": rows
            })
        except Exception as e:
            return jsonify({
                "message": f"⚠️ Stock data file exists but is not valid: {str(e)}",
                "exists": True,
                "valid": False
            })
    else:
        return jsonify({
            "message": "❌ Stock data file not found!",
            "exists": False
        })


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
    print("Starting prediction server on port 5001...")
    print(f"Model status: {'Loaded' if model is not None else 'Not loaded'}")
    print(f"Data directory: {DATA_DIR}")
    print(f"Public directory: {GLOBAL_ASSETS_DIR}")
    app.run(host="0.0.0.0", port=5001, debug=True, threaded=True)
