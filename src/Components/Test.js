import React, { useState, useEffect, useRef } from "react";
import "./Test.css";
import { questions } from "./Questions";
import * as faceapi from "face-api.js";

export default function Test() {
  const videoHeight=150;
  const videoWidth=300;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const canvasRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    const loadmodels = async () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]).then(startVideo());
    };
    loadmodels();
  }, []);
  const startVideo = () => {
    console.log("oombu");
    var constraints = { audio: false, video: { width: videoWidth, height: videoHeight } };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (mediaStream) {
        var video = document.getElementsByClassName("video-feed")[0];
        video.srcObject = mediaStream;
        video.onloadedmetadata = function (e) {
          video.play();
        };
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  };

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
        videoRef.current
      );
      const displaySize = {
        width: videoWidth,
        height: videoHeight,
      };
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        // .withFaceLandmarks()
        // .withFaceExpressions()
        detections.map((detection)=>{
            detection._score=0;
        })
      const reSizedDetections=faceapi.resizeResults(detections,displaySize)
      canvasRef.current.getContext('2d').clearRect(0,0,videoWidth,videoHeight)
      faceapi.draw.drawDetections(canvasRef.current,detections)
      
      //  console.log(detections);
    }, 100);
  };
  return (
    <div className="camfac">
      <div className="video-container">
        <video
          className="video-feed"
          ref={videoRef}
          onPlay={handleVideoOnPlay}
          muted={true}
          autoPlay
        />
        <canvas className="canvas" ref={canvasRef} />
      </div>
      <div className="body">
        <div className="test">
          {showScore ? (
            <div className="score-section">
              You scored {score} out of {questions.length}
            </div>
          ) : (
            <>
              <div className="question-section">
                <div className="question-count">
                  <span className="testhead">
                    Question {currentQuestion + 1}
                  </span>
                  /{questions.length}
                </div>
                <div className="question-text">
                  {questions[currentQuestion].questionText}
                </div>
              </div>
              <div className="answer-section">
                {questions[currentQuestion].answerOptions.map(
                  (answerOption) => (
                    <button
                      onClick={() =>
                        handleAnswerOptionClick(answerOption.isCorrect)
                      }
                    >
                      {answerOption.answerText}
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
