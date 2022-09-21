import React, { useState, useEffect, useRef } from "react";
import "./Test.css";
import { questions } from "./Questions";
import * as faceapi from "face-api.js";
import { useHistory } from "react-router-dom";
import { usePageVisibility } from "react-page-visibility";

export default function Test({ rollNo }) {
  const isVisible = usePageVisibility();
  const history = useHistory();
  const videoWidth = 300;
  const videoHeight = 150;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const canvasRef = useRef();
  const videoRef = useRef();
  let warningCount = 0;

  if (!isVisible) {
    //Detecting switching tabs
    alert("Switching tabs is not allowed ! ");
    warningCount++;
    if (warningCount > 3) {
      alert(
        "Due to the exploitation of warnings ,You are not allowed to continue the test!"
      );
      history.push("/");
    }
  }

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
    var constraints = {
      audio: false,
      video: { width: videoWidth, height: videoHeight },
    };
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
    let count = 0;
    setInterval(async () => {
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
        videoRef.current
      );
      const displaySize = {
        width: videoWidth,
        height: videoHeight,
      };
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );
      // .withFaceLandmarks()
      // .withFaceExpressions()
      detections.forEach((detection) => {
        detection._score = 0;
      });
      const reSizedDetections = faceapi.resizeResults(detections, displaySize);
      canvasRef.current
        .getContext("2d")
        .clearRect(0, 0, videoWidth, videoHeight);
      faceapi.draw.drawDetections(canvasRef.current, reSizedDetections);
      if (detections.length === 0) {
        count++;
      } else if (detections.length > 1) {
        alert(
          "You are not allowed to continue the exam since multiple faces detected !"
        );
        history.push("/");
      }
      if (count > 70) {
        alert(
          "Your face is not recognized or detection of illegal movements !"
        );
        count = 0;
        warningCount++;
      }
      if (warningCount > 3) {
        alert(
          "Due to the exploitation of warnings ,You are not allowed to continue the test!"
        );
        history.push("/");
      }
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
                <span className="testhead">{rollNo}</span>
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
