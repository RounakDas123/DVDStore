import React,{ forwardRef, useImperativeHandle, useRef,useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';

import {movieDetailsActions} from '../../store/index';
import classes from './Home.module.css';


const DetailsModal = forwardRef(({movieid,type,modalType}, ref) => {
const dialog = useRef();
const iframeRef = useRef();

useImperativeHandle(ref, ()=>{
  return {
    open()
    {
      if (dialog.current) {
        dialog.current.showModal();
      } else {
        console.error("Dialog element is not yet attached to the DOM.");
      }
    }  
  }
});

const [details, setDetails]= useState({});
const [loader, setLoader]=  useState(true);


  const getDetails = ()=>{
    fetch(`https://api.themoviedb.org/3/${type}/${movieid}?append_to_response=videos&api_key=d987bb3825166942aa314c4768160995`)
    .then(res => res.json())
    .then(json => setDetails(json));
    setLoader(false);
  }

  // const getVideo = ()=>{
  //   fetch(`https://api.themoviedb.org/3/${type}/${movieid}/videos?language=en-US&api_key=d987bb3825166942aa314c4768160995`)  
  //   .then(res => res.json())
  //   .then(json => setVideo((json.results).filter(data => (data.type === 'Trailer') )[0] ));
  // }

    useEffect(()=>{
      if(movieid && type)
      {
        getDetails();
        // getVideo();
      }
              
    },[movieid, type]);

    var genreNames = '';
    var video = {};
    if(Object.keys(details).length > 0 &&  Object.keys(details.genres).length > 0 
    && Object.keys(details.videos).length > 0 && Object.keys(details.videos.results).length > 0 )
    {
      var genres = details.genres;
      genreNames = genres.map(genre => genre.name).join(', ');
      video = (details.videos.results).filter(data => (data.type === 'Trailer' && data.site==='YouTube') )[0] ;
    }

    console.log(details);
    console.log(video);
    
    

const dispatch = useDispatch();
const closeModal = (event)=>{
    dispatch(movieDetailsActions.closeModal(modalType));
    //Pause the YouTube video
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      )
    }

    // document.getElementById("modal").innerHTML = "";
  };
 

  return createPortal(
    <dialog ref={dialog} className={classes.infoModal}>
      {(loader && movieid && type) ? (<img src="./loader.svg" style={{width:"370", height:"290"}} />) :
        (<>
          {(video && Object.keys(video).length > 0 ) ? (<div style={{width:"100%", display:"flex", justifyContent:"center"}}>           
            <iframe ref={iframeRef} width="370" height="290" style={{paddingBottom:"30px"}}
            src={`https://www.youtube.com/embed/${video.key}?enablejsapi=1`} 
            title={video.name} frameBorder="0" 
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen 
             ></iframe>
           </div>) : (<div style={{width:"100%", display:"flex", justifyContent:"center"}}>
            <img src="./this-video-is-unavailable.jpg" style={{width:"370", height:"290",paddingBottom:"30px"}} /></div> )}

        <h2> {details["original_title"]} </h2>
        <h4>Overview</h4>
        <p>{details.overview}</p>
        <h4>Genre(s)</h4>
        <p>{genreNames}</p>
        
        <form method="dialog">
            <button onClick={closeModal}>Close</button>
        </form>
        </> )}
    </dialog>,
    document.getElementById('modal')
  );
});

export default DetailsModal;