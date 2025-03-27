# AlgoTrade - Algorithmic Trading Platform

![AlgoTrade](https://github.com/user-attachments/assets/96dd7b48-9e9b-40af-af07-86d188d7b920)


## 📌 Overview
AlgoTrade is an advanced algorithmic trading platform designed to assist traders in making data-driven decisions. Using **machine learning models** such as **Random Forest** and **LSTM**, it provides intelligent trade recommendations. The platform integrates **RESTful APIs** to fetch real-time market data and execute trades efficiently.

## 🚀 Features
- 📈 **Real-Time Market Data**: Fetch live stock market data.
- 🤖 **ML-Based Predictions**: Implements Random Forest & LSTM models for trend forecasting.
- 🔄 **Automated Trading**: Execute trades automatically based on pre-defined strategies.
- 📊 **Performance Analytics**: Visual representation of market trends.
- 🌍 **RESTful API Integration**: Secure API-based trade execution.
- 🎯 **User-Friendly UI**: Built using **React, Tailwind CSS, and Express.js**.

## 🛠️ Tech Stack
### **Frontend**
- **React** (Vite)
- **Tailwind CSS**

### **Backend**
- **Express.js** (Node.js)
- **RESTful API** (for ML models)

### **Machine Learning**
- **Scikit-learn** (Random Forest)
- **TensorFlow/Keras** (LSTM)

## **Project Live Link** - https://project-mocha-delta-69.vercel.app/
## **API Used** - https://polygon.io/

## 🏗️ Project Structure
```plaintext
AlgoTrade/
│── .bolt/               # Project-related metadata (if any)
│── data/                # Data files related to stock market analysis
│── dist/                # Build files for deployment
│── models/              # Machine learning models (Random Forest, LSTM, etc.)
│── node_modules/        # Dependencies installed via npm/yarn
│── public/              # Static assets (images, icons, etc.)
│── src/                 # Frontend source code
│   │── assets/          # Images, logos, and static assets
│   │── components/      # React components
│   │── App.jsx          # Main React app component
│   │── index.css        # Global styles
│   │── main.jsx         # React entry point
│   │── vite-env.d.ts    # TypeScript environment definitions
│── .gitattributes       # Git file attribute settings
│── .gitignore           # Git ignore file for unnecessary files
│── eslint.config.js     # ESLint configuration for code quality
│── index.html           # Main HTML file
│── package-lock.json    # Lock file for installed dependencies
│── package.json         # Project metadata and dependencies
│── postcss.config.js    # PostCSS configuration for styling
│── README.md            # Documentation file
│── requirements.txt     # Python dependencies (for backend/ML)
│── server.py            # Backend API using FastAPI/Flask
│── tailwind.config.js   # Tailwind CSS configuration
│── tsconfig.app.json    # TypeScript config for the application
│── tsconfig.json        # TypeScript global configuration
│── vite.config.js       # Vite configuration for React development
```

## 🖥️ Installation & Setup
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-username/AlgoTrade.git
cd AlgoTrade
```

### **3️⃣ Frontend Setup**
```bash
npm install  # Install dependencies
npm run dev  # Start React app
```

### **2️⃣ Backend Setup**
```bash
npm install express '@polygon.io/client-js'  # Install dependencies
node server.js  # Start the backend server
```

### **4️⃣ ML Model Setup**
```bash
pip install -r requirements.txt  # Install Python dependencies
python server.py  # Start FastAPI server
```

## After cloning repo and installing all dependencies, open 3 terminal, run node server.js, python server.py and npm run dev in seperate terminals.

## 📌 API Endpoints
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| GET    | `/api/check-file`       | Fetch live stock data |
| POST   | `/api/predict`          | Predict stock trends  |

## 📊 Demo Screenshots
![Dashboard](https://github.com/user-attachments/assets/59d1b246-431b-426d-99e0-cdcd95431d54)
![Trading View](https://github.com/user-attachments/assets/ff437ab3-43da-4c38-9414-2c3cd6732f20)


## 📬 Contact
- 📧 Email: rupesh583k@gmail.com
- 🐙 GitHub: [26kumar](https://github.com/26kumar)
- 🔗 LinkedIn: [Rupesh Kumar](https://www.linkedin.com/in/rupesh-kumar-567198279)

---
**⭐ If you like this project, give it a star!** 🚀

