import { useState, useRef } from "react";
import AnonLog from "./AnonLog";
import AWS from 'aws-sdk';
import 'bootstrap/dist/css/bootstrap.min.css';
import CardT from "./Card";
import React from "react";
import Accordion from 'react-bootstrap/Accordion';
import CSS from 'csstype';
import Spinner from 'react-bootstrap/Spinner';

function Input() {
  const [image, setImage] = useState<string>()
  const [data, setData] = useState<any>()
  const spinnerRef = useRef<any>();
  const rigthRef = useRef<any>();

  const display = (ref: any) => {
    ref.current.style.display = "block";
  }

  const noDisplay = () => {
    spinnerRef.current.style.display = "none";
  }

  const DetectFaces = (imageData: ArrayBuffer) => {
    var rekognition = new AWS.Rekognition();
    var params = {
      Image: {
        Bytes: imageData
      },
      Attributes: [
        'ALL',
      ]
    };
    display(spinnerRef);
    rekognition.detectFaces(params, function (err, data: any) {
      if (err) {
        noDisplay()
        console.log(err, err.stack)
      }
      else {
        display(rigthRef)
        noDisplay()
        console.log(data.FaceDetails)
        setData(data.FaceDetails[0])
      }
    });
  }

  const ProcessImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImage(URL.createObjectURL(event.target.files![0]));
    const file = event.target.files![0];
    AnonLog();

    var reader = new FileReader();
    reader.onload = (function (theFile) {
      return function (e: any) {
        var image: any = null;
        var jpg = true;
        try {
          image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);

        } catch (e) {
          jpg = false;
        }
        if (jpg === false) {
          try {
            image = atob(e.target.result.split("data:image/png;base64,")[1]);
          } catch (e) {
            alert("Not an image file Rekognition can process");
            return;
          }
        }

        var length = image.length;
        var imageBytes = new ArrayBuffer(length);
        var ua = new Uint8Array(imageBytes);
        for (var i = 0; i < length; i++) {
          ua[i] = image.charCodeAt(i);
        }
        DetectFaces(imageBytes);
      };
    })(file);
    reader.readAsDataURL(file);
  }

  const BoudingBox: CSS.Properties = {
    position: 'absolute',
    left: data?.BoundingBox?.Left * 400 + "px",
    top: data?.BoundingBox?.Top * 400 + "px",
    width: data?.BoundingBox?.Width * 400 + "px",
    height: data?.BoundingBox?.Height * 400 + "px",
    border: "3px solid blue"
  };

  const spinnerDisplay: CSS.Properties = {
    display: 'none'
  }

  interface Emotions {
    Type: string
    Confidence: any
  }

  interface Landmarks {
    Type: string
    X: any
    Y: any
  }

  return (
    <>
      <div className="Header">
        <div className="titre">
          <h2>Face Detector</h2>
        </div>
        <div className="spinner">
          <Spinner ref={spinnerRef} style={spinnerDisplay} animation="border" variant="warning" />;
        </div>
      </div>
      <div className="Container">
        <div className="leftContainer">
          <div className="inputFile">
            <label className="fileToUpload" htmlFor='fileToUpload' title='Upload Image'>
              <input className='inputfile' type="file" name="fileToUpload" id="fileToUpload" accept="image/*" onChange={ProcessImage} />Upload<i className="bi bi-upload ms-3"></i>
            </label>
            <div className="Image">
              <div style={BoudingBox} className="imagebox"></div>
              <img src={image} alt="" />
            </div>
          </div>
        </div>

        <div className="rightContainer" ref={rigthRef}>
          <Accordion>
            <Accordion.Item eventKey="0" className="accordion col-12">
              <Accordion.Header>Propriétés</Accordion.Header>
              <Accordion.Body>
                <CardT Header="AgeRange" Text1={data?.AgeRange?.Low} Text2={data?.AgeRange?.High} />
                <CardT Header="Beard" Text1={data?.Beard?.Value?.toString()} Text2={data?.Beard?.Confidence} />
                <CardT Header="EyeGlasses" Text1={data?.Eyeglasses?.Value?.toString()} Text2={data?.Eyeglasses?.Confidence} />
                <CardT Header="EyesOpen" Text1={data?.EyesOpen?.Value?.toString()} Text2={data?.EyesOpen?.Confidence} />
                <CardT Header="Gender" Text1={data?.Gender?.Value} Text2={data?.Gender?.Confidence} />
                <CardT Header="MouthOpen" Text1={data?.MouthOpen?.Value?.toString()} Text2={data?.MouthOpen?.Confidence} />
                <CardT Header="Mustache" Text1={data?.Mustache?.Value?.toString()} Text2={data?.Mustache?.Confidence} />
                <CardT Header="Smile" Text1={data?.Smile?.Value?.toString()} Text2={data?.Smile?.Confidence} />
                <CardT Header="Quality" Text1={data?.Quality?.Brightness} Text2={data?.Quality?.Sharpness} />
                <CardT Header="Sunglasses" Text1={data?.Sunglasses?.Value?.toString()} Text2={data?.Sunglasses?.Confidence} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Accordion>
            <Accordion.Item eventKey="0" className="emotion col-12">
              <Accordion.Header>Emotions</Accordion.Header>
              <Accordion.Body>
                {data?.Emotions?.map((e: Emotions, k: number) => (
                  <div className="emotionData">
                    <h4>{e.Type}</h4>
                    <p>{e.Confidence}</p>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Accordion>
            <Accordion.Item eventKey="0" className="emotion col-12">
              <Accordion.Header>Landmarks</Accordion.Header>
              <Accordion.Body>
                {data?.Landmarks?.map((e: Landmarks, k: number) => (
                  <div className="emotionData">
                    <h4>{e.Type}</h4>
                    <p>{e.X}</p>
                    <p>{e.Y}</p>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </>
  );
}

export default Input;