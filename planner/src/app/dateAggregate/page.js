//user can see all seperate page info for given day. cannot edit here?
//
//  db data in: [{
  // 0 : {
    //   id: '5f70f8be-164d-4762-bbdd-9c5c2b46d48b', 
    //   fk_user: '3958dc9e-712f-4377-85e9-fec4b6a6442a', 
    //   type: 'notes', 
    //   title: 'gratitude'
    // }, 
// etc...]
//
//-------------------------------------------------------------
// get page to load all pages w saved data
// dynamic piecing together of page data. tile system
//individual data point keys can be null if not set for that day. problem? or used for empty placeholder?
//https://en.m.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
//https://www.dhiwise.com/post/the-importance-of-react-dynamic-component-name-insights\
// initial load to set order, when date changes, order should not
// call made whenever date is changed... problem? too many calls? alternative sending all data would be too much?
// fix layout
"use client"

import styles from "@/app/page.module.css";
import { date, firstDayOfMonth, getDaysInMonth } from "@/utils/dateUtils"
import {
  Box,
  Button,
  HStack,
  SimpleGrid,
  Spinner,
  Tag,
  TagLabel,
  useToast
} from '@chakra-ui/react';
import React, { useState, useEffect, Fragment } from "react";
import { SubHeader } from '@/components/SubHeader';
import DateRanks from '@/components/DateRanks';
import DateNotes from '@/components/DateNotes';
//import DateGoals from '@/components/DateGoals';

export default function DateAggrigate() {
  // pointless if i move to local storage...
  let user = '3958dc9e-712f-4377-85e9-fec4b6a6442a';
  const [activeDate, setActiveDate] = useState(date);
  const [initialLoad, setInitialLoad] = useState(true);
  // single piece of data per page
  const [activeData, setActiveData] = useState([]);

  //shuffle order on page load


  //maintain page prder, get necessary date data
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
        //shuffling in place? may not be necessary?
        console.log('states', initialLoad)
        if (initialLoad) {
          //check if shuffle is necessary? grabbing data at random so original order always random? trust this>?
          shuffleArray(response)
          setInitialLoad(false)
          setActiveData(response)
        } else {
      
          //feels cumbersum? 
          // update every item in array, to maintain layout w new date info. will work w react????
          let temp = activeData.map((activeDataTemp) => {
            //for each active data page, find matching id inside response, once found, replace active data w response info
            let found = response.find((responsePG) => {
              return responsePG.id == activeDataTemp.id
            })
            return found
          })

          setActiveData(temp);
        }
        
        console.log("Yeai!",response)
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
  }

  const testFunc = () => {
    console.log('check date', activeDate, activeData, Object.values(activeData))

  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const dynamicComponent = (page) => {
    //wrapping page into dynamic component
    const Component = require(`@/components/Date${page.type.replace(/^./, char => char.toUpperCase())}`).default;
    return <Component {...page} />;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <SubHeader activeDate={activeDate} setActiveDate={setActiveDate} />
        {activeData.length > 0 ? (
          <HStack>
            {activeData?.map((page) => {
              return  <Fragment key={page.id}>{dynamicComponent(page)}</Fragment>
            })}
          </HStack>
        ) : (
          <Spinner></Spinner>
        )}
      </main>

      <footer className={styles.footer}>
        <Button onClick={() => {testFunc()}} colorScheme='green'> Test</Button>
      </footer>
    </div>
  );
}
