import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import pickle
import os
import requests
from math import radians, cos, sin, asin, sqrt
from tkintermapview import TkinterMapView
#import matplotlib.pyplot as plt # Removed for now
# from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg # Removed for now
from PIL import Image, ImageTk # Added for logo

# ===== Constants & Files =====
WEATHER_API_KEY = "3bc25592caad2d296cd133b6ea64e685"  
ORS_API_KEY = "5b3ce3597851110001cf624834cf5df0f60e4352afb2b81dfc3ed76d" # Openrouteservice API Key

ROUTE_HISTORY_FILE = "route_history.pkl"
USERS_FILE = "users.pkl"
LOGO_FILE = "logo.png" # Define logo file path

# ===== Helper Functions =====

def get_real_time_weather(lat, lon):
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
    weather_condition = "Unknown" # Default
    try:
        response = requests.get(url, timeout=10) # Increased timeout
        response.raise_for_status()  # Raises an HTTPError for bad responses (4XX or 5XX)
        data = response.json()
        # print(f"Weather API Response: {data}") # Uncomment for debugging

        if "weather" in data and len(data['weather']) > 0:
            weather_main = data['weather'][0]['main']
            weather_desc = data['weather'][0]['description']
            # temp = data.get('main', {}).get('temp', 'N/A') # Optional: if you want to use temperature
            # print(f"Raw weather: {weather_main} ({weather_desc}), Temp: {temp}°C") # Debugging

            w_main = weather_main.lower()
            
            if w_main == 'thunderstorm':
                weather_condition = "Stormy"
            elif w_main == 'drizzle':
                weather_condition = "Drizzle"
            elif w_main == 'rain':
                weather_condition = "Rainy"
            elif w_main == 'snow':
                weather_condition = "Snowy"
            elif w_main in ['mist', 'smoke', 'haze', 'dust', 'fog', 'sand', 'ash', 'squall', 'tornado']:
                weather_condition = "Misty/Foggy"
            elif w_main == 'clear':
                weather_condition = "Clear" # Explicitly "Clear"
            elif w_main == 'clouds':
                if 'few clouds' in weather_desc.lower() or 'scattered clouds' in weather_desc.lower():
                    weather_condition = "Partly Cloudy"
                else: # broken clouds, overcast clouds
                    weather_condition = "Cloudy"
            else:
                # For any other main condition not explicitly handled, consider it based on description or default
                # This part can be refined if OpenWeatherMap has other common 'main' types
                weather_condition = weather_main # Use the main description if not mapped
        else:
            print("Weather data not in expected format or missing 'weather' field.")
            # print(f"Problematic data: {data}") # Debugging
            weather_condition = "Format Error"

    except requests.exceptions.HTTPError as http_err:
        print(f"Weather API HTTP error: {http_err}")
        print(f"Response status: {response.status_code}, Response text: {response.text}")
        if response.status_code == 401:
            weather_condition = "Invalid API Key"
        elif response.status_code == 404: # Often for invalid coordinates too
            weather_condition = "Location Not Found"
        elif response.status_code == 429:
            weather_condition = "API Limit Reached"
        else:
            weather_condition = f"API HTTP Error ({response.status_code})"
    except requests.exceptions.ConnectionError as conn_err:
        print(f"Weather API Connection error: {conn_err}")
        weather_condition = "Connection Error"
    except requests.exceptions.Timeout as timeout_err:
        print(f"Weather API Timeout error: {timeout_err}")
        weather_condition = "Timeout Error"
    except requests.exceptions.RequestException as req_err:
        print(f"Weather API Request error: {req_err}")
        weather_condition = "Request Error"
    except Exception as e:
        print(f"Weather API unexpected error: {e}")
        try:
            print(f"Problematic response text: {response.text}")
        except NameError:
            pass
        except AttributeError:
             pass
        weather_condition = "Processing Error"
    
    # print(f"Final determined weather: {weather_condition}") # Debugging
    return weather_condition

def dummy_time_predictor(distance, weather):
    base_time = distance / 40 * 60  # base time in minutes assuming 40 km/h
    if weather == "Rainy":
        return base_time * 1.3
    elif weather == "Stormy":
        return base_time * 1.5
    return base_time

def save_route(username, source, destination, distance, time, weather):
    history = {}
    if os.path.exists(ROUTE_HISTORY_FILE):
        with open(ROUTE_HISTORY_FILE, "rb") as f:
            history = pickle.load(f)
    if username not in history:
        history[username] = []
    history[username].append((source, destination, distance, time, weather))
    with open(ROUTE_HISTORY_FILE, "wb") as f:
        pickle.dump(history, f)

def get_history(username):
    if os.path.exists(ROUTE_HISTORY_FILE):
        with open(ROUTE_HISTORY_FILE, "rb") as f:
            history = pickle.load(f)
            return history.get(username, [])
    return []

def register_user(username, password):
    users = {}
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, "rb") as f:
            users = pickle.load(f)
    if username in users:
        return False
    users[username] = password
    with open(USERS_FILE, "wb") as f:
        pickle.dump(users, f)
    return True

def validate_user(username, password):
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, "rb") as f:
            users = pickle.load(f)
            return users.get(username) == password
    return False

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # km
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c

def geocode_location(location_name):
    """
    Convert location name to coordinates using Nominatim (OpenStreetMap).
    :param location_name: str, location name to search
    :return: tuple (lat, lon) or None if not found
    """
    if not location_name or not location_name.strip():
        return None
    
    try:
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            "q": location_name,
            "format": "json",
            "limit": 1
        }
        headers = {"User-Agent": "SpeedyXpress-RouteOptimizer"}
        
        response = requests.get(url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data and len(data) > 0:
            result = data[0]
            lat = float(result.get("lat"))
            lon = float(result.get("lon"))
            return (lat, lon)
        else:
            return None
    except Exception as e:
        print(f"Geocoding error: {e}")
        return None

def get_ors_route(start_coords, end_coords, profile="driving-car"):
    """
    Fetches a route from Openrouteservice API.
    :param start_coords: tuple (lat, lon)
    :param end_coords: tuple (lat, lon)
    :param profile: ORS profile (e.g., 'driving-car', 'foot-walking')
    :return: dict with 'path' (list of (lat,lon) tuples), 'distance_km', 'duration_min', or None if error
    """
    # ORS API expects coordinates as (longitude, latitude)
    start_lon_lat = f"{start_coords[1]},{start_coords[0]}"
    end_lon_lat = f"{end_coords[1]},{end_coords[0]}"

    api_url = f"https://api.openrouteservice.org/v2/directions/{profile}"
    params = {
        "api_key": ORS_API_KEY,
        "start": start_lon_lat,
        "end": end_lon_lat,
    }

    try:
        print(f"Requesting ORS route: {api_url} with params (key hidden): start={start_lon_lat}, end={end_lon_lat}")
        response = requests.get(api_url, params=params, timeout=20) # Increased timeout for routing
        response.raise_for_status()  # Raise an exception for HTTP errors
        data = response.json()
        # print(f"ORS Response Data: {data}") # For debugging

        if "features" in data and len(data["features"]) > 0:
            feature = data["features"][0]
            geometry = feature.get("geometry", {}).get("coordinates")
            properties = feature.get("properties", {})
            summary = properties.get("summary", {})
            
            distance_meters = summary.get("distance")
            duration_seconds = summary.get("duration")

            if geometry and distance_meters is not None and duration_seconds is not None:
                # Geometry is list of [lon, lat] points
                path_coordinates = [(point[1], point[0]) for point in geometry] # Convert to (lat, lon)
                
                return {
                    "path": path_coordinates,
                    "distance_km": round(distance_meters / 1000, 2),
                    "duration_min": round(duration_seconds / 60, 1),
                    "error": None
                }
            else:
                print("ORS Error: Missing geometry, distance, or duration in response.")
                return {"error": "ORS: Incomplete route data", "path": None, "distance_km": None, "duration_min": None}
        else:
            error_message = "ORS: No route found or unexpected response format."
            if "error" in data: # ORS often includes an error object
                error_message += f" API Msg: {data['error'].get('message', 'Unknown ORS error')}"
            print(error_message)
            return {"error": error_message, "path": None, "distance_km": None, "duration_min": None}

    except requests.exceptions.HTTPError as http_err:
        error_msg = f"ORS HTTP error: {http_err}. Status: {response.status_code}. Response: {response.text[:200]}"
        print(error_msg)
        return {"error": error_msg, "path": None, "distance_km": None, "duration_min": None}
    except requests.exceptions.RequestException as req_err:
        error_msg = f"ORS Request error: {req_err}"
        print(error_msg)
        return {"error": error_msg, "path": None, "distance_km": None, "duration_min": None}
    except Exception as e:
        error_msg = f"ORS Unexpected error: {e}"
        print(error_msg)
        return {"error": error_msg, "path": None, "distance_km": None, "duration_min": None}

# ===== GUI Classes =====

# Note: Ensure Pillow is installed: pip install Pillow

class LoginWindow:
    def __init__(self, master):
        self.master = master
        master.title("SpeedyXpress") # Simplified title
        master.configure(bg="#0C0D0E")
        master.geometry("600x600")
        master.minsize(400, 550)
        master.resizable(True, True)
        master.grid_rowconfigure(0, weight=1)
        master.grid_columnconfigure(0, weight=1)

        master.update_idletasks()
        width = master.winfo_width()
        height = master.winfo_height()
        x_pos = (master.winfo_screenwidth() // 2) - (width // 2)
        y_pos = (master.winfo_screenheight() // 2) - (height // 2)
        master.geometry(f'{width}x{height}+{x_pos}+{y_pos}')

        self.frame = tk.Frame(master, bg="#04121F", padx=30, pady=30)
        self.frame.grid(row=0, column=0, sticky="nsew", padx=30, pady=30)
        self.frame.grid_columnconfigure(0, weight=1) # Ensure content in frame can expand

        self.current_action = None # To track if 'login' or 'register' form is active

        # --- Styling Constants ---
        self.title_font = ("Segoe UI", 24, "bold")
        self.tagline_font = ("Segoe UI", 10, "italic")
        self.label_font = ("Segoe UI", 11)
        self.entry_font = ("Segoe UI", 11)
        self.button_font = ("Segoe UI", 11, "bold")
        
        self.label_fg = "#D3D3D3"  # Light Grey
        self.entry_bg = "#0E1C31"  # Almost Black
        self.entry_fg = "#F5F5F5"  # Very Light Grey
        self.entry_insert_bg = "#F5F5F5"
        
        self.primary_button_bg = "#040B22"  # Dark Grey
        self.primary_button_fg = "#FFFFFF"  # White Text
        self.primary_button_active_bg = "#4F4F4F"  # Lighter Grey on hover
        
        self.secondary_button_bg = "#808080"  # Medium Grey
        self.secondary_button_fg = "#FFFFFF"
        self.secondary_button_active_bg = "#A9A9A9"  # Light Grey


        # --- Widgets (created once, shown/hidden as needed) ---
        # Logo
        try:
            img = Image.open(LOGO_FILE)
            img = img.resize((200, 160), Image.LANCZOS) # Made logo larger
            self.logo_img = ImageTk.PhotoImage(img)
            self.logo_label = tk.Label(self.frame, image=self.logo_img, bg="#02162B")
        except Exception as e:
            print(f"Error loading logo: {e}")
            self.logo_label = tk.Label(self.frame, text="[SpeedyXpress Logo]", fg="#ECF0F1", bg="#031A31", font=("Arial", 12, "bold"))
        
        # Title and Tagline
        self.title_label = tk.Label(self.frame, text="SpeedyXpress", fg="#ECF0F1", bg="#021425", font=self.title_font)
        self.tagline_label = tk.Label(self.frame, text="Optimize. Navigate. Dominate. SpeedyXpress!", fg=self.label_fg, bg="#021527", font=("Helvetica", 18, "italic"), wraplength=300, justify="center")


        # Initial action buttons
        self.btn_initial_login = tk.Button(self.frame, text="Login", bg=self.primary_button_bg, fg=self.primary_button_fg, font=self.button_font, command=self._show_login_form, relief="flat", activebackground=self.primary_button_active_bg, activeforeground=self.primary_button_fg, bd=0, pady=8)
        self.btn_initial_signup = tk.Button(self.frame, text="Sign Up", bg=self.secondary_button_bg, fg=self.secondary_button_fg, font=self.button_font, command=self._show_signup_form, relief="flat", activebackground=self.secondary_button_active_bg, activeforeground=self.secondary_button_fg, bd=0, pady=8)

        # Form fields (Labels are part of the form display methods)
        self.username_label_widget = tk.Label(self.frame, text="Username", fg=self.label_fg, bg="#34495E", font=self.label_font)
        self.username_entry = tk.Entry(self.frame, font=self.entry_font, bg=self.entry_bg, fg=self.entry_fg, insertbackground=self.entry_insert_bg, relief="flat", highlightthickness=1, highlightbackground="#4A6572", highlightcolor="#5DADE2", bd=0)
        
        self.password_label_widget = tk.Label(self.frame, text="Password", fg=self.label_fg, bg="#34495E", font=self.label_font)
        self.password_entry = tk.Entry(self.frame, show="•", font=self.entry_font, bg=self.entry_bg, fg=self.entry_fg, insertbackground=self.entry_insert_bg, relief="flat", highlightthickness=1, highlightbackground="#4A6572", highlightcolor="#5DADE2", bd=0)

        # Submit and Back buttons for forms
        self.btn_submit_action = tk.Button(self.frame, text="Proceed", bg=self.primary_button_bg, fg=self.primary_button_fg, font=self.button_font, command=self._handle_submit, relief="flat", activebackground=self.primary_button_active_bg, activeforeground=self.primary_button_fg, bd=0, pady=8)
        self.btn_back_to_options = tk.Button(self.frame, text="Back", bg=self.secondary_button_bg, fg=self.secondary_button_fg, font=self.button_font, command=self._setup_initial_view, relief="flat", activebackground=self.secondary_button_active_bg, activeforeground=self.secondary_button_fg, bd=0, pady=8)

        self._setup_initial_view()

    def _clear_entries(self):
        self.username_entry.delete(0, tk.END)
        self.password_entry.delete(0, tk.END)

    def _hide_all_form_elements(self):
        self.username_label_widget.grid_remove()
        self.username_entry.grid_remove()
        self.password_label_widget.grid_remove()
        self.password_entry.grid_remove()
        self.btn_submit_action.grid_remove()
        self.btn_back_to_options.grid_remove()
        self.btn_initial_login.grid_remove()
        self.btn_initial_signup.grid_remove()

    def _setup_initial_view(self):
        self._hide_all_form_elements()
        self._clear_entries()
        self.current_action = None

        self.logo_label.grid(row=0, column=0, pady=(0, 15), sticky="ew")
        self.title_label.grid(row=1, column=0, pady=(0, 5), sticky="ew")
        self.tagline_label.grid(row=2, column=0, pady=(0, 25), sticky="ew") # Increased padding
        
        self.btn_initial_login.grid(row=3, column=0, pady=(5,8), sticky="ew")
        self.btn_initial_signup.grid(row=4, column=0, pady=(0,5), sticky="ew")
        
        # Ensure frame rows are configured for centering if content is less than full height
        for i in range(5): # Number of rows used in initial view
            self.frame.grid_rowconfigure(i, weight=0) # Reset weight
        self.frame.grid_rowconfigure(2, weight=1) # Give tagline some space to push buttons down if window is tall
        self.frame.grid_rowconfigure(3, weight=0)
        self.frame.grid_rowconfigure(4, weight=0)


    def _show_form_fields(self, action_type):
        self._hide_all_form_elements()
        self._clear_entries()
        self.current_action = action_type

        self.logo_label.grid(row=0, column=0, pady=(0, 10), sticky="ew")
        self.title_label.grid(row=1, column=0, pady=(0, 3), sticky="ew")
        self.tagline_label.grid(row=2, column=0, pady=(0, 15), sticky="ew")

        self.username_label_widget.grid(row=3, column=0, sticky="w", pady=(10,2))
        self.username_entry.grid(row=4, column=0, pady=(0,15), ipady=6, sticky="ew")
        
        self.password_label_widget.grid(row=5, column=0, sticky="w", pady=(0,2))
        self.password_entry.grid(row=6, column=0, pady=(0,20), ipady=6, sticky="ew")
        
        button_text = "Login" if action_type == "login" else "Register"
        self.btn_submit_action.config(text=button_text)
        self.btn_submit_action.grid(row=7, column=0, pady=(5,8), sticky="ew")
        self.btn_back_to_options.grid(row=8, column=0, pady=(0,5), sticky="ew")
        
        self.username_entry.focus_set() # Set focus to username field

    def _show_login_form(self):
        self._show_form_fields("login")

    def _show_signup_form(self):
        self._show_form_fields("register")

    def _handle_submit(self):
        username = self.username_entry.get().strip()
        password = self.password_entry.get()

        if not username or not password:
            messagebox.showerror("Error", "Username and Password cannot be empty.")
            return

        if self.current_action == "login":
            self._perform_login(username, password)
        elif self.current_action == "register":
            self._perform_register(username, password)

    def _perform_login(self, username, password):
        if validate_user(username, password):
            messagebox.showinfo("Success", f"Welcome, {username}!")
            self.master.destroy()
            main_app(username)
        else:
            messagebox.showerror("Login Failed", "Invalid username or password.")
            # Optionally clear password or keep form: self.password_entry.delete(0, tk.END)

    def _perform_register(self, username, password):
        if register_user(username, password):
            messagebox.showinfo("Success", "User registered successfully! Please log in.")
            self._setup_initial_view() # Go back to initial screen after successful registration
        else:
            messagebox.showerror("Registration Failed", "Username already exists.")
            # Optionally clear username or keep form: self.username_entry.delete(0, tk.END)


class RouteApp:
    def __init__(self, root, username):
        self.root = root
        self.username = username
        root.title(f"Delivery Route Adventure - User: {username}")
        root.configure(bg="#121212")
        root.geometry("1050x650")
        root.resizable(True, True)
        root.protocol("WM_DELETE_WINDOW", self._on_closing) # Handle window close button

        # Layout configuration for resizing (even if fixed size)
        root.grid_columnconfigure(0, weight=3) # Give more weight to the map
        root.grid_columnconfigure(1, weight=2) # Give some weight to the right panel
        root.grid_rowconfigure(0, weight=1)

        # Map init - New York City approx.
        self.lat, self.lon = 40.7128, -74.0060 # Default to New York City

        # Map widget (OpenStreetMap tiles, no API key needed)
        self.map_widget = TkinterMapView(root, width=700, height=600, corner_radius=0)
        self.map_widget.set_position(self.lat, self.lon)
        self.map_widget.set_zoom(10) # Zoom level for a city view
        self.map_widget.set_tile_server("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png")
        self.map_widget.grid(row=0, column=0, padx=15, pady=15, sticky="nsew")

        # Markers
        self.source_marker = self.map_widget.set_marker(self.lat, self.lon, text="Source")
        self.dest_marker = self.map_widget.set_marker(self.lat + 0.05, self.lon + 0.05, text="Destination") # Adjusted initial dest
        self.selecting_source = True
        self.source_coords = (self.lat, self.lon)
        self.dest_coords = (self.lat + 0.05, self.lon + 0.05) # Adjusted initial dest coords

        self.map_widget.add_left_click_map_command(self.map_click)

        # Right panel frame
        right_frame = tk.Frame(root, bg="#222222") # Removed fixed width
        right_frame.grid(row=0, column=1, sticky="nsew", padx=(0,15), pady=15) # Allow right_frame to expand
        # right_frame.grid_propagate(False) # Allow propagation for better sizing with notebook
        right_frame.grid_columnconfigure(0, weight=1) # Allow content within right_frame to expand

        # Buttons
        style = ttk.Style()
        style.configure("TButton", padding=6, font=("Arial", 12))
        style.map("TButton",
                  foreground=[('pressed', '#d3d3d3'), ('active', '#ffffff')],
                  background=[('pressed', '#333333'), ('active', '#555555')])

        # --- Buttons Frame ---
        buttons_sub_frame = tk.Frame(right_frame, bg="#222222")
        buttons_sub_frame.grid(row=0, column=0, sticky="ew", pady=(0,10), padx=10)
        buttons_sub_frame.grid_columnconfigure(0, weight=1)

        # Location Input Section
        tk.Label(buttons_sub_frame, text="Source Location:", fg="#D3D3D3", bg="#222222", font=("Arial", 10, "bold")).grid(row=0, column=0, sticky="w", pady=(5, 2))
        self.source_location_entry = tk.Entry(buttons_sub_frame, font=("Arial", 10), bg="#0E1C31", fg="#F5F5F5", insertbackground="white")
        self.source_location_entry.grid(row=1, column=0, sticky="ew", pady=(0, 5), ipady=4)
        self.source_location_entry.bind("<Return>", lambda e: self.set_source_from_entry())
        
        tk.Label(buttons_sub_frame, text="Destination Location:", fg="#D3D3D3", bg="#222222", font=("Arial", 10, "bold")).grid(row=2, column=0, sticky="w", pady=(5, 2))
        self.dest_location_entry = tk.Entry(buttons_sub_frame, font=("Arial", 10), bg="#0E1C31", fg="#F5F5F5", insertbackground="white")
        self.dest_location_entry.grid(row=3, column=0, sticky="ew", pady=(0, 5), ipady=4)
        self.dest_location_entry.bind("<Return>", lambda e: self.set_dest_from_entry())

        btn_set_source = ttk.Button(buttons_sub_frame, text="Set Source from Text", command=self.set_source_from_entry)
        btn_set_source.grid(row=4, column=0, sticky="ew", pady=(0, 5))

        btn_set_dest = ttk.Button(buttons_sub_frame, text="Set Destination from Text", command=self.set_dest_from_entry)
        btn_set_dest.grid(row=5, column=0, sticky="ew", pady=(0, 10))

        tk.Label(buttons_sub_frame, text="OR click on map:", fg="#A0A0A0", bg="#222222", font=("Arial", 9, "italic")).grid(row=6, column=0, sticky="w", pady=(5, 5))

        btn_predict = ttk.Button(buttons_sub_frame, text="Predict Route", command=self.predict_route)
        btn_predict.grid(row=7, column=0, sticky="ew", pady=(5, 5))

        self.btn_show_path = ttk.Button(buttons_sub_frame, text="Show Path on Map", command=self.show_path_on_map_tab)
        self.btn_show_path.grid(row=8, column=0, sticky="ew", pady=(0, 5))
        self.btn_show_path.configure(state="disabled") # Disabled until a prediction is made

        btn_history = ttk.Button(buttons_sub_frame, text="View History", command=self.show_history_tab)
        btn_history.grid(row=9, column=0, sticky="ew", pady=(0, 5))
        
        btn_logout = ttk.Button(buttons_sub_frame, text="Logout", command=self.logout)
        btn_logout.grid(row=10, column=0, sticky="ew", pady=(0, 10))
        
        # --- Weather Label ---
        self.weather_label = tk.Label(right_frame, text="Current Weather: Unknown", fg="#a0ffa0", bg="#222222", font=("Arial", 12, "bold"))
        self.weather_label.grid(row=1, column=0, sticky="w", padx=10, pady=(0,10))
        
        # --- Notebook for Tabs ---
        self.notebook = ttk.Notebook(right_frame)
        self.notebook.grid(row=2, column=0, sticky="nsew", padx=10, pady=(0,10))
        right_frame.grid_rowconfigure(2, weight=1) # Allow notebook to expand

        # Tab 1: Results
        self.results_tab = ttk.Frame(self.notebook)
        self.notebook.add(self.results_tab, text='Prediction')
        self.results_tab.grid_columnconfigure(0, weight=1)
        self.results_tab.grid_rowconfigure(0, weight=1)
        self.result_text = scrolledtext.ScrolledText(self.results_tab, width=38, height=10, font=("Courier", 11), bg="#1c1c1c", fg="#70ff70", insertbackground="white", state="disabled")
        self.result_text.grid(row=0, column=0, sticky="nsew")

        # Tab 2: Show Path (Map)
        self.path_map_tab = ttk.Frame(self.notebook)
        self.notebook.add(self.path_map_tab, text='Route Path')
        self.path_map_tab.grid_columnconfigure(0, weight=1)
        self.path_map_tab.grid_rowconfigure(0, weight=1)
        self.path_map_widget = None # Will be initialized when "Show Path" is clicked
        self.path_line = None # To store the path object on the path_map_widget
        self.current_ors_path_coordinates = None # To store coordinates from ORS

    def set_source_from_entry(self):
        """Set source location from manual text entry."""
        location_name = self.source_location_entry.get().strip()
        if not location_name:
            messagebox.showwarning("Input Error", "Please enter a source location name.")
            return
        
        messagebox.showinfo("Searching", f"Finding location: {location_name}\nPlease wait...")
        coords = geocode_location(location_name)
        
        if coords:
            lat, lon = coords
            self.source_coords = (lat, lon)
            
            # Update marker on main map
            if self.source_marker:
                self.source_marker.delete()
            self.source_marker = self.map_widget.set_marker(lat, lon, text=f"Source\n({location_name})")
            
            # Pan map to the new location
            self.map_widget.set_position(lat, lon)
            self.map_widget.set_zoom(12)
            
            messagebox.showinfo("Success", f"Source location set to:\n{location_name}\nCoordinates: ({lat:.4f}, {lon:.4f})")
        else:
            messagebox.showerror("Not Found", f"Location '{location_name}' could not be found.\nPlease try another location name.")
    
    def set_dest_from_entry(self):
        """Set destination location from manual text entry."""
        location_name = self.dest_location_entry.get().strip()
        if not location_name:
            messagebox.showwarning("Input Error", "Please enter a destination location name.")
            return
        
        messagebox.showinfo("Searching", f"Finding location: {location_name}\nPlease wait...")
        coords = geocode_location(location_name)
        
        if coords:
            lat, lon = coords
            self.dest_coords = (lat, lon)
            
            # Update marker on main map
            if self.dest_marker:
                self.dest_marker.delete()
            self.dest_marker = self.map_widget.set_marker(lat, lon, text=f"Destination\n({location_name})")
            
            # Pan map to the new location
            self.map_widget.set_position(lat, lon)
            self.map_widget.set_zoom(12)
            
            messagebox.showinfo("Success", f"Destination location set to:\n{location_name}\nCoordinates: ({lat:.4f}, {lon:.4f})")
        else:
            messagebox.showerror("Not Found", f"Location '{location_name}' could not be found.\nPlease try another location name.")

        # Tab 3: History
        self.history_tab = ttk.Frame(self.notebook)
        self.notebook.add(self.history_tab, text='History')
        self.history_tab.grid_columnconfigure(0, weight=1)
        self.history_tab.grid_rowconfigure(0, weight=1)
        self.history_text = scrolledtext.ScrolledText(self.history_tab, font=("Courier", 11), bg="#1c1c1c", fg="#70ff70", insertbackground="white", state="disabled")
        self.history_text.grid(row=0, column=0, sticky="nsew")

    def map_click(self, coords):
        lat, lon = coords
        if self.selecting_source:
            if self.source_marker:
                self.source_marker.delete()
            self.source_marker = self.map_widget.set_marker(lat, lon, text="Source")
            self.source_coords = (lat, lon)
            self.selecting_source = False
            
        else:
            if self.dest_marker:
                self.dest_marker.delete()
            self.dest_marker = self.map_widget.set_marker(lat, lon, text="Destination")
            self.dest_coords = (lat, lon)
            self.selecting_source = True
            

    def predict_route(self):
        lat_src, lon_src = self.source_coords
        lat_dst, lon_dst = self.dest_coords
        self.current_ors_path_coordinates = None # Reset previous ORS path

        # Get weather at source location
        weather = get_real_time_weather(lat_src, lon_src)
        self.weather_label.config(text=f"Weather at Source: {weather}")

        # Attempt to get route from Openrouteservice
        ors_route_data = get_ors_route(self.source_coords, self.dest_coords)

        self.result_text.configure(state="normal")
        self.result_text.delete(1.0, tk.END)

        if ors_route_data and ors_route_data.get("path"):
            self.current_ors_path_coordinates = ors_route_data["path"]
            distance_km_ors = ors_route_data["distance_km"]
            duration_min_ors = ors_route_data["duration_min"]

            # Adjust ORS duration based on weather (simple factor)
            # This is a basic adjustment; real weather impact is more complex
            if weather == "Rainy":
                duration_min_adjusted = duration_min_ors * 1.3
            elif weather == "Stormy":
                duration_min_adjusted = duration_min_ors * 1.5
            else: # Sunny, Clear, Cloudy, etc.
                duration_min_adjusted = duration_min_ors
            duration_min_adjusted = round(duration_min_adjusted, 1)
            
            result_str = (
                f"Route Prediction (Openrouteservice):\n"
                f"------------------------------------\n"
                f"Source: ({lat_src:.5f}, {lon_src:.5f})\n"
                f"Destination: ({lat_dst:.5f}, {lon_dst:.5f})\n"
                f"Road Distance: {distance_km_ors} km\n"
                f"Est. Travel Time (ORS): {duration_min_ors} min\n"
                f"Weather Condition: {weather}\n"
                f"Adj. Travel Time (Weather): {duration_min_adjusted} min\n"
                f"------------------------------------\n"
            )
            self.result_text.insert(tk.END, result_str)
            self.btn_show_path.configure(state="normal")
            # Save route to history using ORS data
            save_route(self.username, self.source_coords, self.dest_coords, distance_km_ors, duration_min_adjusted, weather)
        else:
            # Fallback to Haversine if ORS fails
            haversine_dist_km = round(haversine(lat_src, lon_src, lat_dst, lon_dst), 2)
            dummy_time_min = round(dummy_time_predictor(haversine_dist_km, weather), 1)
            
            error_from_ors = ors_route_data.get("error", "Failed to fetch route from ORS.") if ors_route_data else "Failed to fetch route from ORS."
            result_str = (
                f"Route Prediction (Fallback - Straight Line):\n"
                f"-------------------------------------------\n"
                f"Source: ({lat_src:.5f}, {lon_src:.5f})\n"
                f"Destination: ({lat_dst:.5f}, {lon_dst:.5f})\n"
                f"Straight-Line Distance: {haversine_dist_km} km\n"
                f"Est. Travel Time: {dummy_time_min} minutes\n"
                f"Weather Condition: {weather}\n"
                f"-------------------------------------------\n"
                f"Routing Service Error: {error_from_ors}\n"
                f"Note: Displaying straight line path if available."
            )
            self.result_text.insert(tk.END, result_str)
            # Still allow showing straight line path if ORS failed but we have coords
            if self.source_coords and self.dest_coords:
                 self.current_ors_path_coordinates = [self.source_coords, self.dest_coords] # Fallback to straight line
                 self.btn_show_path.configure(state="normal")
            else:
                self.btn_show_path.configure(state="disabled")
            # Save fallback route to history
            save_route(self.username, self.source_coords, self.dest_coords, haversine_dist_km, dummy_time_min, weather)

        self.result_text.configure(state="disabled")
        self.notebook.select(self.results_tab)
        
        # Update history tab data (without necessarily switching to it)
        self.update_history_display_data()
        # If the history tab is already selected, this will refresh its content.
        # If another tab is selected, the data is ready for when it's next viewed.



    def show_path_on_map_tab(self):
        if not self.current_ors_path_coordinates and (not self.source_coords or not self.dest_coords) :
            messagebox.showinfo("Show Path", "Please predict a route or set source/destination points first.")
            self.btn_show_path.configure(state="disabled")
            return

        self.notebook.select(self.path_map_tab)

        if self.path_map_widget is None:
            self.path_map_widget = TkinterMapView(self.path_map_tab, corner_radius=0)
            self.path_map_widget.grid(row=0, column=0, sticky="nsew")
            self.path_map_widget.set_tile_server("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png")
            # Default view for path map (e.g., NYC)
            self.path_map_widget.set_position(self.lat, self.lon)
            self.path_map_widget.set_zoom(10)


        if self.path_line:
            self.path_line.delete()
            self.path_line = None
        self.path_map_widget.delete_all_marker()

        # Determine path to draw: ORS path or fallback straight line
        path_to_draw = []
        if self.current_ors_path_coordinates:
            path_to_draw = self.current_ors_path_coordinates
            # Add markers for start and end of ORS path
            if path_to_draw:
                self.path_map_widget.set_marker(path_to_draw[0][0], path_to_draw[0][1], text="Start")
                self.path_map_widget.set_marker(path_to_draw[-1][0], path_to_draw[-1][1], text="End")
        elif self.source_coords and self.dest_coords: # Fallback if no ORS path but S/D exist
            path_to_draw = [self.source_coords, self.dest_coords]
            self.path_map_widget.set_marker(self.source_coords[0], self.source_coords[1], text="Source")
            self.path_map_widget.set_marker(self.dest_coords[0], self.dest_coords[1], text="Destination")
        
        if path_to_draw:
            self.path_line = self.path_map_widget.set_path(path_to_draw, color="red", width=5)
            # Fit map to the path
            if self.path_line and self.path_line.position_list: # Check if path_line was successfully created
                 self.path_map_widget.fit_bounding_box(self.path_line.position_list)
            elif len(path_to_draw) >= 2 : # Fallback for direct list
                 self.path_map_widget.fit_bounding_box(path_to_draw)
        else:
            messagebox.showwarning("Show Path", "No path data available to display.")


    def show_history_tab(self): # Renamed, primary action is to switch to the tab
        self.notebook.select(self.history_tab)
        self.update_history_display_data() # Ensure data is current when tab is selected

    def update_history_display_data(self): # New helper method to only update data
        history = get_history(self.username)
        self.history_text.configure(state="normal")
        self.history_text.delete(1.0, tk.END)
        if not history:
            self.history_text.insert(tk.END, "No route history available.")
        else:
            history_str = "Your Route History:\n\n"
            for idx, (src, dst, dist, time_, weather) in enumerate(history, 1):
                # Format source and destination coordinates for better readability
                src_str = f"({src[0]:.4f}, {src[1]:.4f})" if isinstance(src, tuple) and len(src) == 2 else str(src)
                dst_str = f"({dst[0]:.4f}, {dst[1]:.4f})" if isinstance(dst, tuple) and len(dst) == 2 else str(dst)
                history_str += (f"{idx}. From {src_str} to {dst_str}\n"
                                f"    Distance: {dist} km, Time: {time_} min, Weather: {weather}\n\n")
            self.history_text.insert(tk.END, history_str)
        self.history_text.configure(state="disabled")

    def _on_closing(self):
        """Handles cleanup when the window is closed via the 'X' button."""
        if messagebox.askokcancel("Quit", "Do you want to quit SpeedyXpress?"):
            if self.map_widget:
                try:
                    self.map_widget.destroy()
                except Exception as e:
                    print(f"Error destroying main map_widget: {e}")
            if self.path_map_widget:
                try:
                    self.path_map_widget.destroy()
                except Exception as e:
                    print(f"Error destroying path_map_widget: {e}")
            self.root.destroy()

    def logout(self):
        confirm = messagebox.askyesno("Logout", "Are you sure you want to logout?")
        if confirm:
            # Explicitly destroy map widgets before destroying the root window
            if self.map_widget:
                try:
                    self.map_widget.destroy()
                except Exception as e:
                    print(f"Error destroying main map_widget during logout: {e}")
            if self.path_map_widget:
                try:
                    self.path_map_widget.destroy()
                except Exception as e:
                    print(f"Error destroying path_map_widget during logout: {e}")
            
            self.root.destroy()


def main_app(username):
    root = tk.Tk()
    app = RouteApp(root, username)
    root.mainloop()

if __name__ == "__main__":
    root = tk.Tk()
    LoginWindow(root)
    root.mainloop()
