//user can rate each day in month according to personalized legend
//can be used for mood or weather rating etc....
// items saved as soon as they are changed on page. shouldn't be able to change fast enough to casue issue
//  else impliment a save button
//
//  db data in: [{
    //   rank_id: 15, 
    //   date: '2024-12-01T07:00:00.000Z', 
    //   fk_status: '76ae695f-9784-46b3-92c2-996d9af76892', 
    //   color: 'red'}...]
//  data internal: [{
    // id: '15', 
    // date: "2024-11-09T07:00:00.000Z",
    // color: 'red'}, ...]
//
//-------------------------------------------------------------
// how to have dynamic legend? or legend set on creation
// notes creates data structure preemtivley. goals doesnt, read into structure at load. how for ranks?
//may need to save rank page on settings to easily load top legend
//can data structuring for each page be the same? mov into external util?
// use status component for legend? limited color availablity
// https://www.chakra-ui.com/docs/components/color-swatch
// post patch running a little slow, come back for potential optimization
//use rank int later to allow for dynamic color legend
//double check saved items not over writing
"use client"

import Image from "next/image";
import styles from "@/app/page.module.css";
import { daysInMonth, date, firstDayOfMonth, getDaysInMonth } from "@/utils/dateUtils"
import { 
  Box,
  Button, 
  SimpleGrid,
  Status 
 } from '@chakra-ui/react'
import React, { useState, useEffect } from "react";
import { SubHeader } from '@/components/SubHeader';
import { useParams } from 'next/navigation';

export default function Ranking() {

  const [colorLegend, setColorLegend] = useState([]);
  //doesn't need to be stately??
  const [status, setStatus] = useState({ id: null, color: null });
  const [activeDate, setActiveDate] = useState(date);
  const [activeData, setActiveData] = useState([]);
 
  //let pgID = '6a54003e-8260-4245-b073-221ca81f6c66'
  const { pgID } = useParams();

  useEffect(() => {
    getRanksPage()
  },[activeDate.getMonth()]);

  // make empty data structure for month
  const emptyDataStructure = (activeDate) => {
    let firstDate = new Date(activeDate.getFullYear(), activeDate.getMonth(),'01')
    let temp = Array(getDaysInMonth(activeDate)).fill(null).map((_, i) => {
      const newDate = new Date(firstDate);
      newDate.setDate(firstDate.getDate() + i);
      return {id: null, date: newDate, color: null};
    })
    return temp
  }

  //status doesnt NEED to be sent...
  const handlePostPatch = (rankDay) => {
    // if selected date has existing ranking data patch, else post
    if (rankDay.id != null) {
      patchRank(rankDay.id, status)
    } else { postRank(rankDay.date, status)  }
  };

  const testFunc = () => {
    console.log('check date', activeDate, ':', activeData, 'status:', status)
  }

  const getRanksPage = async () => {
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
        //set color legend should only run once, not on every call when month is changed. seperate call?
        setColorLegend(response.legend)

        //set rank @ date location in dates array, set in og state
        // use stored date to place data in correct order
        for (let rankItem of response.ranks){
          let date = new Date(rankItem.date)
          temp[date.getDate() - 1].id = rankItem.rank_id,
          temp[date.getDate() - 1].date = date,
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

  const postRank = async (date, status) => {
    try {
      const res = await fetch(`/api/ranks`,{
        method: 'POST',
        body: JSON.stringify({pgID: pgID, date: date, statusID: status.id}),
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        console.log("Yeai! POST",response);
        // use response to update active data state
        let date = new Date(response.date);
        let found = colorLegend.find((colorData) => colorData.id === response.fk_status);

        let temp = [...activeData];
        temp[date.getDate() - 1] = {
          id: response.id,
          date: date,
          color: found.color
        }

        setActiveData(temp);
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
  }

  const patchRank = async (id, status) => {
    try {
      const res = await fetch(`/api/ranks/${id}`,{
        method: 'PATCH',
        body: JSON.stringify({statusID: status.id}),
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        console.log("Yeai! PATCH",response)
        // use response to update active data state
        let date = new Date(response.date)
        let found = colorLegend.find((colorData) => colorData.id === response.fk_status)
        let temp = [...activeData];

        temp[date.getDate() - 1] = {
          ...temp[date.getDate() - 1],
          color: found.color
        }

        setActiveData(temp);
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

        LEGEND 
        <SimpleGrid columns={7} spacing={1}>
            {colorLegend.map((legend, i) => {
              return <Button key={`${legend.id}`} colorScheme={legend.color} height='10px' onClick={() => setStatus({id:legend.id, color:legend.color})} ></Button>

            })}
        </SimpleGrid>

        <SimpleGrid columns={7} spacing={1}> {/*  empty slots */}
          {[...Array(firstDayOfMonth)].map(function(object, i){
            return <Button key={i} height='20px'/> ;
          })}

          {activeData.map((day, i) => {
            return <Button key={`${i} ${day.color}`} height='20px' colorScheme={day.color || 'gray'} onClick={() => handlePostPatch(day) } >{i+1}</Button>

          })}
        </SimpleGrid>

      </main>
      
      <footer >
        <Box position='fixed' bottom='1em' right='1em' >
          <Button onClick={() => {testFunc()}} colorScheme='green'> Test</Button>
          {/* <Button onClick={() => {handlePostPatch()}} colorScheme='green'>Save</Button> */}
        </Box>
      </footer>
    </div>
  );
}
