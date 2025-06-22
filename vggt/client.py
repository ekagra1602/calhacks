import requests
import os
import time

# The server URL
# Assumes the server.py is running on localhost with port 5001
SERVER_URL = "http://127.0.0.1:5001/video2glb"

# Path to the video file to be sent
# This assumes the script is run from the root of the workspace
VIDEO_PATH = "../videos/fountain.mp4"

# Path to save the downloaded .glb file
OUTPUT_PATH = "vggt/scene.glb"

def wait_for_server(url, timeout=60):
    """Waits for the server to be ready."""
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            requests.get(url.replace('/video2glb', '/'), timeout=1)
            return True
        except requests.ConnectionError:
            time.sleep(1)
    return False

def main():
    """
    Makes a request to the video2glb server with a sample video
    and saves the resulting .glb file.
    """
    if not os.path.exists(VIDEO_PATH):
        print(f"Error: Video file not found at {VIDEO_PATH}")
        print("Please ensure you are running this script from the root of the workspace.")
        return

    print("Waiting for server to be ready...")
    if not wait_for_server(SERVER_URL):
        print("Server did not become ready in time. Please ensure the server is running.")
        return

    print(f"Sending video file '{VIDEO_PATH}' to the server at {SERVER_URL}...")
    print("This may take a few minutes depending on the video length and server performance.")

    try:
        with open(VIDEO_PATH, 'rb') as video_file:
            files = {'video': (os.path.basename(VIDEO_PATH), video_file, 'video/mp4')}
            # Using a long timeout as the 3D reconstruction can be slow.
            response = requests.post(SERVER_URL, files=files, timeout=600)

        response.raise_for_status()  # Raise an exception for bad status codes

        print("Successfully received response from server.")

        with open(OUTPUT_PATH, 'wb') as output_file:
            output_file.write(response.content)

        print(f"Successfully saved the .glb file to {OUTPUT_PATH}")
        print(f"File size: {os.path.getsize(OUTPUT_PATH) / 1024 / 1024:.2f} MB")


    except requests.exceptions.Timeout:
        print("The request timed out. The server is likely still processing.")
        print("Try increasing the timeout in the script.")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while communicating with the server: {e}")
        # The server might return a JSON error message with more details.
        try:
            error_details = e.response.json()
            print("Server error details:", error_details.get("error"))
        except (ValueError, AttributeError):
            # Not a JSON response or no response object
            if e.response:
                print("Server response:", e.response.text)


if __name__ == "__main__":
    main()
