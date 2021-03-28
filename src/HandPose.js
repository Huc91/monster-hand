// React related imports
import React, { useEffect, useRef, useState } from 'react';

// Import of machine learning magical libraries 🤖🌟
import * as ml5 from 'ml5';
import * as fp from 'fingerpose';

// CSS
import './HandPose.css';

// Assets
import bite from './assets/bite.png';
import open from './assets/open.png';

function HandPose(props) {
  const [biting, setBiting] = useState(null);

  const video_w = 640,
    video_h = 480;

  const videoRef = useRef(null);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: video_w, height: video_h } })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error('error:', err);
      });
  };

  //custom gesture "bite a.k.a. crocodile"
  const crocodileGesture = new fp.GestureDescription('crocodile');
  crocodileGesture.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 1.0);
  crocodileGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.HalfCurl, 1.0);
  crocodileGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.HalfCurl, 1.0);
  crocodileGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 1.0);

  //initialize fingerpose "gesture estimator" to check only for the custom gesture
  const GE = new fp.GestureEstimator([crocodileGesture]);

  const handPosition = async (video) => {
    const handpose = await ml5.handpose(video);

    console.log('Model Ready!');
    props.sendLoading();

    handpose.on('predict', (results) => {
      const predictions = results[0];
      if (predictions) {
        const estimatedGestures = GE.estimate(predictions.landmarks, 7.5);
        setBiting(estimatedGestures.gestures.length);
      } else {
        setBiting(false);
      }
    });
  };

  useEffect(() => {
    getVideo();
    handPosition(videoRef.current);
    // eslint-disable-next-line
  }, [videoRef]);

  return (
    <div className="hand-pose">
      <video id="webcam-stream" ref={videoRef} />
      <div className="hand-pose__monster">
        <img
          className="monster__sprite"
          src={biting ? bite : open}
          alt="monster-sprite"
          style={{ display: props.isLoading ? 'none' : 'block' }}
        ></img>
      </div>
    </div>
  );
}

export default HandPose;
