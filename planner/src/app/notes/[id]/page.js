//user will make small notes on each day
//
//  db data in: [{id: '3958dc9e-712f-4377-85e9-fec4b6a6442a', fk_note_pg: '5f70f8be-164d-4762-bbdd-9c5c2b46d48b', date: '2024-11-08T07:00:00.000Z', note: 'lorum'}...]
//  data internal: [{date: '2024-11-08T07:00:00.000Z', color: 'yellow', note: 'lorum'}...(~30)]
//
//-------------------------------------------------------------
// different structure of date from db vs userData presets... problem?
// eventually save via debounce??? maybe
// deleted note will be empty string in db
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

  //create empty data structure
  let firstDate = new Date(activeDate.getFullYear(), activeDate.getMonth(),'01')
  let hold = Array(daysInMonth).fill(null).map((_, i) => {
    let index = i % colorLegend.length;
    const newDate = new Date(firstDate);
    newDate.setDate(firstDate.getDate() + i);
    return {date: newDate, color: colorLegend[index], note: null};
  })

  const [userData, setData] = useState(hold);
  // may not need to be state obj, revisit
  const [dbDataCopy, setDataCopy] = useState();

  useEffect(() => {
    getNotes()
    ref.current.children[activeDate.getDate()].scrollIntoView({ behavior: 'smooth', block: 'center' })

  },[]);

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

        //structure internal data for best use?
        // use stored date to place data in correct order
        for (let noteItem of response){
          let date = new Date(noteItem.date)
          temp[date.getDate() - 1].note = noteItem.note
        }
        setData(temp);
        setDataCopy(response)
        
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
    //necessary? not likely
    patchFiltered = [];
    postFiltered = [];
  }

  //update state with user input
  const handleChange = (input, i) => {
    let temp = [...userData];
    temp[i].note = input;
    setData(temp);
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

            return <InputGroup key={`${i}, ${day.color}`} size='sm'>
              <InputLeftAddon  w='40px' backgroundColor={day.color} justifyContent="center"> {i+1}</InputLeftAddon>
              <Input paddingLeft={3} placeholder={`${value}`} onChange={(e) => handleChange(e.target.value, i)} variant='flushed' maxLength={5} />
              </InputGroup>
          })}
            
        </VStack>
      </main>

      <footer >
        <Box position='fixed' bottom='1em' right='1em' >
          <Button onClick={() => {handlePostPatch()}} colorScheme='green'>Save</Button>
        </Box>
      </footer>

    </div>
  );
}
