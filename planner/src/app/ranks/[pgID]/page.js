//user can rate each day in month according to personalized legend
//can be used for mood or weather rating etc....
//-------------------------------------------------------------
// how to have dynamic legend? or legend set on creation
// notes creates data structure preemtivley. goals doesnt, read into structure at load. how for ranks?
//may need to save rank page on settings to easily load top legend
//can data structuring for each page be the same? mov into external util?
"use client"

import Image from "next/image";
import styles from "@/app/page.module.css";
import { daysInMonth, date, firstDayOfMonth, getDaysInMonth } from "@/utils/dateUtils"
import { 
  Box,
  Button, SimpleGrid } from '@chakra-ui/react'
import React, { useState, useEffect } from "react";
import { SubHeader } from '@/components/SubHeader';
import { useParams } from 'next/navigation';

export default function Rating() {
//sets up faux saved data!!
  const colorLegend = ['pink', 'red', 'yellow', 'green','blue', 'purple']
  const [color, setColor] = useState(colorLegend[0]);
  const [savedData, setData] = useState(Array(daysInMonth).fill({ color: null }));
  const [activeDate, setActiveDate] = useState(date);
  const [activeData, setActiveData] = useState([]);

     //let pgID = '6a54003e-8260-4245-b073-221ca81f6c66'
     const {pgID} = useParams();

  useEffect(() => {
    getRanks()
  },[]);

  // make empty data structure for month
  const emptyDataStructure = (activeDate) => {
    let firstDate = new Date(activeDate.getFullYear(), activeDate.getMonth(),'01')
    let temp = Array(getDaysInMonth(activeDate)).fill(null).map((_, i) => {
      const newDate = new Date(firstDate);
      newDate.setDate(firstDate.getDate() + i);
      return {id: null, color: null};
    })
    console.log('make month data',temp)
    return temp
  }

  const colorLock = (color) => {
    setColor(color);
  };
  const colorPut = (index) => {
    let helper = [...savedData]
    helper[index] = {...helper[index], color: color};
    setData(helper);
  };

  const testFunc = () => {
    console.log('check date', activeDate, ':',savedData, activeData)
  }

  const getRanks = async () => {

    try {
      const res = await fetch(`/api/ranksPages/${pgID}?activeDate=${activeDate}`,{
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        console.log("Yeai!",response)
        let temp = emptyDataStructure(activeDate);

        //set note @ date location in dates array, set in og state
        // use stored date to place data in correct order
        for (let rankItem of response){
          let date = new Date(rankItem.date)
          temp[date.getDate() - 1].id = rankItem.id
          temp[date.getDate() - 1].color = rankItem.color
        }
        setActiveData(temp)
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
  }

  const getRanksLegend = async () => {

    try {
      const res = await fetch(`/api/ranksPages/${pgID}`,{
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        let temp = [];

        //data structuring
        for (let rankedItem of response){
          let date = new Date(rankedItem.date)
          temp[date.getDate() - 1].id = noteItem.id
          temp[date.getDate() - 1].note = noteItem.note
        }
        

        console.log("Yeai!",response)
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
  }


  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
      <SubHeader activeDate={activeDate} setActiveDate= {setActiveDate}/>


        LEGEND {firstDayOfMonth}
        <SimpleGrid columns={7} spacing={1}>
            {colorLegend.map((color, i) => {
              return <Button key={`${color}`} colorScheme={color} height='10px' onClick={() => colorLock(color)} ></Button>

            })}
        </SimpleGrid>

        <SimpleGrid columns={7} spacing={1}> {/*  empty slots */}
          {[...Array(firstDayOfMonth)].map(function(object, i){
            return <Button key={i} height='20px'/> ;
          })}

          {activeData.map((date, i) => {
            return <Button key={`${i} ${color}`} height='20px' colorScheme={date.color || 'gray'} onClick={() => colorPut(i) } >{i+1}</Button>

          })}
        </SimpleGrid>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="https://nextjs.org/icons/vercel.svg"
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
      
      <footer >
        <Box position='fixed' bottom='1em' right='1em' >
          <Button onClick={() => {testFunc()}} colorScheme='green'> Test</Button>
        </Box>
      </footer>
    </div>
  );
}
