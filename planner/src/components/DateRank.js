// returns rank data for single given date
//
//-------------------------------------------------------------

"use client"

import {
  Box,
  Spinner,
  Tag
} from '@chakra-ui/react';
import React, { useState, useEffect } from "react";

export default function DateRank( props) {
  const [activeData, setActiveData] = useState();

  useEffect(() => {
    if(!props) { return };
    getRank()
  }, []);
  
  const getRank = async () => {
    try {
      const res = await fetch(`/api/ranks?activeDate=${props.activeDate}`,{
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
      
      if(res.ok){
        let response = await res.json()
        setActiveData(response)
        console.log("Yeai!",response)
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
          <Tag variant='solid' colorScheme={activeData.color}>
            {activeData.phrase}
          </Tag> 
        ) : (
          <Spinner></Spinner>
        )
      }
    </Box>
  );
};