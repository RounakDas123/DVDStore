import React,{ forwardRef, useImperativeHandle, useRef,useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';

import {movieDetailsActions} from '../../store/index';
import classes from './Home.module.css';


const DetailsModal = forwardRef(({movieid,type}, ref) => {
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
    },
    close()
    {
      if (dialog.current) dialog.current.close();
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


    useEffect(()=>{
      if(movieid && type)
      {
        getDetails();
      }
              
    },[movieid, type]);

    var genreNames = '';
    var video = {};
    if(Object.keys(details).length > 0 &&  Object.keys(details.genres).length > 0 
    && Object.keys(details.videos).length > 0 && Object.keys(details.videos.results).length > 0 )
    {
      var genres = details.genres;
      genreNames = genres.map(genre => genre.name).join(', ');
      video = (details.videos.results).filter(data => ((data.type === 'Trailer' || data.type === 'Teaser') && data.site==='YouTube') )[0] ;
    }

    console.log(details);
    console.log(video);
    
    
const closeModal = (event)=>{
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      )
    }
    ref.current.close();
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

        <h2> {type==="movie"?details["title"]:details["name"]} </h2>
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
