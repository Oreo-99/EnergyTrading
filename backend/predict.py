import requests
import numpy as np
import torch
import torch.nn as nn
import joblib
from flask import Flask, request, jsonify
import collections
import os

app = Flask(__name__)

# LSTM Model Definition


class LSTMModel(nn.Module):
    def __init__(self, input_size=30, hidden_size=200, num_layers=1, output_size=1, bidirectional=True):
        super(LSTMModel, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.bidirectional = bidirectional

        # LSTM Layer
        self.lstm = nn.LSTM(input_size=input_size,
                            hidden_size=hidden_size,
                            num_layers=num_layers,
                            batch_first=True,
                            bidirectional=bidirectional)

        # Fully connected layer
        fc_input_size = hidden_size * 2 if bidirectional else hidden_size
        self.fc = nn.Linear(fc_input_size, output_size)

    def forward(self, x):
        h0 = torch.zeros(self.num_layers * (2 if self.bidirectional else 1),
                         x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers * (2 if self.bidirectional else 1),
                         x.size(0), self.hidden_size).to(x.device)
        out, _ = self.lstm(x, (h0, c0))
        out = self.fc(out[:, -1, :])
        return out

# Helper Functions


def fetch_weather_data_for_cities(cities):
    all_weather_data = {}
    for city in cities:
        url = f'http://api.weatherstack.com/current?access_key=9f55c7dda8147ace8ce359222e1fb0b3&query={city},India'
        try:
            response = requests.get(url)
            if response.status_code != 200:
                raise ValueError(f"Error: Received status code {response.status_code} for city {city}")
            weather_data = response.json()
            if 'current' not in weather_data:
                raise ValueError(f"API response missing current data for city {city}")
            current_data = weather_data['current']
            weather_features = {
                'temp': current_data['temperature'],
                'pressure': current_data['pressure'],
                'humidity': current_data['humidity'],
                'wind_speed': current_data['wind_speed'],
                'wind_deg': current_data['wind_degree'],
                'rain_1h': current_data['precip'],
                'clouds_all': current_data['cloudcover'],
            }
            all_weather_data[city] = weather_features
        except Exception as e:
            print(f"Error fetching weather data for {city}: {e}")
    return all_weather_data


def construct_input_features(weather_data, energy_type):
    features = {
        'generation_biomass': 450.0 if energy_type == "biomass" else 0.0,
        'generation_fossil_brown_coal/lignite': 329.0 if energy_type == "coal" else 0.0,
        'generation_fossil_gas': 0.0,
        'generation_fossil_hard_coal': 0.0,
        'generation_fossil_oil': 100.0 if energy_type == "coal" else 0.0,
        'generation_hydro_pumped_storage_consumption': 0.0,
        'generation_hydro_run-of-river_and_poundage': 0.0,
        'generation_hydro_water_reservoir': 0.0,
        'generation_nuclear': 0.0,
        'generation_other': 0.0,
        'generation_other_renewable': 0.0,
        'generation_solar': 6378.0 if energy_type == "solar" else 0.0,
        'generation_waste': 0.0,
        'generation_wind_onshore': 0.0 if energy_type != "wind" else 6378.0,
        'temp': weather_data["temp"],
        'temp_min': 278,
        'temp_max': 300,
        'pressure': weather_data["pressure"],
        'humidity': weather_data["humidity"],
        'wind_speed': weather_data["wind_speed"],
        'wind_deg': weather_data["wind_deg"],
        'rain_1h': weather_data["rain_1h"],
        'clouds_all': weather_data["clouds_all"],
        'is_clear': 0.0,
        'is_clouds': 0.0,
        'is_drizzle': 0.0,
        'is_fog': 0.0,
        'is_mist': 0.0,
        'is_rain': 0.0
    }
    columns = [
        'generation_biomass', 'generation_fossil_brown_coal/lignite', 'generation_fossil_gas',
        'generation_fossil_hard_coal', 'generation_fossil_oil', 'generation_hydro_pumped_storage_consumption',
        'generation_hydro_run-of-river_and_poundage', 'generation_hydro_water_reservoir', 'generation_nuclear',
        'generation_other', 'generation_other_renewable', 'generation_solar', 'generation_waste', 'generation_wind_onshore',
        'temp', 'temp_min', 'temp_max', 'pressure', 'humidity', 'wind_speed', 'wind_deg', 'rain_1h', 'clouds_all',
        'is_clear', 'is_clouds', 'is_drizzle', 'is_fog', 'is_mist', 'is_rain'
    ]
    input_vector = [features.get(col, 0.0) for col in columns]
    return input_vector


def convert_ordered_dict_to_model(state_dict):
    model = LSTMModel(input_size=30, hidden_size=200,num_layers=1, output_size=1)

    try:
        model.load_state_dict(state_dict)
        print("Model successfully converted and loaded!")
        model.eval()
        return model
    except Exception as e:
        print(f"Error converting model: {e}")
        return None


def initialize_model(model_path, scaler_path):
    try:
        checkpoint = torch.load(model_path, map_location=torch.device('cpu'))
        if isinstance(checkpoint, collections.OrderedDict):
            # If it's directly an OrderedDict of state_dict
            model = convert_ordered_dict_to_model(checkpoint)
        elif 'model_state_dict' in checkpoint:
            # If it's a dictionary with 'model_state_dict' key
            model = convert_ordered_dict_to_model(
                checkpoint['model_state_dict'])
        else:
            # Try converting whatever the checkpoint is
            model = convert_ordered_dict_to_model(checkpoint)
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None
    try:
        scaler = joblib.load(scaler_path)
    except Exception as e:
        print(f"Error loading scaler: {e}")
        scaler = None
    return model, scaler


def predict_energy_demand(model, scaler, input_vector):
    try:
        input_scaled = scaler.transform(np.array(input_vector).reshape(1, -1))
        full_input = np.concatenate([input_scaled[0], [1000.0]])
        input_tensor = torch.FloatTensor(full_input).unsqueeze(0).unsqueeze(0)
        with torch.no_grad():
            prediction = model(input_tensor).item()
        return round(prediction, 2)
    except Exception as e:
        print(f"Prediction error: {e}")
        return None

# Flask Routes




@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    city = data.get('city')
    
    if not city:
        return jsonify({'error': 'City and energy type are required'}), 400
    cities = [city]
    city_data = fetch_weather_data_for_cities(cities)
    

    weather_data = city_data[city]
    predictions={}
    energy_types = ['solar', 'wind', 'coal', 'hydro']
    
    for energy_type in energy_types:
        input_vector = construct_input_features(weather_data, energy_type)
        prediction = predict_energy_demand(model, scaler, input_vector)
        if prediction is not None:
            predictions[energy_type] = prediction
        else:
            predictions[energy_type] = 'Prediction failed'
    
    return jsonify({'city': city, 'predictions': predictions})



if __name__ == "__main__":
    BASE_DIR = os.path.dirname(__file__)
    model_path = os.path.join(BASE_DIR, "bilstm_model.pth")
    scaler_path = os.path.join(BASE_DIR, "scaler_new.pkl")
    model, scaler = initialize_model(model_path, scaler_path)
    app.run(debug=True)
