import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const AIProcessing = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const store = useStore();

  return (
    <>
      
{/*  STITCH_SHADER_START:ANIMATION_9 className="fixed inset-0 w-full h-full"  */}
<div className="fixed inset-0 w-full h-full" >
<canvas id="shader-canvas-ANIMATION_9" ></canvas>

</div>
{/*  STITCH_SHADER_END:ANIMATION_9  */}

    </>
  );
};

export default AIProcessing;
