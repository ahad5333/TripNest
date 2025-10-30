import React, { useRef, useEffect } from 'react';

interface CameraViewProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
  facingMode?: 'user' | 'environment';
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose, facingMode = 'environment' }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                let errorMessage = "Could not access the camera. Please ensure it's not in use by another app and that you have a working camera.";
                // Check if err is an instance of Error to safely access its properties.
                if (err instanceof Error) {
                    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                        errorMessage = "Camera access was denied. To use this feature, please go to your browser's settings and grant camera permissions for this site.";
                    } else if (err.name === 'NotFoundError') {
                        errorMessage = "No camera was found on your device. Please make sure a camera is connected and enabled.";
                    }
                }
                alert(errorMessage);
                onClose();
            }
        };
        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }
        };
    }, [onClose, facingMode]);

    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                if (facingMode === 'user') {
                    // Flip the image horizontally for user-facing camera to look like a mirror
                    ctx.translate(video.videoWidth, 0);
                    ctx.scale(-1, 1);
                }
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            }
            const imageDataUrl = canvas.toDataURL('image/jpeg');
            onCapture(imageDataUrl);
        }
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover" 
                style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
            ></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-around items-center bg-black/50">
                <button onClick={onClose} className="text-white text-lg font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
                <button onClick={handleCapture} className="w-20 h-20 bg-white rounded-full border-4 border-gray-400 active:bg-gray-300 transition-colors"></button>
                <div className="text-white text-lg font-semibold px-4 py-2 invisible">Cancel</div> {/* Placeholder for centering */}
            </div>
        </div>
    );
};

export default CameraView;