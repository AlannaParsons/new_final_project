// returns rank data for single given date
//  db data in: {
    // rank_id: 37, 
    // date: '2024-12-10T07:00:00.000Z', 
    // fk_status: '046247cb-398f-4b0e-954c-3c0d7e1f64b1', 
    // color: 'blue', 
    // phrase: 'better'
    //}
  //how to handle deleted items. note deleting properly?
//-------------------------------------------------------------

"use client"

import {
  Box,
  Spinner,
  Tag
} from '@chakra-ui/react';
import React, { useState, useEffect } from "react";

export default function DateRank({props}) {
  const [activeData, setActiveData] = useState(props);
  let placeholder = 'not ranked'

  // useEffect(() => {
  //   if(!props) { return };
  //   getRank()
  // }, []);
//put in .map
console.log('inside ranks what have', activeData)

  return (
    <Box> 
      { activeData ? (
        <div>
          {activeData.map((rankPG) => {         
            return (
              <Tag key={rankPG.id} variant='solid' colorScheme={rankPG.completed === null ? 'red' : rankPG.color }>
                { rankPG.title } 
                {' : '}
                { rankPG.phrase ? rankPG.phrase : placeholder}
              </Tag> 
            ) 
          })}
        </div>
        ) : (
          <Spinner></Spinner>
        )
      }
    </Box>
  );
};