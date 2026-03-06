'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Activity, Zap } from 'lucide-react';
import {
  DrawingUtils,
  FilesetResolver,
  PoseLandmarker,
  type PoseLandmarkerResult,
} from '@mediapipe/tasks-vision';

const TASKS_VISION_VERSION = '0.10.32';
const WASM_ROOT = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`;
const MODEL_ASSET =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task';
const HIP_DEPTH_THRESHOLD = 0.68;
const HIP_RISE_THRESHOLD = 0.5;

export default function ActiveCombat() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const repState = useRef<'up' | 'down'>('up');
  const [repCount, setRepCount] = useState(0);
  const [powerPercent, setPowerPercent] = useState(86);
  const [status, setStatus] = useState('Initializing Pose Engine…');
  const [formCue, setFormCue] = useState('SNAP THE JAB!');

  useEffect(() => {
    let isMounted = true;
    let landmarker: PoseLandmarker | null = null;
    let animationFrame = 0;
    let stream: MediaStream | null = null;

    const renderPose = (results: PoseLandmarkerResult) => {
      if (!canvasRef.current) {
        return;
      }
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) {
        return;
      }
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      if (results.landmarks.length > 0) {
        const drawingUtils = new DrawingUtils(ctx);
        results.landmarks.forEach(landmarks => {
          drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
            color: '#7DF9FF',
            lineWidth: 4,
          });
          drawingUtils.drawLandmarks(landmarks, { color: '#FF2E63', radius: 4 });
        });
      }
    };

    const updateRepCount = (results: PoseLandmarkerResult) => {
      if (!results.landmarks.length) {
        return;
      }
      const landmarks = results.landmarks[0];
      if (!landmarks?.length) {
        return;
      }
      const leftHip = landmarks[23];
      const rightHip = landmarks[24];
      if (!leftHip || !rightHip) {
        return;
      }
      const hipY = (leftHip.y + rightHip.y) / 2;
      if (hipY > HIP_DEPTH_THRESHOLD && repState.current === 'up') {
        repState.current = 'down';
        setFormCue('DROP THOSE HIPS!');
      }
      if (hipY < HIP_RISE_THRESHOLD && repState.current === 'down') {
        repState.current = 'up';
        setRepCount(prev => prev + 1);
        setPowerPercent(prev => Math.min(100, prev + 1));
        setFormCue('DRIVE UP!');
      }
    };

    const initPose = async () => {
      if (!videoRef.current || !canvasRef.current) {
        return;
      }
      try {
        setStatus('Loading MediaPipe Pose…');
        const vision = await FilesetResolver.forVisionTasks(WASM_ROOT);
        landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_ASSET,
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        });

        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false,
        });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus('Tracking Combat Form');

        const renderLoop = () => {
          if (!isMounted || !videoRef.current || !landmarker || !canvasRef.current) {
            return;
          }
          const { videoWidth, videoHeight } = videoRef.current;
          if (videoWidth && videoHeight) {
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;
          }
          const results = landmarker.detectForVideo(videoRef.current, performance.now());
          renderPose(results);
          updateRepCount(results);
          animationFrame = requestAnimationFrame(renderLoop);
        };
        animationFrame = requestAnimationFrame(renderLoop);
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setStatus('Camera unavailable — check permissions.');
        }
      }
    };

    initPose();

    return () => {
      isMounted = false;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      landmarker?.close();
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
      <div className="relative w-full aspect-[4/3] bg-black border-4 border-black shadow-brutal overflow-hidden">
        <video ref={videoRef} className="hidden" playsInline />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        <div className="absolute top-4 left-4 bg-[#FF2E63] text-white border-4 border-black px-4 py-2 font-black uppercase shadow-brutal">
          ACTIVE COMBAT
        </div>
        <div className="absolute top-4 right-4 bg-[#7DF9FF] text-black border-4 border-black px-4 py-2 font-black uppercase shadow-brutal">
          {status}
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white border-4 border-black px-6 py-2 font-black uppercase shadow-brutal">
          {formCue}
        </div>
      </div>

      <aside className="flex flex-col gap-6">
        <div className="bg-[#7DF9FF] border-4 border-black p-6 shadow-brutal">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-black uppercase">REP COUNT</h2>
            <Activity className="w-8 h-8" />
          </div>
          <div className="text-7xl font-black tracking-tighter">{repCount}</div>
          <p className="mt-4 text-sm font-black uppercase border-t-4 border-black pt-2">
            TARGET: 15
          </p>
        </div>

        <div className="bg-black text-white border-4 border-black p-6 shadow-brutal">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-black uppercase">POWER %</h2>
            <Zap className="w-8 h-8 text-[#7DF9FF]" />
          </div>
          <div className="text-6xl font-black tracking-tighter text-[#7DF9FF]">
            {powerPercent}%
          </div>
          <p className="mt-4 text-sm font-black uppercase border-t-4 border-zinc-800 pt-2 text-zinc-400">
            PEAK: 96%
          </p>
        </div>
      </aside>
    </div>
  );
}
