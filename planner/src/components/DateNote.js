// returns note data for single given date
//  db data in: 
  // {note: 'fill'}
  //add a .completed like other data sets?
// maybe create fully seperate empty tag if no note set
//-------------------------------------------------------------

"use client"

import {
  Box,
  Spinner,
  Tag
} from '@chakra-ui/react';
import React, { useState, useEffect } from "react";

export default function DateNote({props}) {
  const [activeData, setActiveData] = useState(props);
  let placeholder = 'no notes'; // put inside tag? 

  // useEffect(() => {
  //   if(!props) { return };
  //   getNote()
  // }, []);
  console.log('inside notes what have', activeData)

  return (
    <Box> 
      { activeData ? (
        <div>
          {activeData.map((notePG) => {         
            return (
              <Tag key={notePG.id} variant='solid' colorScheme={notePG.completed === null ? 'red' : 'blue' }>
                { notePG.note ? notePG.note : placeholder}
              </Tag> 
            ) 
          })}
        </div>
      ) : (
        <Spinner></Spinner>
      )}
    </Box>
  );
};