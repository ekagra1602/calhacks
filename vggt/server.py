import os
import tempfile
from flask import Flask, request, send_file, jsonify
from gradio_client import Client, handle_file

# This should be the URL of your Gradio app.
# The original client.py used this public URL.
# If running the Gradio app locally, you might need to change this
# to something like "http://127.0.0.1:7860/"
GRADIO_APP_URL = "https://4e02117f65e4392453.gradio.live"

app = Flask(__name__)

def video2glb(video_path: str) -> str:
    """
    Takes a video file path, sends it to a Gradio API for processing,
    and returns the local path to the resulting .glb file.

    Args:
        video_path: The local path to the video file.

    Returns:
        The local path of the .glb file.
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found at: {video_path}")

    client = Client(GRADIO_APP_URL)

    print("Step 1/2: Uploading video and preparing for processing...")
    result_upload = client.predict(
        input_video={"video": handle_file(video_path)},
        input_images=None,
        api_name="/update_gallery_on_upload"
    )
    target_dir = result_upload[1]
    if not target_dir:
        raise Exception("Failed to get target directory from Gradio app after upload.")
    print(f"Video processed into target directory: {target_dir}")

    print("Step 2/2: Running 3D reconstruction...")
    result_recon = client.predict(
        target_dir=target_dir,
        conf_thres=30,
        frame_filter="All",
        mask_black_bg=False,
        mask_white_bg=False,
        show_cam=False,
        mask_sky=True,
        prediction_mode="Depthmap and Camera Branch",
        api_name="/gradio_demo"
    )

    glb_file_path = result_recon[0]
    if not glb_file_path:
        raise Exception("Reconstruction failed, no GLB file path returned.")
        
    print(f"Reconstruction complete. GLB file is at: {glb_file_path}")

    return glb_file_path

@app.route('/video2glb', methods=['POST'])
def video2glb_endpoint():
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video_file = request.files['video']
    
    if video_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if video_file:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp_video:
            video_file.save(tmp_video.name)
            tmp_video_path = tmp_video.name

        try:
            glb_path = video2glb(tmp_video_path)
            
            # The gradio_client downloads the file and provides a local path.
            # We send this file back to the client.
            return send_file(
                glb_path,
                mimetype='model/gltf-binary',
                as_attachment=True,
                download_name='output.glb'
            )
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            # Clean up the temporary video file
            os.remove(tmp_video_path)
            # The GLB file from gradio is also temporary and should be cleaned up if possible,
            # but its path is in a temp directory managed by gradio_client, 
            # so we might not need to manually delete it. If it causes issues, we can add:
            # if 'glb_path' in locals() and os.path.exists(glb_path):
            #     os.remove(glb_path)


if __name__ == '__main__':
    # Runs the Flask app on 0.0.0.0 (accessible from the network)
    # and port 5001 to avoid conflicts with other common ports.
    app.run(host='0.0.0.0', port=5001, debug=True)
