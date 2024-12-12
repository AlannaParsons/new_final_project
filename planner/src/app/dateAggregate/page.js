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
// get page to load all pages w saved data
// error handling for not data on given date
// date traversal
// dynamic piecing together of page data. tile system
//individual data point keys can be null if not set for that day. problem? or used for empty placeholder?

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
import React, { useState, useEffect, Fragment } from "react";
import { SubHeader } from '@/components/SubHeader';
import DateRank from '@/components/DateRank';
import DateNote from '@/components/DateNote';
import DateGoals from '@/components/DateGoals';

export default function DateAggrigate() {
  // pointless if i move to local storage...
  let user = '3958dc9e-712f-4377-85e9-fec4b6a6442a';
  const [activeDate, setActiveDate] = useState(date);
  // single piece of data per page
  const [activeData, setActiveData] = useState({});


  useEffect(() => {
    getPages(user)
  }, [activeDate]);

  const getPages = async () => {
    try {
      const res = await fetch(`/api/dateAggregate?activeDate=${activeDate}`,{
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        setActiveData(response);
        
        console.log("Yeai!",response)
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
  }

  const testFunc = () => {
    console.log('check date', activeDate, activeData)

  }
// rerendering every components when 1 component changes.... use seperate states?
  const functionMap = {
    'notes':  <DateNote activeData={activeData}> </DateNote>,
    'ranks': <DateRank activeData={activeData}> </DateRank>,
    'goals': <DateGoals activeData={activeData}> </DateGoals>
  }



  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <SubHeader activeDate={activeDate} setActiveDate={setActiveDate} />

        LEGEND
        {}
        
        <HStack>
          {Object.keys(activeData).map((page) => {
                    // if we want dynamic, spuratic tiles, this wont work
                    console.log('page map')
                    //if else instead of map>? react dynamic component rendering

            return  <Fragment key={page}>{functionMap[page]}</Fragment>
          })}

        </HStack>

      </main>

      <footer >
        <Button onClick={() => {testFunc()}} colorScheme='green'> Test</Button>

      </footer>
    </div>
  );
}
