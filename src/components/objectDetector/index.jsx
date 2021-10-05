import React,{useRef,useState} from 'react';
import styled from "styled-components";

import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";


const ObjectDetectorContainer = styled.div`
height:100%;
display:flex;
flex-direction:column;
align-items:center;
`;

const DetectorContainer = styled.div`
min-width:200px;
height:700px;
border: 3px solid #fff;
border-radius:5px;
display:Flex;
align-items:center;
justify-content:center;
position:relative;
`;

const TargetImg = styled.img`
height:100%;
`;

const HiddenFileInput = styled.input`
display:none;
`;

const SelectButton = styled.button`
padding:7px 10px;
border: 2px solid transparent;
background-color: #fff;
color: #0a0f22;
font-size: 16px;
font-weight:500;
outline:none;
margin-top:2em;
cursor:pointer;
transition: all 260ms ease-in-out;
 
    &:hover {
        background-color:transparent;
        border: 2px solid #fff;
        color: #fff;
    }
`;






export function ObjectDetector(props){

    const fileInputRef = useRef(null);
    const [imgData, setImgData] = useState(null)

    const openFilePicker = () => {
        if (fileInputRef.current) fileInputRef.current.click();
      };

     const detectObjectOnImage = async (imageElement) => {
        const model = await cocoSsd.load({});
        const predictions = await model.detect(imageElement,6);
        console.log("Predictin",predictions);
     } 

    const readImage = (file) => {
        return new Promise((rs,rj)=> {
            const fileReader = new FileReader();
            fileReader.onload = () => rs(fileReader.result);
            fileReader.onerror = () => rj(fileReader.error);
            fileReader.readAsDataURL(file);

        })
    }  

    const onSelectImage = async (e) => {
        const file = e.target.files[0];
        const imgData = await readImage(file);
        setImgData(imgData);

        const imageElement = document.createElement("img");
        imageElement.src = imgData;

        imageElement.onload = async () => {
            await detectObjectOnImage(imageElement);
        }
    }  

    return (
        <ObjectDetectorContainer>
                <DetectorContainer>
                  {imgData && <TargetImg src={imgData} alt="resim"/> }  
                </DetectorContainer>
                <HiddenFileInput type="file" ref={fileInputRef} onChange={onSelectImage}/>
                <SelectButton onCLick={openFilePicker}> Select Image </SelectButton>
         </ObjectDetectorContainer>
         );

}