//user can see all seperate page info for given day. cannot edit here?
//
//  db data in: [{
  // fk_user :  "3958dc9e-712f-4377-85e9-fec4b6a6442a"
  // id : "5f70f8be-164d-4762-bbdd-9c5c2b46d48b"
  // type : "notes"
//  data internal: [{
//
//-------------------------------------------------------------
// re organize components necessary for this page? all 1 file?

"use client"

import styles from "@/app/page.module.css";
import { date, firstDayOfMonth, getDaysInMonth } from "@/utils/dateUtils"
import {
  Box,
  Button,
  HStack,
  SimpleGrid,
  Tag,
  TagLabel,
  useToast
} from '@chakra-ui/react';
import React, { useState, useEffect } from "react";
import { SubHeader } from '@/components/SubHeader';
import DateRank from '@/components/DateRank';
import DateNote from '@/components/DateNote';
import DateGoals from '@/components/DateGoals';

export default function DateAggrigate() {
  let user = '3958dc9e-712f-4377-85e9-fec4b6a6442a';
  const [activeDate, setActiveDate] = useState(date);
  //doesnt need to be stately
  const [userPages, setUserPages] = useState([]);
  //const functionMap = {'notes': , 'ranks', 'goals'}

  useEffect(() => {
    getPages(user)
  }, []);

  const getPages = async (userID) => {
    try {
      const res = await fetch(`/api/header/${userID}`,{
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        setUserPages(response);
        
        console.log("Yeai!",response)
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
  }

  const getGoals = async () => {

    try {
      const res = await fetch(`/api/notesPages/${id}?activeDate=${activeDate}`,{
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        let temp = emptyDataStructure(activeDate);
        setDataCopy(response);

        //set note @ date location in dates array, set in og state
        // use stored date to place data in correct order
        for (let noteItem of response){
          let date = new Date(noteItem.date)
          temp[date.getDate() - 1].id = noteItem.id
          temp[date.getDate() - 1].note = noteItem.note
        }
        setActiveData(temp);
        console.log("Yeai!",response)
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
  }

  const DateGoals = async (userID) => {
    <SimpleGrid columns={7} spacing={1}> {/*  empty slots */}
    {[...Array(firstDayOfMonth)].map(function (object, i) {
      return <Button key={i} height='20px' />;
    })}

    {activeData.map((day, i) => {
      return <Button key={`${i} ${day.color}`} height='20px' colorScheme={day.color || 'gray'} onClick={() => handleDateClick(day)} >{i + 1}</Button>

    })}
  </SimpleGrid>
  }



  const testFunc = () => {
    console.log('check date', userPages)
    let date = new Date('2024-12-10')
    console.log('check date', activeDate, activeDate.setHours(0, 0, 0, 0) == date)
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <SubHeader activeDate={activeDate} setActiveDate={setActiveDate} />

        LEGEND

        {/* <HStack>
          {userPages.map((page) => {
            return  <Box key={`${page.id}`} >                 
              {page.type} 
            </Box>
          })}

        </HStack> */}

        
        {/* <HStack>
          {userPages.map((page) => {
            functionmap.page.type
            return  <Box key={`${page.id}`} >                 
              {page.type} 
            </Box>
          })}

        </HStack> */}
        <DateRank activeDate={activeDate}> </DateRank>
        <DateNote activeDate={activeDate}> </DateNote>
        <DateGoals activeDate={activeDate}> </DateGoals>

      </main>

      <footer >
        <Button onClick={() => {testFunc()}} colorScheme='green'> Test</Button>

      </footer>
    </div>
  );
}
