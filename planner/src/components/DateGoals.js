// returns goals data for single given date
//
//  db data in: [{
  // completed : "2024-12-10T07:00:00.000Z"
  // fk_goal_pg : "f348abf8-6a35-4f4f-a275-bf4aab188f1d"
  // id : "27e6f92f-23bb-49e0-87ec-796568eaef0e"
  // title : "exercise" }, ... ] 
//
//-------------------------------------------------------------

"use client"

import {
  Box,
  Spinner,
  Tag
} from '@chakra-ui/react';
import React, { useState, useEffect, Fragment } from "react";

export default function DateNote({props}) {
  //not necessary to put into state.... 
  const [activeData, setActiveData] = useState(props);
  console.log('inside goals what have', activeData)
  // useEffect(() => {
  //   if(!props) { return };
  // }, []);
  // colorScheme={goal.completed === null ? 'blue' : 'red'
  //<Fragment  key={activeData[page].id}></Fragment>
  
  return (
    <Box> 
      { activeData ? (
        <div>
          {activeData.map((goalPG) => {         
            return (
              <Fragment  key={goalPG.id}>
                {goalPG.goals.map((goal) => {
                
                  return <Tag key={goal.goal_id} variant='solid' colorScheme={goal.completed === null ? 'red' : 'blue' }>
                    {goal.title}
                  </Tag> 
                })}
              </Fragment>
            ) 
          })
          }
        </div>
      ) : (
        <Spinner></Spinner>
      )
      }
    </Box>
  );
};