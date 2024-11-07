//user will make small notes on each day
//would like to auto orient to current day
"use client"

import Image from "next/image";
import styles from "../page.module.css";
import { daysInMonth, date, firstDayOfMonth } from "../../utils/dateUtils.js"
import {   
  Input, 
  InputGroup, 
  InputLeftAddon,
  VStack } from '@chakra-ui/react';
import { colorLegend } from '../../utils/mockData.js';
import React, { useState, useEffect } from "react";

export default function Notes() {
  let user_id = 0;
  //create empty data repo
  let hold = Array(daysInMonth).fill(null).map((_, i) => {
    let index = i % colorLegend.length;
    return {color: colorLegend[index], note: null}
  })

  const [userData, setData] = useState(hold);
  //should date be handled by front end? would allow user to go back to prev date easily?
  //match year and month on back end. strip? ordering by date enough?

  const getNotes = async (user_id, date) => {
    try {
      const res = await fetch(`/api/notes`,{
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        let temp = userData;

        for (let noteItem of response){
          let date = new Date(noteItem.date)
          temp[date.getDate()].note = noteItem.note;
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
  //date.getDate()

  //think about data here...
  // [index {color: '' note: '' }]

  useEffect(() => {

    getNotes(user_id)

  },[]);

  const handleChange = () => {
    console.log('handling change super well')
  }

  console.log('notes:',userData)


  return (
    <div className={styles.page}>
      <main className={styles.main}>

        LIL NOTES
        <VStack
          spacing={3}
          align='stretch'>

          {userData.map((date, i) => {
            return <InputGroup key={`${i}`} size='sm'>
              <InputLeftAddon  w='40px' backgroundColor={date.color} justifyContent="center"> {i+1}</InputLeftAddon>
              <Input paddingLeft={3} placeholder={`${userData.note}`} onChange={() => handleChange()} variant='flushed' maxLength={5} />
            </InputGroup>
          })}
            
        </VStack>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              // src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
