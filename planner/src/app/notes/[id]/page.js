//user will make small notes on each day
//
//  db data in: [{
        // date : "2024-11-09T07:00:00.000Z"
        // fk_note_pg : "5f70f8be-164d-4762-bbdd-9c5c2b46d48b"
        // id : "364a218d-36b9-443e-bce1-27f44ba8a861"
        // note : "and then this"}, ...]
//  data internal: [{
        // date : Tue Nov 05 2024 00:00:00 GMT-0700 (Mountain Standard Time) {}
        // id : "83d75eff-5b02-4c4f-97bf-f80747fa669e"
        // note : "test5"}, ...(~30 length)]
//
//-------------------------------------------------------------
// different structure of date from db vs userData presets... problem?
// eventually save via debounce??? maybe
// deleted note will be empty string in db
// renaming needed for page id. confusing
// to avoid unnecessary call to db, reset dbdatacopy while saving
// dont include not page id in original get, not necessary\
// date data comes in as date string, should be date obj, will need to be coverted lots :s
// userData (name change-> active data). 
// active data. should we only store active notes instead of placing it in array via date...
// do more data structuring on back end?
"use client"

import styles from "@/app/page.module.css";
import { daysInMonth, date, firstDayOfMonth } from "@/utils/dateUtils.js"
import {   
  Box,
  Button,
  Input, 
  InputGroup, 
  InputLeftAddon,
  VStack } from '@chakra-ui/react';
import { colorLegend } from '@/utils/mockData.js';
import React, { useState, useEffect, useRef } from "react";
import { SubHeader } from '@/components/SubHeader';
import { useParams } from 'next/navigation';

export default function Notes() {
  let user_id = 0;
   //let pgID = '5f70f8be-164d-4762-bbdd-9c5c2b46d48b'
  const {id} = useParams();
  const [activeDate, setActiveDate] = useState(date);
  const ref = useRef();

  let firstDate = new Date(activeDate.getFullYear(), activeDate.getMonth(),'01')
  let hold = Array(daysInMonth).fill(null).map((_, i) => {
    const newDate = new Date(firstDate);
    newDate.setDate(firstDate.getDate() + i);
    return {id: null, date: newDate, note: null};
  })

  const [userData, setData] = useState(hold);
  const [dbDataCopy, setDataCopy] = useState();  // set by initial call. updated on save
  //let dbDataCopy = [];

  useEffect(() => {
    getNotes()
    ref.current.children[activeDate.getDate()].scrollIntoView({ behavior: 'smooth', block: 'center' })
  },[activeDate]);

  const getNotes = async () => {
    try {
      const res = await fetch(`/api/notesPages/${id}?activeDate=${activeDate}`,{
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        let temp = [...userData];
        // best is date is date obj, not string
        setDataCopy(response);

        //set note @ date location in dates array, set in og state
        // use stored date to place data in correct order
        // i dont love this...
        for (let noteItem of response){
          let date = new Date(noteItem.date)
          temp[date.getDate() - 1].id = noteItem.id
          temp[date.getDate() - 1].note = noteItem.note
        }
        setData(temp);
        console.log("Yeai!",response)
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
  }

  const postNotes = async (newNotes) => {
    try {
      const res = await fetch(`/api/notes/${id}?activeDate=${activeDate}`,{
        method: 'POST',
        body: JSON.stringify({id: id, notes: newNotes}),
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        console.log("Yeai! POST",response)
        let temp = [...dbDataCopy, ...response]
        setDataCopy(temp);
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
  }

  const patchNotes = async (newNotes) => {
    try {
      const res = await fetch(`/api/notes/${id}?activeDate=${activeDate}`,{
        method: 'PATCH',
        body: JSON.stringify({id: id, notes: newNotes}),
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        console.log("Yeai! PATCH",response)
        //update db data copy. all edit items will exist in db data copy
        // wtf. not necessary????
        let temp = dbDataCopy.map((noteItem) => {
          let found = response.find((responseNote) => noteItem.id === responseNote.id)
          // :s
          noteItem.note = found ? found.note : noteItem.note;
          return noteItem
        })
        setDataCopy(temp)

      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
  }

// comapre initial data pull to current data to determine post or patch. 
//    will need to force reload or continued edit will be a problem
//  is this too cumbersome. is there an easier way?
  const handlePostPatch = () => {
    let patchFiltered = [];
    let postFiltered = [];
    
    // patch - not null. not in og data
    // post - not null. in og data but edited note
    userData.map((day) => {
      if(day.note){    //not null
        let found = dbDataCopy.find((dbDay) => {
          let typedDate = new Date(dbDay.date);
          return +day.date === +typedDate
        })

        if (found){  //in og data, add note id item to be patched
          if (found.note !== day.note) {
            patchFiltered.push({id: found.id, ...day})

          }           // else - items already saved that don't need to be saved/unedited
        } else {    //not in og data
          postFiltered.push(day)
        }
      }
    })
    if (patchFiltered.length>0){patchNotes(patchFiltered);}
    if (postFiltered.length>0){postNotes(postFiltered);}
    //reset dbdatacopy 
    console.log('postpatch', postFiltered,patchFiltered)
  }

  //update state with user input
  const handleChange = (input, i) => {
    let temp = [...userData];
    temp[i].note = input;
    setData(temp);
  }

  const testFunc = () => {
    console.log('check dbcopy state', dbDataCopy, 'compare', userData)
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
      <SubHeader activeDate={activeDate} setActiveDate= {setActiveDate}/>

        LIL NOTES
        <VStack
          spacing={3}
          align='stretch'
          ref={ref}>

          {userData.map((day, i) => {
            let value = '...'

            if (day.note) {
              value = day.note
            } 

            return <InputGroup key={`${i}, ${day.id}`} size='sm'>
              <InputLeftAddon  w='40px' backgroundColor={colorLegend[i % colorLegend.length]} justifyContent="center"> {i+1}</InputLeftAddon>
              <Input paddingLeft={3} placeholder={`${value}`} onChange={(e) => handleChange(e.target.value, i)} variant='flushed' maxLength={5} />
              </InputGroup>
          })}
            
        </VStack>
      </main>

      <footer >
        <Box position='fixed' bottom='1em' right='1em' >
          <Button onClick={() => {testFunc()}} colorScheme='green'> Test</Button>
          <Button onClick={() => {handlePostPatch()}} colorScheme='green'>Save</Button>
        </Box>
      </footer>

    </div>
  );
}
