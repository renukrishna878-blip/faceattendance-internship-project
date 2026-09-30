import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const AIProcessing = () => {
  const navigate = useNavigate();
  const selectedClass = useStore((state) => state.selectedClass) || {};
  const [progress, setProgress] = useState(15);
  const [currentStage, setCurrentStage] = useState('Detecting faces in classroom image...');
  const [telemetry, setTelemetry] = useState({
    facesDetected: 0,
    embeddingsExtracted: 0,
    confidenceAvg: '0%'
  });

  const stages = [
    { at: 20, stage: 'Locating human faces with RetinaFace detector...', faces: 12, emb: 0, conf: '94.2%' },
    { at: 45, stage: 'Aligning facial landmarks & eyes coordinates...', faces: 28, emb: 14, conf: '96.8%' },
    { at: 75, stage: 'Generating 512-D ArcFace facial feature vectors...', faces: 28, emb: 28, conf: '98.5%' },
    { at: 92, stage: 'Comparing with student database embeddings...', faces: 28, emb: 28, conf: '99.1%' },
    { at: 100, stage: 'Attendance verification compiled successfully!', faces: 28, emb: 28, conf: '99.4%' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            navigate('/attendance/result');
          }, 600);
          return 100;
        }
        const nextVal = prev + 5;
        const matchingStage = stages.find(s => nextVal >= s.at && prev < s.at);
        if (matchingStage) {
          setCurrentStage(matchingStage.stage);
          setTelemetry({
            facesDetected: matchingStage.faces,
            embeddingsExtracted: matchingStage.emb,
            confidenceAvg: matchingStage.conf
          });
        }
        return nextVal;
      });
    }, 110);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Matrix/Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center relative z-10">
        
        {/* Holographic Scanner Reticle */}
        <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
          {/* Outer Pulsing Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/40 animate-[spin_8s_linear_infinite]"></div>
          
          {/* Middle Rotating Scanner */}
          <div className="absolute inset-2 rounded-full border-2 border-cyan-400/60 border-t-transparent animate-[spin_3s_linear_infinite]"></div>
          
          {/* Inner Glow Core */}
          <div className="w-24 h-24 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-400/30">
            <span className="material-symbols-outlined text-4xl text-cyan-400 animate-pulse">
              face
            </span>
          </div>

          {/* Scanner Line Sweep */}
          <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[bounce_2s_ease-in-out_infinite]"></div>
        </div>

        {/* Status Header */}
        <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-3 py-1 rounded-full mb-3">
          DeepFace Neural Engine
        </span>
        <h2 className="text-xl font-bold text-slate-100 mb-1">
          Analyzing Classroom
        </h2>
        <p className="text-xs text-slate-400 min-h-[32px] px-2 leading-relaxed">
          {currentStage}
        </p>

        {/* Progress Bar Container */}
        <div className="w-full mt-6 mb-2">
          <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>Scan Progress</span>
            <span className="text-cyan-400 font-mono">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(6,182,212,0.5)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Real-time Telemetry Grid */}
        <div className="grid grid-cols-3 gap-2 w-full mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
            <p className="text-[10px] text-slate-500 font-medium uppercase">Faces Found</p>
            <p className="text-base font-bold text-cyan-300 font-mono mt-0.5">{telemetry.facesDetected}</p>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
            <p className="text-[10px] text-slate-500 font-medium uppercase">Embeddings</p>
            <p className="text-base font-bold text-indigo-300 font-mono mt-0.5">{telemetry.embeddingsExtracted}</p>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
            <p className="text-[10px] text-slate-500 font-medium uppercase">Accuracy</p>
            <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">{telemetry.confidenceAvg}</p>
          </div>
        </div>

        {/* Manual Skip Fallback */}
        <button 
          onClick={() => navigate('/attendance/result')}
          className="mt-6 text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4 cursor-pointer transition-colors"
        >
          Skip animation &amp; view results &rarr;
        </button>
      </div>
    </div>
  );
};

export default AIProcessing;
