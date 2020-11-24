import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core';
import { WebshopPicture } from "./picture-component";
import { MyButton } from "./mybutton";
import moment from 'moment';
import { useLogout } from "./user-hooks/user-hooks";
import { EndOfLineState } from "typescript";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: '30px 60px',
    borderRadius: '30px',
    color: theme.palette.secondary.contrastText,
    marginTop: '-120px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.down(700)]: {
        marginLeft: '7px',
        marginRight: '7px',
        width: 'calc(100% - 14px)',
    },
    [theme.breakpoints.down(1000)]: {
        marginTop: '-5px',
    }
  },
  formDiv: {
    width: 'calc(100% - 20px)',
    minHeight: '320px',
    display: 'flex',
    marginLeft: '10px',
    flexFlow: 'column',
    marginRight: '10px',
    flexWrap: 'wrap',
    alignItems: 'left',
    paddingBottom: '10px',
  },
  infoElement: {
    fontSize: '15px',
    marginBottom: '15px',
  },
  element: {
    width: '100%',
    marginBottom: '20px',
  },
  picture: {
    width: '550px',
    position: 'relative',
    zIndex: 1,
    marginLeft: '55%',
    marginTop: '-200px'
  },
  link: {
    alignSelf: 'start',
    color: '#3B2E2E',
    cursor: 'pointer',
    textDecoration: 'underline',
    ['&:hover']:{
      color: '#707070'
    }
  }
}))

export interface Props{
  teamName:string;
  categoryName: string;
  categoryStart: moment.Moment;
  categoryEnd: moment.Moment;
  setInfo: (val:boolean)=>any;
  teamInProgress: boolean;
  teamFinished: boolean;
}

export const Infos = (props:Props) => {
  let now = moment();
  let enabled = props.categoryStart && props.categoryEnd && props.categoryStart.isBefore(now) && props.categoryEnd.isAfter(now);
  const [timerStarted, setTimerStarted] = useState(false);
  const [enabledState, setEnabledState] = useState(enabled);
const logout = useLogout();
const classes = useStyles();
const checkDeadlines = (start:moment.Moment, end: moment.Moment)=> {
  let now = moment();
  let enabled2 = start?.isBefore(now) && end?.isAfter(now);
  if(enabled2 !== enabledState ){
    setEnabledState(enabled2);
  }
}
useEffect(()=>{
  if(!timerStarted && props.categoryStart){
    setInterval(checkDeadlines, 1000,props.categoryStart, props.categoryEnd);
    setTimerStarted(true);
  }
}, [props.categoryStart])

return <div className={classes.root} style={{maxHeight: '400px'}}>
  <div style={{position: "relative", zIndex: 2, minHeight: '320px'}}>
                  <div className={classes.formDiv}>
                    <div className = {classes.infoElement}><b>Csapatnév:</b> {props.teamName}</div>
                    <div className = {classes.infoElement}><b>Kategória:</b> {props.categoryName}</div>
                    <div className = {classes.infoElement}><b>Kitöltés kezdete:</b> {props.categoryStart?.format("YYYY:MM:DD HH:mm")}</div>
                    <div className = {classes.infoElement}><b>Kitöltés vége:</b> {props.categoryEnd?.format("YYYY:MM:DD HH:mm")}</div>
                    <div style={{display: 'flex', flex: 1}}></div>
                      <MyButton type='button' label={props.teamInProgress?"Kitöltés folytatása":(props.teamFinished?"Eredmények megtekintése":"Kitöltés megkezdése")} onClick={(event:any)=>{props.setInfo(false)}}
                          className = {classes.element} disabled={!enabledState && !props.teamFinished}/>
                  <a className={classes.link} onClick={()=>{logout()}}>
                    Kijelentkezés
                  </a>
                  </div>
                </div>
          <WebshopPicture className={classes.picture} picture={{webPUrl: '/logo_kicsik_nagyok.png', jpegOrPngUrl: '/logo_kicsik_nagyok.png', alt: 'login', title: 'login'}}/>
      </div>;
}