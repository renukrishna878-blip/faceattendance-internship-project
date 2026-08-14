import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const UploadClassroomPhoto = () => {
  const navigate = useNavigate();
  const setAttendanceSession = useStore((state) => state.setAttendanceSession);

  useEffect(() => {
    let progressValue = 0;
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    const steps = [
      { duration: 800, icon: 'icon-1', label: 'step-1' },
      { duration: 600, icon: 'icon-2', label: 'step-2' },
      { duration: 600, icon: 'icon-3', label: 'step-3' },
    ];

    let currentStep = 0;
    let elapsed = 0;

    const processStep = () => {
      if (currentStep >= steps.length) {
        if (progressValue < 100) {
          progressValue += 10;
          if (progressValue > 100) progressValue = 100;
          if (progressBar) progressBar.style.width = `${progressValue}%`;
          if (progressText) progressText.textContent = `${Math.floor(progressValue)}% Completed`;
          setTimeout(processStep, 100);
        } else {
          setAttendanceSession({
            detectedFaces: 4,
            recognizedStudents: 3,
            absentStudents: 1,
            attendanceStatus: {
              '2023CS01': 'Present',
              '2023CS14': 'Present',
              '2023EE08': 'Absent',
              '2023BA22': 'Present',
            },
            editedStudents: [],
          });
          navigate('/attendance/result');
        }
        return;
      }

      const step = steps[currentStep];
      elapsed += step.duration;
      progressValue = Math.min(95, (elapsed / 2000) * 95);

      if (progressBar) progressBar.style.width = `${progressValue}%`;
      if (progressText) progressText.textContent = `${Math.floor(progressValue)}% Completed`;

      const iconEl = document.getElementById(step.icon);
      const stepEl = document.getElementById(step.label);
      if (iconEl) {
        iconEl.textContent = 'check_circle';
        iconEl.classList.remove('animate-spin');
        iconEl.classList.add('text-success');
      }
      if (stepEl) {
        stepEl.classList.remove('bg-surface-container-low');
        stepEl.classList.add('bg-success-container');
      }

      currentStep++;
      setTimeout(processStep, step.duration);
    };

    const timer = setTimeout(processStep, 500);
    return () => clearTimeout(timer);
  }, [navigate, setAttendanceSession]);

  return (
    <>
      
{/*  Background Shader  */}
{/*  STITCH_SHADER_START:ANIMATION_9 className="absolute inset-0 w-full h-full z-0"  */}
<div className="absolute inset-0 w-full h-full z-0" >
<canvas id="shader-canvas-ANIMATION_9" ></canvas>

</div>
{/*  STITCH_SHADER_END:ANIMATION_9  */}
{/*  Main Content Shell  */}
<main className="relative z-10 flex-1 flex items-center justify-center p-gutter">
<div className="max-w-md w-full glass-panel rounded-xl shadow-xl overflow-hidden relative p-xl border border-white/50">
{/*  Scanline Effect  */}
<div className="scan-line"></div>
{/*  Header Section  */}
<div className="text-center mb-xl">
<div className="inline-flex items-center justify-center p-md bg-primary-container rounded-full mb-lg shadow-lg">
<span className="material-symbols-outlined text-on-primary-container text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        camera_enhance
                    </span>
</div>
<h1 className="font-headline-md text-headline-md text-primary mb-xs">Processing Attendance</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Please wait while our AI processes the image</p>
</div>
{/*  Sequential Steps List  */}
<div className="space-y-md">
<div className="step-entry flex items-center gap-lg p-md rounded-lg bg-surface-container-low border border-outline-variant/30" id="step-1">
<div className="status-icon w-8 h-8 flex items-center justify-center">
<span className="material-symbols-outlined text-primary animate-spin" id="icon-1">sync</span>
</div>
<span className="font-title-lg text-title-lg text-on-surface">Detecting Faces...</span>
</div>
<div className="step-entry flex items-center gap-lg p-md rounded-lg bg-surface-container-low border border-outline-variant/30" id="step-2">
<div className="status-icon w-8 h-8 flex items-center justify-center">
<span className="material-symbols-outlined text-outline-variant" id="icon-2">pending</span>
</div>
<span className="font-title-lg text-title-lg text-on-surface-variant">Recognizing Students...</span>
</div>
<div className="step-entry flex items-center gap-lg p-md rounded-lg bg-surface-container-low border border-outline-variant/30" id="step-3">
<div className="status-icon w-8 h-8 flex items-center justify-center">
<span className="material-symbols-outlined text-outline-variant" id="icon-3">pending</span>
</div>
<span className="font-title-lg text-title-lg text-on-surface-variant">Marking Attendance...</span>
</div>
</div>
{/*  Visualization/Footer Meta  */}
<div className="mt-xl flex flex-col items-center">
<div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mb-sm">
<div className="h-full bg-primary w-0 transition-all duration-500 ease-out" id="progress-bar"></div>
</div>
<div className="flex justify-between w-full text-label-md font-label-md text-on-secondary-container uppercase tracking-wider">
<span>Engine v4.2</span>
<span id="progress-text">0% Completed</span>
</div>
</div>
</div>
</main>
{/*  Overlay Visualizer (Abstract)  */}
<div className="fixed top-gutter right-gutter z-20 pointer-events-none hidden md:block">
<div className="glass-panel p-md rounded-lg flex flex-col items-end">
<span className="font-label-md text-label-md text-primary font-bold">LIVE TELEMETRY</span>
<div className="flex gap-1 mt-2 h-12 items-end">
<div className="w-1 bg-primary/40 h-8 animate-[pulse_1s_infinite_100ms]"></div>
<div className="w-1 bg-primary/40 h-10 animate-[pulse_1.2s_infinite_200ms]"></div>
<div className="w-1 bg-primary/40 h-6 animate-[pulse_0.8s_infinite_300ms]"></div>
<div className="w-1 bg-primary/40 h-12 animate-[pulse_1.5s_infinite_400ms]"></div>
<div className="w-1 bg-primary/40 h-7 animate-[pulse_1.1s_infinite_500ms]"></div>
</div>
</div>
</div>


    </>
  );
};

export default UploadClassroomPhoto;
