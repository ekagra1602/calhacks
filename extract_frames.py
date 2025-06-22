import cv2
import os
import numpy as np

def extract_frames(video_name, num_frames=100):
    # Create input and output paths
    video_path = f"videos/{video_name}.mp4"
    output_dir = f"data/{video_name}/images"
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Open video file
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        print(f"Error: Could not open video {video_path}")
        return
    
    # Get total number of frames in video
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if total_frames < num_frames:
        print(f"Warning: Video has only {total_frames} frames, extracting all of them")
        frame_indices = list(range(total_frames))
    else:
        # Calculate frame indices to extract uniformly
        frame_indices = np.linspace(0, total_frames - 1, num_frames, dtype=int)
    
    # Extract frames
    for i, frame_idx in enumerate(frame_indices):
        # Set video position to the desired frame
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        
        # Read the frame
        ret, frame = cap.read()
        
        if not ret:
            print(f"Error: Could not read frame {frame_idx}")
            continue
        
        # Generate output filename with zero-padded numbering
        output_filename = f"{i+1:06d}.png"
        output_path = os.path.join(output_dir, output_filename)
        
        # Save the frame
        cv2.imwrite(output_path, frame)
        
        print(f"Extracted frame {i+1}/{len(frame_indices)}: {output_filename}")
    
    # Release video capture
    cap.release()
    print(f"Successfully extracted {len(frame_indices)} frames to {output_dir}")

# Example usage
if __name__ == "__main__":
    video_name = input("Enter video name (without .mp4 extension): ")
    extract_frames(video_name)
