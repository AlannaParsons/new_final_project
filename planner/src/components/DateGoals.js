// returns goals data for single given date
//
//-------------------------------------------------------------

"use client"

import {
  Box,
  Spinner,
  Tag
} from '@chakra-ui/react';
import React, { useState, useEffect } from "react";

export default function DateNote( props) {
  const [activeData, setActiveData] = useState();

  useEffect(() => {
    if(!props) { return };
    getGoals()
  }, []);
  
  const getGoals = async () => {
    try {
      const res = await fetch(`/api/goals?activeDate=${props.activeDate}`,{
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        setActiveData(response)
        console.log("GOALS!",response)
      }else{
        console.log("Oops! Something is wrong.")
      }
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <Box> 
      { activeData ? (
        <div>
          {activeData.map((goal) => {          
           return <Tag key={goal.id} variant='solid' colorScheme={goal.completed === null ? 'blue' : 'red' }>
            {goal.title}
          </Tag> })
          }
        </div>

        ) : (
          <Spinner></Spinner>
        )
      }
    </Box>
  );
};