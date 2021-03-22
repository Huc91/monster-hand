import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

// Import of machine learning magic
import * as ml5 from 'ml5';
import * as fp from 'fingerpose';

import './Hand.css';

import bite from './bite.png';
import open from './open.png';

function HandPose(props) {

  let predictions = [];
  const w = 640,
  h = 480;

  const videoRef = useRef(null);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: w, height: h } })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error('error:', err);
      });
  };

  function addCrocodile(biting) {
    const element = (
      <div className="monster">
        <img src={biting ? bite : open} alt="monster-sprite"></img>
      </div>
    );
    ReactDOM.render(element, document.getElementById('hand'));
  }

  const crocodileGesture = new fp.GestureDescription('crocodile');
  crocodileGesture.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 1.0);
  crocodileGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.HalfCurl, 1.0);
  crocodileGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.HalfCurl, 1.0);
  crocodileGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 1.0);

  const GE = new fp.GestureEstimator([crocodileGesture]);

  const handPosition = (video) => {
    const handpose = ml5.handpose(video, modelReady);

    function modelReady() {
      console.log('Model Ready!');
      props.sendLoading();
    }

    handpose.on('predict', (results, err) => {
      predictions = results[0];
      if (predictions) {
        const estimatedGestures = GE.estimate(predictions.landmarks, 7.5);
        console.log('gesture-->', estimatedGestures);
        addCrocodile(estimatedGestures.gestures.length);
      } else {
        addCrocodile();
      }
    });
  };

  useEffect(() => {
    getVideo();
    handPosition(videoRef.current);
  }, [videoRef]);

  return (
    <div>
      <video id="webcam-strem" ref={videoRef} />
      <div id="hand"></div>
    </div>
  );
}

export default HandPose;
