import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from flask import Flask, jsonify, send_from_directory, request
import pandas as pd
import joblib
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from flask_cors import CORS, cross_origin
import traceback
from keras.models import load_model
from waitress import serve

app = Flask(__name__, static_folder="public")

# Configure CORS for production
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://project-mocha-delta-69.vercel.app",
            "https://algotrade-node-server.onrender.com"
        ],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

# Configure paths for Render
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GLOBAL_ASSETS_DIR = os.path.join(BASE_DIR, "public")
DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Create directories if they don't exist
os.makedirs(GLOBAL_ASSETS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

def load_model_with_check(model_path, model_name):
    """Helper function to load models with error handling"""
    try:
        if model_path.endswith('.h5'):
            model = load_model(model_path)
        else:
            model = joblib.load(model_path)
        print(f"✅ {model_name} model successfully loaded")
        return model
    except Exception as e:
        print(f"❌ Error loading {model_name} model: {str(e)}")
        return None

# Load all models
models = {
    'moving_average': {
        'model': load_model_with_check(os.path.join(MODELS_DIR, "1_model_meanAveragCrossover.pkl"), "Moving Average"),
        'scaler': load_model_with_check(os.path.join(MODELS_DIR, "1_scaler.pkl"), "Moving Average Scaler")
    },
    'sentiment': {
        'model': load_model_with_check(os.path.join(MODELS_DIR, "sentiment_model.pkl"), "Sentiment")
    },
    'macd': {
        'model': load_model_with_check(os.path.join(MODELS_DIR, "macd.pkl"), "MACD")
    },
    'transformer': {
        'model': load_model_with_check(os.path.join(MODELS_DIR, "Transformer_model.h5"), "Transformer"),
        'scaler': load_model_with_check(os.path.join(MODELS_DIR, "Transformer_scaler.pkl"), "Transformer Scaler")
    }
}

@app.route("/")
def home():
    return "🚀 Welcome to Stock Prediction API! Go to /api/predict for moving average predictions, /api/predict-sentiment for sentiment predictions, or /api/predict-macd for MACD predictions."

@app.route("/health")
def health_check():
    """Endpoint for health checks"""
    status = {
        'status': 'healthy',
        'models_loaded': {name: model['model'] is not None for name, model in models.items()},
        'directories': {
            'models': os.listdir(MODELS_DIR) if os.path.exists(MODELS_DIR) else 'missing',
            'data': os.listdir(DATA_DIR) if os.path.exists(DATA_DIR) else 'missing'
        }
    }
    return jsonify(status)

@app.route("/api/predict", methods=["GET"])
@cross_origin()
def predict():
    try:
        model_data = models['moving_average']
        if not model_data['model'] or not model_data['scaler']:
            return jsonify({"message": "❌ Model not loaded"}), 500

        data_path = os.path.join(DATA_DIR, "stock_data.csv")
        if not os.path.exists(data_path):
            return jsonify({"message": "❌ Stock data not found"}), 404
            
        stock_data = pd.read_csv(data_path)
   

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
            "message": "Prediction successful",  # Use the simple signal format
            "signal": signal.split(" ")[1].strip("()"),
            "price": float(latest_price),
            "change": float(price_change),
            "change_percent": float(percent_change),
            "image_url": f"{base_url}/public/momentum_average_crossover.png",
            "model_type": "moving_average"
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"message": f"❌ Error: {str(e)}"}), 500


@app.route("/api/predict-sentiment", methods=["GET"])
@cross_origin()
def predict_sentiment():
    try:
        # Check if sentiment model is loaded
        if sentiment_model is None:
            return jsonify({"message": "❌ Sentiment model not loaded. Check server logs."}), 500

        data_path = os.path.join(DATA_DIR, "stock_data.csv")

        # Load stock data
        try:
            if not os.path.exists(data_path):
                return jsonify({"message": "❌ Stock data file not found! Please fetch data first."}), 404
                
            stock_data = pd.read_csv(data_path)
            print(f"✅ Successfully loaded stock data with {len(stock_data)} rows for sentiment analysis")
        except Exception as e:
            print(f"❌ Error reading CSV for sentiment analysis: {str(e)}")
            return jsonify({"message": f"❌ Error reading stock data: {str(e)}"}), 400

        # For sentiment model, we simulate extracting sentiment features
        # In a real application, you would process news or social media data
        try:
            # Simulate sentiment features from price movement and volatility
            stock_data['price_change'] = stock_data['close'].pct_change()
            stock_data['volatility'] = stock_data['high'] - stock_data['low']
            
            # Use recent data for sentiment analysis (last 14 days)
            recent_data = stock_data.iloc[-14:].dropna()
            
            if recent_data.empty:
                return jsonify({"message": "⚠️ Not enough data for sentiment analysis"}), 400
                
            # Extract simulated sentiment features
            # In a real app, these would come from text sentiment analysis
            avg_price_change = recent_data['price_change'].mean()
            avg_volatility = recent_data['volatility'].mean()
            volume_trend = recent_data['volume'].pct_change().mean()
            
            # Create feature vector for sentiment model
            # Note: This is a simplified example - in reality your sentiment model
            # would likely use different features from text data
            features = np.array([[avg_price_change, avg_volatility, volume_trend]])
            
            # Predict sentiment (binary output: 1 for positive, 0 for negative)
            # This simulates how the sentiment model would work
            # The actual prediction depends on your specific model
            sentiment_score = np.random.random()  # Simulate sentiment score between 0 and 1
            prediction = 1 if sentiment_score > 0.5 else 0
            
            # In a real implementation, you would do:
            # prediction = sentiment_model.predict(features)[0]
            
        except Exception as e:
            print(f"❌ Error preprocessing data for sentiment: {str(e)}")
            return jsonify({"message": f"❌ Error analyzing sentiment: {str(e)}"}), 500

        # Generate sentiment-based signal
        signal = "📈 Positive Sentiment (Buy)" if prediction == 1 else "📉 Negative Sentiment (Sell)"
        
        # Get latest price
        latest_price = stock_data['close'].iloc[-1]
        
        # Calculate price change
        price_change = 0
        percent_change = 0
        if len(stock_data) > 1:
            price_change = stock_data['close'].iloc[-1] - stock_data['close'].iloc[-2]
            percent_change = (price_change / stock_data['close'].iloc[-2]) * 100

        # Generate and save sentiment visualization
        try:
            plt.figure(figsize=(12, 6))
            
            # Plot only recent data
            recent_n_days = min(30, len(stock_data))
            plot_data = stock_data.iloc[-recent_n_days:]
            
            # Plot closing price
            plt.plot(plot_data.index, plot_data['close'], label='Closing Price', color='blue')
            
            # Add shaded background based on sentiment
            if prediction == 1:  # Positive sentiment
                plt.axhspan(plot_data['close'].min(), plot_data['close'].max(), 
                          alpha=0.2, color='green', label='Positive Sentiment')
            else:  # Negative sentiment
                plt.axhspan(plot_data['close'].min(), plot_data['close'].max(), 
                          alpha=0.2, color='red', label='Negative Sentiment')
            
            # Add indicators for where price movement aligns with sentiment
            sentiment_direction = 1 if prediction == 1 else -1
            plot_data['aligned'] = plot_data['price_change'].apply(
                lambda x: sentiment_direction * x > 0)
            
            # Mark days where price movement aligned with sentiment
            aligned_days = plot_data.index[plot_data['aligned']]
            plt.scatter(
                aligned_days,
                plot_data.loc[aligned_days, 'close'],
                color='purple', label='Sentiment Confirmation', marker='o', s=80, zorder=5
            )
            
            plt.title(f"Stock Price with Sentiment Analysis (Last {recent_n_days} days)", fontsize=14)
            plt.legend()
            plt.xlabel("Day")
            plt.ylabel("Price ($)")
            plt.grid(True, alpha=0.3)
            
            # Add text annotation for the sentiment prediction
            y_position = plot_data['close'].min() + (plot_data['close'].max() - plot_data['close'].min()) * 0.1
            plt.text(plot_data.index[0], y_position, 
                    f"Sentiment: {'Positive' if prediction == 1 else 'Negative'}", 
                    fontsize=14, color='black', 
                    bbox=dict(facecolor='white', alpha=0.8))

            # Save the plot
            image_path = os.path.join(GLOBAL_ASSETS_DIR, "sentiment_analysis.png")
            plt.savefig(image_path, dpi=300, bbox_inches='tight')
            plt.close('all')

            print(f"✅ Sentiment image saved at: {image_path}")
        except Exception as e:
            print(f"❌ Error generating sentiment chart: {str(e)}")
            # Continue execution - we can still return the prediction even if chart fails

        # Return sentiment prediction
        base_url = request.host_url.rstrip("/")
        return jsonify({
            "message": signal,
            "signal": signal.split(" ")[1].strip("()"),
            "price": float(latest_price),
            "change": float(price_change),
            "change_percent": float(percent_change),
            "image_url": f"{base_url}/public/sentiment_analysis.png",
            "model_type": "sentiment"
        })

    except Exception as e:
        error_traceback = traceback.format_exc()
        print(f"❌ Error in sentiment prediction: {str(e)}")
        print(f"Traceback: {error_traceback}")
        return jsonify({"message": f"❌ Error in sentiment prediction: {str(e)}"}), 500


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
    image_name = request.args.get('image', 'momentum_average_crossover.png')
    valid_images = ['momentum_average_crossover.png', 'sentiment_analysis.png', 'macd_analysis.png']
    
    if image_name not in valid_images:
        return jsonify({"message": "❌ Invalid image requested!"}), 400
        
    image_path = os.path.join(GLOBAL_ASSETS_DIR, image_name)

    if os.path.exists(image_path):
        return send_from_directory(GLOBAL_ASSETS_DIR, image_name)
    else:
        return jsonify({"message": "❌ Image not found!"}), 404


@app.route("/public/<path:filename>")
@cross_origin()
def serve_static(filename):
    return send_from_directory(GLOBAL_ASSETS_DIR, filename)


@app.route("/api/predict-macd", methods=["GET"])
@cross_origin()
def predict_macd():
    try:
        # Check if MACD model is loaded
        if macd_model is None:
            return jsonify({"message": "❌ MACD model not loaded. Check server logs."}), 500

        data_path = os.path.join(DATA_DIR, "stock_data.csv")

        # Load stock data
        try:
            if not os.path.exists(data_path):
                return jsonify({"message": "❌ Stock data file not found! Please fetch data first."}), 404
                
            df = pd.read_csv(data_path)
            print(f"✅ Successfully loaded stock data with {len(df)} rows for MACD analysis")
        except Exception as e:
            print(f"❌ Error reading CSV for MACD analysis: {str(e)}")
            return jsonify({"message": f"❌ Error reading stock data: {str(e)}"}), 400

        # Check for data leakage
        leakage_check = check_data_leakage(df)
        print(leakage_check)
        
        # Run time series split validation
        print("\nRunning time series validation...")
        test_signals, model, scaler, features = time_series_split(df)
        
        # Verify return calculation
        return_check = verify_return_calculation(test_signals)
        print(return_check)
        
        # Calculate risk metrics
        risk_metrics = calculate_risk_metrics(test_signals)
        
        # Get latest signal and price
        latest_date = test_signals.index[-1]
        latest_signal = test_signals.loc[latest_date, 'Signal']
        latest_price = test_signals.loc[latest_date, 'Close']
        
        # Convert signal to text
        signal_text = "HOLD" if latest_signal == 0 else "BUY" if latest_signal == 1 else "SELL"
        
        # Calculate price change
        price_change = 0
        percent_change = 0
        if len(df) > 1:
            price_change = df['close'].iloc[-1] - df['close'].iloc[-2]
            percent_change = (price_change / df['close'].iloc[-2]) * 100
            
        # Generate and save MACD performance plot
        try:
            plt.figure(figsize=(12, 6))
            plt.plot(test_signals.index, test_signals['Cumulative_Return'], label='Model Strategy')
            plt.plot(test_signals.index, test_signals['Buy_and_Hold'], label='Buy and Hold')
            plt.title('AAPL Trading Strategy Performance (MACD)')
            plt.xlabel('Date')
            plt.ylabel('Cumulative Return')
            plt.legend()
            plt.grid(True)
            
            # Save the plot
            image_path = os.path.join(GLOBAL_ASSETS_DIR, "macd_analysis.png")
            plt.savefig(image_path, dpi=300, bbox_inches='tight')
            plt.close('all')
            
            print(f"✅ MACD image saved at: {image_path}")
        except Exception as e:
            print(f"❌ Error generating MACD chart: {str(e)}")
            traceback.print_exc()
            # Continue execution - we can still return the prediction even if chart fails

        # Format the signal for response
        if signal_text == "BUY":
            formatted_signal = "📈 MACD Uptrend (Buy)"
            signal_value = 1
        elif signal_text == "SELL":
            formatted_signal = "📉 MACD Downtrend (Sell)"
            signal_value = -1
        else:
            formatted_signal = "↔️ MACD Neutral (Hold)"
            signal_value = 0
            
        # Return MACD prediction
        base_url = request.host_url.rstrip("/")
        return jsonify({
            "message": formatted_signal,
            "signal": signal_text,
            "price": float(latest_price),
            "change": float(price_change),
            "change_percent": float(percent_change),
            "image_url": f"{base_url}/public/macd_analysis.png",
            "model_type": "macd",
            "risk_metrics": risk_metrics
        })

    except Exception as e:
        error_traceback = traceback.format_exc()
        print(f"❌ Error in MACD prediction: {str(e)}")
        print(f"Traceback: {error_traceback}")
        return jsonify({"message": f"❌ Error in MACD prediction: {str(e)}"}), 500


@app.route("/api/predict-transformer", methods=["GET"])
@cross_origin()
def predict_transformer():
    try:
        # Check if Transformer model is loaded
        if transformer_model is None or transformer_scaler is None:
            return jsonify({"message": "❌ Transformer model not loaded. Check server logs."}), 500

        data_path = os.path.join(DATA_DIR, "stock_data.csv")

        # Load stock data
        try:
            if not os.path.exists(data_path):
                return jsonify({"message": "❌ Stock data file not found! Please fetch data first."}), 404
                
            df = pd.read_csv(data_path)
            print(f"✅ Successfully loaded stock data with {len(df)} rows for Transformer analysis")
        except Exception as e:
            print(f"❌ Error reading CSV for Transformer analysis: {str(e)}")
            return jsonify({"message": f"❌ Error reading stock data: {str(e)}"}), 400

        # Prepare data for prediction
        look_back = 60
        close_prices = df['close'].values.reshape(-1, 1)
        scaled = transformer_scaler.transform(close_prices)

        X = []
        for i in range(look_back, len(scaled)):
            X.append(scaled[i - look_back:i, 0])
        X = np.array(X).reshape(-1, look_back, 1)

        # Make prediction
        predicted = transformer_model.predict(X, verbose=0)
        predicted = transformer_scaler.inverse_transform(predicted).flatten()
        actual = transformer_scaler.inverse_transform(scaled[look_back:]).flatten()

        # Generate signals
        signals = []
        for i in range(1, len(predicted)):
            if predicted[i] > actual[i - 1]:
                signals.append("BUY")
            elif predicted[i] < actual[i - 1]:
                signals.append("SELL")
            else:
                signals.append("HOLD")
        signals.insert(0, "HOLD")

        # Get the latest signal
        latest_signal = signals[-1]
        
        # Get latest price
        latest_price = df['close'].iloc[-1]
        
        # Calculate price change
        price_change = 0
        percent_change = 0
        if len(df) > 1:
            price_change = df['close'].iloc[-1] - df['close'].iloc[-2]
            percent_change = (price_change / df['close'].iloc[-2]) * 100

        # Generate and save visualization
        try:
            plt.figure(figsize=(12, 6))
            
            # Plot actual prices
            plt.plot(df.index[-len(actual):], actual, label='Actual Price', color='blue')
            
            # Plot predicted prices
            plt.plot(df.index[-len(predicted):], predicted, label='Predicted Price', color='red', linestyle='--')
            
            # Add buy/sell markers
            buy_indices = [i for i, sig in enumerate(signals) if sig == "BUY"]
            sell_indices = [i for i, sig in enumerate(signals) if sig == "SELL"]
            
            plt.scatter(
                df.index[-len(signals):][buy_indices],
                actual[buy_indices],
                color='green', label='Buy Signal', marker='^', s=100, zorder=5
            )
            plt.scatter(
                df.index[-len(signals):][sell_indices],
                actual[sell_indices],
                color='red', label='Sell Signal', marker='v', s=100, zorder=5
            )
            
            plt.title("Transformer Model Price Prediction and Signals", fontsize=14)
            plt.legend()
            plt.xlabel("Day")
            plt.ylabel("Price ($)")
            plt.grid(True, alpha=0.3)

            # Save the plot
            image_path = os.path.join(GLOBAL_ASSETS_DIR, "transformer_analysis.png")
            plt.savefig(image_path, dpi=300, bbox_inches='tight')
            plt.close('all')

            print(f"✅ Transformer analysis image saved at: {image_path}")
        except Exception as e:
            print(f"❌ Error generating Transformer chart: {str(e)}")
            traceback.print_exc()

        # Format the signal for response
        if latest_signal == "BUY":
            formatted_signal = "📈 Transformer Uptrend (Buy)"
        elif latest_signal == "SELL":
            formatted_signal = "📉 Transformer Downtrend (Sell)"
        else:
            formatted_signal = "↔️ Transformer Neutral (Hold)"

        # Return prediction
        base_url = request.host_url.rstrip("/")
        return jsonify({
            "message": formatted_signal,
            "signal": latest_signal,
            "price": float(latest_price),
            "change": float(price_change),
            "change_percent": float(percent_change),
            "image_url": f"{base_url}/public/transformer_analysis.png",
            "model_type": "transformer"
        })

    except Exception as e:
        error_traceback = traceback.format_exc()
        print(f"❌ Error in Transformer prediction: {str(e)}")
        print(f"Traceback: {error_traceback}")
        return jsonify({"message": f"❌ Error in Transformer prediction: {str(e)}"}), 500



if __name__ == "__main__":
    print("Starting server...")
    print("Health check at /health")
    print("Available models:")
    for name, data in models.items():
        print(f"- {name}: {'✅' if data['model'] else '❌'}")
    
    port = int(os.environ.get("PORT", 5001))
    print(f"Server running on port {port}")
    serve(app, host="0.0.0.0", port=port)