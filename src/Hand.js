import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

// Import of machine learning magic
import * as ml5 from 'ml5';
import * as fp from "fingerpose";


import './Hand.css';

import bite from './bite.png';
import open from './open.png';


function Hand(){

  let hands = [];
  let top = 0;
  let left = 0;
  const w = 640,
    h = 480;


  const videoRef = useRef(null);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: w, height: h } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  };

  function rectangle(top, left, biting) {
    const element = (
      <div className="monster" style={{top: 0, left: 0}}>
        <img src={biting ? bite : open } alt="monster-sprite"></img>
      </div>
    );
    ReactDOM.render(element, document.getElementById('hand'));
  }

  const crocodileGesture = new fp.GestureDescription('crocodile');
  crocodileGesture.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 1.0);
  crocodileGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.HalfCurl, 1.0);
  crocodileGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.HalfCurl, 1.0);
  crocodileGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 1.0);

  const GE = new fp.GestureEstimator([
    crocodileGesture
  ])

  const handPosition = (video) => {

    const handpose = ml5.handpose(video, modelReady);

    function modelReady() {
      console.log('Model Ready!');
    }



    handpose.on('predict', (results, err) => {
        hands = results[0];
        top = hands?.boundingBox?.topLeft ? hands.boundingBox.topLeft[1] + h/2 : h/2;
        left = hands?.boundingBox?.topLeft ? hands.boundingBox.topLeft[0] + w/2 : w/2;
        if(hands) {
          const estimatedGestures = GE.estimate(hands.landmarks, 7.5);
          console.log('gesture-->', estimatedGestures);
          rectangle(top, left, estimatedGestures.gestures.length);
        } else {
          rectangle(top, left);
        }

    });

  }

  useEffect(() => {
    getVideo();
    handPosition(videoRef.current);


  }, [videoRef]);




  return (
    <div>
      <video ref={videoRef}/>
      <div id="hand"></div>
    </div>
  )


}

export default Hand
