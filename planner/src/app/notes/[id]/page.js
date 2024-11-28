//user will make small notes on each day
//how to handle if changed update note, if new, post note, no change, dont send...hm
// possiby filter data into 2 sets: postables and patchables
// send all postables and ptachables using a PUT. how to handle on back end. and back end not authoritative
// data in: [{id: '3958dc9e-712f-4377-85e9-fec4b6a6442a', fk_note_pg: '5f70f8be-164d-4762-bbdd-9c5c2b46d48b', date: '2024-11-08T07:00:00.000Z', note: 'lorum'}...]
//data internal: [{date: '2024-11-08T07:00:00.000Z', color: 'yellow', note: 'lorum'}...(~30)]
// different structure of date from db vs userData presets... problem?
//eventually save via debounce??? maybe
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
import { debounce } from "@/utils/funcs";
import React, { useState, useEffect, useRef } from "react";
import { SubHeader } from '@/components/SubHeader';
import { useParams } from 'next/navigation';

export default function Notes() {
  let user_id = 0;
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
  //let pgID = '5f70f8be-164d-4762-bbdd-9c5c2b46d48b'
   // expected to change
  const [userData, setData] = useState(hold);
  // copy expected not to change
  // i hate this... way around? rename. structured differentl
  const [userDataCopy, setDataCopy] = useState();

  //should date be handled by front end? would allow user to go back to prev date easily?
  //match year and month on back end. strip? ordering by date enough?
  useEffect(() => {
    getNotes()
    ref.current.children[activeDate.getDate()].scrollIntoView({ behavior: 'smooth', block: 'center' })

  },[]);

  const getNotes = async (userDataOrg, date) => {
    try {
      const res = await fetch(`/api/notes/${id}?activeDate=${activeDate}`,{
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        let temp = [...userData];
        userDataOrg = [...response]
        console.log('why nothing', userDataOrg, response)

        //structure internal data for best use?
        // use stored date to place data in correct order
        for (let noteItem of response){

          // let found = temp.find(obj => {
          //   let dateTyped = new Date (obj.date)
          //   console.log ('obj date', typeof obj.date, obj.date)
          //   return obj.date === date
          // })


          let date = new Date(noteItem.date)
          ///temp[date.getDate()] = {...temp[date.getDate()], ...noteItem} ;
          temp[date.getDate() - 1].note = noteItem.note
          //may change
          //temp[date.getDate()].date = noteItem.date
        }
        setData(temp);
        setDataCopy(response)
        console.log('notes?', userData)
        
        console.log("Yeai!",response)
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
  }

  const postNotes = async (user_id, date) => {

    let dateNoTime = new Date(activeDate.getFullYear(), activeDate.getMonth(), activeDate.getDate());


    try {
      const res = await fetch(`/api/notes/${id}?activeDate=${activeDate}`,{
        method: 'POST',
        body: JSON.stringify({id: goal.id, date: dateNoTime}),
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        let temp = [...userData];

        for (let noteItem of response){
          let date = new Date(noteItem.date)
          temp[date.getDate()].note = noteItem.note;
        }
        setData(temp);
        console.log('notes?', userData)
        
        console.log("Yeai!",response)
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
  }


  //date.getDate()

  //think about data here...
  // [index {color: '' note: '' }]


// comapre initial data pull to current data to determine post or patch. 
//    will need to force reload or continued edit will be a problem
  const handlePost = () => {
    console.log('handling post super well', userDataCopy)
    //patchfilter
    let patchFilter = userDataCopy.filter((day) => {

      let typedDate = new Date(day.date)
      
      //find original notes to find if changes have been made to notes
      console.log('what patchy', userData[typedDate.getDate() - 1].note === day.note)
      return userData[typedDate.getDate() - 1].note != day.note
      //date.note
    })
    //post filter
    console.log('patch filter items:',patchFilter)
  }

  //update state with user input
  const handleChange = debounce((input, date) => {

    let temp = [...userData];
    let found = temp.find(obj => {
      // room for typing issue
      return obj.date === date;
    })

    found.note = input;
    setData(temp) 
  })

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

            return <InputGroup key={`${i}, ${day.color}, ${day.note}`} size='sm'>
              <InputLeftAddon  w='40px' backgroundColor={day.color} justifyContent="center"> {i+1}</InputLeftAddon>
              <Input paddingLeft={3} placeholder={`${value}`} onChange={(e) => handleChange(e.target.value, day.date)} variant='flushed' maxLength={5} />
              </InputGroup>
          })}
            
        </VStack>
      </main>

      <footer >
        <Box position='fixed' bottom='1em' right='1em' >
          <Button onClick={() => {handlePost()}} colorScheme='green'>Save</Button>
        </Box>
      </footer>

    </div>
  );
}
